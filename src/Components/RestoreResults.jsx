import React, { useState } from "react";

export default function RestoreResults({ onRestored }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [msg, setMsg] = useState("");

  async function handleRestore(e) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");

    try {
      const res = await fetch("http://localhost:4242/api/request-restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          origin: window.location.origin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMsg(data?.error || "Restore failed.");
        return;
      }

      setStatus("success");
      setMsg("✅ If that email exists, your restore link was sent.");

      // Dev convenience: if backend returns restoreUrl, auto-open it
      if (data?.restoreUrl) {
        window.location.href = data.restoreUrl;
      }

      if (onRestored) onRestored(data);
    } catch (err) {
      setStatus("error");
      setMsg("Restore failed. Server not reachable.");
    }
  }

  return (
    <section
      style={{
        marginBottom: "2.25rem",
        padding: "1.35rem 1.35rem",
        borderRadius: "22px",
        background: "#020617",
        border: "1px solid #111827",
      }}
    >
      <h2 style={{ fontSize: "1.15rem", marginBottom: "0.4rem" }}>
        Restore My Results
      </h2>
      <p style={{ marginTop: 0, color: "#e5e7eb", fontSize: "0.92rem" }}>
        Used RealYou before? Drop the email you used and we’ll send your restore link.
      </p>

      <form
        onSubmit={handleRestore}
        style={{
          display: "flex",
          gap: "0.7rem",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "0.75rem",
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{
            flex: "1 1 240px",
            minWidth: 0,
            padding: "0.85rem 0.95rem",
            borderRadius: "14px",
            border: "1px solid rgba(148,163,184,0.45)",
            background: "rgba(2,6,23,0.85)",
            color: "#f9fafb",
            outline: "none",
          }}
        />

        <button
          type="submit"
          className="primary-btn btn-glow"
          disabled={status === "sending"}
          style={{ flex: "0 0 auto" }}
        >
          {status === "sending" ? "Sending…" : "Send Restore Link"}
        </button>
      </form>

      {msg ? (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.75rem 0.9rem",
            borderRadius: "14px",
            border:
              status === "error"
                ? "1px solid rgba(248,113,113,0.7)"
                : "1px solid rgba(34,197,94,0.55)",
            background:
              status === "error"
                ? "rgba(248,113,113,0.08)"
                : "rgba(34,197,94,0.08)",
            color: "#e5e7eb",
            fontSize: "0.9rem",
          }}
        >
          {msg}
        </div>
      ) : null}
    </section>
  );
}
