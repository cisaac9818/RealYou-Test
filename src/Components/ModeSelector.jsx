// src/Components/ModeSelector.jsx
import React from "react";

export default function ModeSelector({
  plan,
  hasChosenPlan,
  onPlanChosen,
  onSelect,
  onUpgradeClick,
}) {
  const isStandard = plan === "standard";
  const isPremium = plan === "premium";
  const isFree = !isStandard && !isPremium;

  // Classic/Modern only appears AFTER a plan is considered chosen
  const showStyleCard = hasChosenPlan;

  const currentPlanLabel = isPremium
    ? "Premium"
    : isStandard
    ? "Standard"
    : "Free (RealYou Starter)";

  const handleChooseFree = () => {
    if (onPlanChosen) {
      onPlanChosen("free");
    }
  };

  const handleUpgradeStandard = () => {
    if (onUpgradeClick) {
      onUpgradeClick("standard");
    }
  };

  const handleUpgradePremium = () => {
    if (onUpgradeClick) {
      onUpgradeClick("premium");
    }
  };

  // ✅ Hard wrap safety so NO text can spill outside cards
  const wrapText = {
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "normal",
    minWidth: 0,
  };

  // ✅ ONE-TIME / NO SUBS line styles
  const oneTimeLineStyle = {
    ...wrapText,
    fontSize: "0.82rem",
    color: "#cbd5f5",
    opacity: 0.95,
    marginTop: "0.15rem",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };

  return (
    <div
      className="mode-selector-page"
      style={{
        padding: "2.5rem 1.5rem",
        background: "#020617",
        minHeight: "100vh",
      }}
    >
      {/* REALYOU PRODUCT HEADER */}
      <section
        className="mode-hero"
        style={{ maxWidth: "960px", margin: "0 auto 1.5rem" }}
      >
        <p
          className="page-eyebrow"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#a5b4fc",
            marginBottom: "0.3rem",
          }}
        >
          RealYou Snapshot™
        </p>
        <h1 className="page-title" style={{ fontSize: "1.9rem" }}>
          Get your RealYou personality snapshot
        </h1>
        <p
          className="page-subtitle"
          style={{ maxWidth: "640px", color: "#e5e7eb", marginTop: "0.35rem" }}
        >
          Start free, then unlock deeper RealYou insights, coaching language,
          and a downloadable report. Choose how deep you want to go.
        </p>

        <ul
          className="mode-header__highlights"
          style={{
            marginTop: "0.6rem",
            paddingLeft: "1.1rem",
            fontSize: "0.9rem",
            color: "#cbd5f5",
          }}
        >
          <li>🔍 Free: core type + basic trait breakdown</li>
          <li>⭐ Standard: extra insights and “coach whisper” tips</li>
          <li>💎 Premium: full story, coach mode & RealYou PDF report</li>
        </ul>

        <p
          className="page-current-plan"
          style={{
            marginTop: "0.6rem",
            fontSize: "0.88rem",
            color: "#9ca3af",
          }}
        >
          Current plan: <strong>{currentPlanLabel}</strong>
        </p>
      </section>

      {/* ✅ PLAN CARDS INLINE — RESPONSIVE (NO MORE 3 SKINNY BOXES) */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "grid",
          // ✅ Auto-wrap: 1 col on phones, 2 on tablets, 3 on desktop (if space)
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          alignItems: "stretch",
        }}
      >
        {/* FREE PLAN */}
        <div
          style={{
            borderRadius: "20px",
            padding: "1.6rem 1.2rem",
            background: "#020617",
            border: "1px solid #1f2937",
            boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                ...wrapText,
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.35rem",
              }}
            >
              Free
            </h2>
            <p
              style={{
                ...wrapText,
                fontSize: "1.4rem",
                fontWeight: 800,
                marginBottom: "0.3rem",
              }}
            >
              $0
            </p>

            {/* ✅ Added: clear "no subs" line even on Free */}
            <div style={{ ...oneTimeLineStyle, textTransform: "none" }}>
              No subscriptions • Start instantly
            </div>

            <ul
              style={{
                ...wrapText,
                fontSize: "0.9rem",
                color: "#e5e7eb",
                paddingLeft: "1.1rem",
                marginTop: "0.65rem",
                marginBottom: 0,
              }}
            >
              <li style={wrapText}>Core type & basic trait breakdown</li>
              <li style={wrapText}>Good for a quick snapshot</li>
              <li style={wrapText}>Upgrade any time</li>
            </ul>
          </div>
          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: "1rem" }}
            onClick={handleChooseFree}
            disabled={isFree}
          >
            {isFree ? "Current Plan" : "Choose Free"}
          </button>
        </div>

        {/* STANDARD PLAN */}
        <div
          style={{
            borderRadius: "20px",
            padding: "1.6rem 1.2rem",
            background:
              "linear-gradient(145deg, #020617 0%, #020617 40%, #111827 100%)",
            border: "1px solid #4b5563",
            boxShadow: "0 24px 50px rgba(15,23,42,0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                position: "absolute",
                top: "0.9rem",
                right: "1rem",
                fontSize: "0.7rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "999px",
                background: "#22c55e1a",
                color: "#22c55e",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                ...wrapText,
              }}
            >
              Most Popular
            </div>
            <h2
              style={{
                ...wrapText,
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.35rem",
              }}
            >
              Standard
            </h2>
            <p
              style={{
                ...wrapText,
                fontSize: "1.4rem",
                fontWeight: 800,
                marginBottom: "0.3rem",
              }}
            >
              $6.99
            </p>

            {/* ✅ Added: ONE-TIME / NO SUBS */}
            <div style={oneTimeLineStyle}>ONE-TIME PURCHASE • NO SUBSCRIPTIONS</div>

            <ul
              style={{
                ...wrapText,
                fontSize: "0.9rem",
                color: "#e5e7eb",
                paddingLeft: "1.1rem",
                marginTop: "0.65rem",
                marginBottom: 0,
              }}
            >
              <li style={wrapText}>Full RealYou core report</li>
              <li style={wrapText}>Deeper explanations of your type</li>
              <li style={wrapText}>Relationship & work insights</li>
            </ul>
          </div>
          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: "1rem" }}
            onClick={handleUpgradeStandard}
            disabled={isStandard}
          >
            {isStandard ? "Current Plan" : "Unlock Standard"}
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div
          style={{
            borderRadius: "20px",
            padding: "1.6rem 1.2rem",
            background:
              "linear-gradient(150deg, #020617 0%, #020617 30%, #1f2937 100%)",
            border: "1px solid #6366f1",
            boxShadow: "0 24px 55px rgba(37,99,235,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                ...wrapText,
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.35rem",
              }}
            >
              Premium
            </h2>
            <p
              style={{
                ...wrapText,
                fontSize: "1.4rem",
                fontWeight: 800,
                marginBottom: "0.3rem",
              }}
            >
              $14.99
            </p>

            {/* ✅ Added: ONE-TIME / NO SUBS */}
            <div style={oneTimeLineStyle}>ONE-TIME PURCHASE • NO SUBSCRIPTIONS</div>

            <ul
              style={{
                ...wrapText,
                fontSize: "0.9rem",
                color: "#e5e7eb",
                paddingLeft: "1.1rem",
                marginTop: "0.65rem",
                marginBottom: 0,
              }}
            >
              <li style={wrapText}>Everything in Standard</li>
              <li style={wrapText}>Deep Dive Story & Coach Mode</li>
              <li style={wrapText}>Downloadable RealYou PDF report</li>
            </ul>
          </div>
          <button
            type="button"
            className="secondary-btn"
            style={{ marginTop: "1rem" }}
            onClick={handleUpgradePremium}
            disabled={isPremium}
          >
            {isPremium ? "Current Plan" : "Unlock Premium"}
          </button>
        </div>
      </div>

      {/* SNAPSHOT STYLE CARD – ONLY AFTER PLAN IS CHOSEN */}
      {showStyleCard && (
        <div style={{ maxWidth: "960px", margin: "2.5rem auto 0" }}>
          <section
            className="mode-style-card"
            style={{
              borderRadius: "26px",
              padding: "2rem 1.75rem 1.8rem",
              background:
                "linear-gradient(145deg, #020617 0%, #020617 45%, #050816 100%)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
              color: "#f9fafb",
            }}
          >
            <header
              style={{
                marginBottom: "1.3rem",
                textAlign: "left",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  marginBottom: "0.35rem",
                }}
              >
                Choose Your Snapshot Style
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#e5e7eb",
                  marginBottom: "0.4rem",
                }}
              >
                Same RealYou personality engine — just different wording vibes.
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#9ca3af",
                  margin: 0,
                }}
              >
                Current plan: <strong>{currentPlanLabel}</strong>
              </p>
            </header>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {/* CLASSIC MODE */}
              <div
                style={{
                  borderRadius: "18px",
                  padding: "1.4rem 1.2rem 1.2rem",
                  background: "#020617",
                  border: "1px solid #1f2937",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "170px",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      ...wrapText,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: "0.35rem",
                    }}
                  >
                    Classic Mode
                  </h3>
                  <p
                    style={{
                      ...wrapText,
                      fontSize: "0.92rem",
                      color: "#e5e7eb",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Clean, timeless wording. Great for work, coaching, job
                    insight, and serious personal development.
                  </p>
                </div>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => onSelect("pro")}
                >
                  Use Classic Mode
                </button>
              </div>

              {/* MODERN MODE */}
              <div
                style={{
                  borderRadius: "18px",
                  padding: "1.4rem 1.2rem 1.2rem",
                  background: "#020617",
                  border: "1px solid #1f2937",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "170px",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      ...wrapText,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: "0.35rem",
                    }}
                  >
                    Modern Mode
                  </h3>
                  <p
                    style={{
                      ...wrapText,
                      fontSize: "0.92rem",
                      color: "#e5e7eb",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Relaxed, conversational wording. Great for everyday life,
                    friendships, dating, and social media sharing.
                  </p>
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => onSelect("genz")}
                >
                  Use Modern Mode
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
