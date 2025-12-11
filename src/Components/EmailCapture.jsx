// src/Components/EmailCapture.jsx
import React, { useState } from "react";

export default function EmailCapture({ onSubmit, initialName = "", initialEmail = "" }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailValid = /^\S+@\S+\.\S+$/.test(trimmedEmail);

    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      agreeToEmails: agree,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e293b 0, #020617 45%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        color: "#e5e7eb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.98))",
          borderRadius: "1.5rem",
          border: "1px solid rgba(148,163,184,0.35)",
          padding: "1.75rem 1.9rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.7rem",
            borderRadius: "999px",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            background:
              "linear-gradient(120deg, rgba(56,189,248,0.12), rgba(129,140,248,0.12))",
            border: "1px solid rgba(56,189,248,0.35)",
            marginBottom: "0.85rem",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #22c55e, #16a34a)",
              boxShadow: "0 0 0 4px rgba(34,197,94,0.22)",
            }}
          />
          <span>Almost there</span>
        </div>

        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#f9fafb",
            marginBottom: "0.45rem",
          }}
        >
          Unlock your full{" "}
          <span
            style={{
              background:
                "linear-gradient(120deg, #38bdf8, #a855f7, #f97316)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            RealYou profile
          </span>
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#cbd5f5",
            marginBottom: "1.15rem",
          }}
        >
          Enter your details to reveal your results and get your saved copy.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{ fontSize: "0.8rem", marginBottom: "0.25rem", display: "block" }}
          >
            First Name (optional)
          </label>
          <input
            type="text"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.9rem",
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(148,163,184,0.45)",
              color: "#e5e7eb",
              marginBottom: "0.85rem",
            }}
          />

          <label
            style={{
              fontSize: "0.8rem",
              marginBottom: "0.25rem",
              display: "block",
            }}
          >
            Email Address <span style={{ color: "#f97373" }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.9rem",
              background: "rgba(15,23,42,0.85)",
              border: error
                ? "1px solid rgba(248,113,113,0.8)"
                : "1px solid rgba(148,163,184,0.45)",
              color: "#e5e7eb",
              marginBottom: "0.85rem",
            }}
          />

          {error && (
            <div
              style={{
                background: "rgba(127,29,29,0.4)",
                color: "#fecaca",
                padding: "0.45rem 0.6rem",
                borderRadius: "0.75rem",
                marginBottom: "0.8rem",
                border: "1px solid rgba(248,113,113,0.8)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              background:
                "linear-gradient(120deg, #38bdf8, #a855f7, #f97316)",
              border: "none",
              borderRadius: "999px",
              padding: "0.7rem",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "0.4rem",
            }}
          >
            Show My Results
          </button>
        </form>
      </div>
    </div>
  );
}
