import React, { useEffect, useState } from "react";

// Sign-in only verifies ownership of the checkout email. Premium access is
// decided by the server-side entitlement table, never by an email field.
export default function PremiumRestorer({
  plan, onVerified, supabaseUrl, publishableKey,
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(
    () => localStorage.getItem("pp_pendingPremiumEmail") || ""
  );
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const authHeaders = {
    apikey: publishableKey,
    "Content-Type": "application/json",
  };

  function storeSession(session) {
    if (!session?.access_token || !session?.refresh_token) return;
    localStorage.setItem("pp_verifiedAuthSession", JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at ||
        Math.floor(Date.now() / 1000) + (Number(session.expires_in) || 3600),
    }));
  }

  async function verifyPurchase(accessToken) {
    const res = await fetch(supabaseUrl + "/functions/v1/restore-premium", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not verify your purchase.");
    if (!data.paid || !["premium", "standard"].includes(data.plan)) {
      setOpen(true);
      setMessage("No paid RealYou purchase was found for that verified email.");
      return;
    }
    onVerified(data);
    setOpen(false);
    setMessage(
      data.plan === "premium"
        ? "Premium restored. You may retake the assessment without paying again."
        : "Standard restored. You may retake the assessment without paying again."
    );
    setCode("");
    localStorage.removeItem("pp_pendingPremiumEmail");
  }

  async function refreshToken(session) {
    if (!session?.refresh_token) return null;
    if (session.access_token &&
        session.expires_at > Math.floor(Date.now() / 1000) + 90) {
      return session.access_token;
    }
    const res = await fetch(supabaseUrl + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!res.ok) {
      localStorage.removeItem("pp_verifiedAuthSession");
      return null;
    }
    const data = await res.json();
    storeSession(data);
    return data.access_token;
  }

  useEffect(() => {
    (async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        let token = hash.get("access_token");
        if (token) {
          storeSession({
            access_token: token,
            refresh_token: hash.get("refresh_token"),
            expires_in: Number(hash.get("expires_in") || 3600),
          });
          // Do not leave authentication tokens in the browser URL/history.
          window.history.replaceState({}, "", window.location.pathname + window.location.search);
        } else {
          const stored = JSON.parse(localStorage.getItem("pp_verifiedAuthSession") || "null");
          token = await refreshToken(stored);
        }
        if (token) await verifyPurchase(token);
      } catch (err) {
        console.warn("[RealYou] Purchase verification unavailable", err);
        setMessage("Unable to verify your purchase right now. Please try Restore Premium.");
      }
    })();
  }, []);

  async function requestEmail(event) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setMessage("Enter a valid checkout email address.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const redirectTo = window.location.origin + window.location.pathname;
      const response = await fetch(
        supabaseUrl + "/auth/v1/otp?redirect_to=" + encodeURIComponent(redirectTo),
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ email: address, create_user: true }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.msg || data.error_description || data.message ||
          "Unable to send the verification email.");
      }
      localStorage.setItem("pp_pendingPremiumEmail", address);
      setMessage("Check your email for the sign-in link or code. Return to RealYou after verifying. You will not be charged.");
    } catch (err) {
      setMessage(err.message || "Unable to send email.");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(supabaseUrl + "/auth/v1/verify", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: code.trim(),
          type: "email",
        }),
      });
      const session = await response.json().catch(() => ({}));
      if (!response.ok || !session.access_token) {
        throw new Error(session.msg || session.error_description ||
          "The verification code was not accepted.");
      }
      storeSession(session);
      await verifyPurchase(session.access_token);
    } catch (err) {
      setMessage(err.message || "Could not verify your email.");
    } finally {
      setBusy(false);
    }
  }

  const field = {
    width: "100%", boxSizing: "border-box", padding: "0.75rem",
    borderRadius: "10px", background: "#19243a",
    border: "1px solid #94a3b8", color: "#fff",
  };
  const primary = {
    background: "#4338ca", color: "white", border: 0,
    borderRadius: "10px", padding: "0.7rem 1rem", fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <>
      {plan !== "premium" && (
        <div style={{
          padding: "0.8rem 1rem", background: "#121a35",
          color: "#e5e7eb", borderBottom: "1px solid #475569",
          display: "flex", flexWrap: "wrap", gap: "0.65rem",
          alignItems: "center", justifyContent: "center", textAlign: "center",
        }}>
          <span>Already purchased RealYou?</span>
          <button type="button" onClick={() => setOpen(true)} style={primary}>
            Restore Premium Purchase
          </button>
        </div>
      )}
      {message && (
        <div role="status" style={{
          padding: "0.8rem", textAlign: "center",
          background: "#162038", color: "#f8fafc",
        }}>
          {message}
        </div>
      )}
      {open && (
        <section aria-label="Restore a paid RealYou plan" style={{
          boxSizing: "border-box", background: "#020617", color: "#f8fafc",
          border: "1px solid #6366f1", borderRadius: "18px",
          maxWidth: "560px", width: "calc(100% - 2rem)",
          margin: "1rem auto", padding: "1.2rem",
        }}>
          <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>
            Restore your paid RealYou plan
          </h2>
          <p>Enter the email you used for payment. We verify ownership before
            restoring your paid access. There is no new charge.</p>
          <form onSubmit={requestEmail}>
            <label htmlFor="premium-restore-email" style={{ display: "block", marginBottom: "0.4rem" }}>
              Email used at checkout
            </label>
            <input id="premium-restore-email" type="email" required
              style={field} value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={busy}
              style={{ ...primary, display: "block", width: "100%", marginTop: "0.7rem" }}>
              {busy ? "Please wait..." : "Send secure sign-in email"}
            </button>
          </form>
          <form onSubmit={submitCode} style={{ marginTop: "1rem" }}>
            <label htmlFor="premium-restore-code" style={{ display: "block", marginBottom: "0.4rem" }}>
              If the email contains a code, enter it here
            </label>
            <input id="premium-restore-code" value={code}
              style={field} inputMode="numeric" autoComplete="one-time-code"
              onChange={(e) => setCode(e.target.value)}
              placeholder="Verification code" />
            <button type="submit" disabled={busy || !code.trim()}
              style={{ ...primary, marginTop: "0.6rem", background: "#334155" }}>
              Verify code
            </button>
          </form>
          <button type="button" onClick={() => setOpen(false)}
            style={{ color: "#cbd5e1", textDecoration: "underline",
              border: 0, background: "transparent", marginTop: "1rem",
              cursor: "pointer" }}>
            Close
          </button>
        </section>
      )}
    </>
  );
}
