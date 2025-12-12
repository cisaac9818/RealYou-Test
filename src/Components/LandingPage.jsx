// src/Components/LandingPage.jsx
import React from "react";

export default function LandingPage({
  onStartTest, // optional: start the free test (e.g. setStage("mode"))
  onStandardClick, // optional: trigger Standard upgrade flow
  onPremiumClick, // optional: trigger Premium upgrade flow
}) {
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleStartClick() {
    if (onStartTest) onStartTest();
    else scrollToId("plans");
  }

  function handleStandardClick() {
    if (onStandardClick) onStandardClick();
    else scrollToId("plans");
  }

  function handlePremiumClick() {
    if (onPremiumClick) onPremiumClick();
    else scrollToId("plans");
  }

  return (
    <div
      className="landing-shell"
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at top, #0f172a 0, #020617 45%, #000 100%)",
        color: "#f9fafb",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif",
      }}
    >
      {/* PAGE WIDTH WRAPPER */}
      <div
        className="landing-wrapper"
        style={{
          width: "100%",
          maxWidth: "1040px",
          margin: "0 auto",
          padding:
            "clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 3vw, 1.5rem) 3.5rem",
        }}
      >
        {/* HERO */}
        <header
          id="top"
          className="landing-hero"
          style={{
            padding: "clamp(1.2rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem)",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(129,140,248,0.04))",
            border: "1px solid rgba(148,163,184,0.6)",
            marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow: "0 30px 80px rgba(15,23,42,0.8)",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: "clamp(1rem, 3vw, 1.8rem)",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top left, rgba(94,234,212,0.16), transparent 55%)",
              pointerEvents: "none",
            }}
          />

          {/* LEFT COPY COLUMN */}
          <div style={{ position: "relative", minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#a5b4fc",
                marginBottom: "0.5rem",
              }}
            >
              RealYou Personality Snapshot
            </p>

            <h1
              style={{
                fontSize: "clamp(1.7rem, 5.2vw, 2.4rem)",
                lineHeight: 1.1,
                fontWeight: 800,
                marginBottom: "0.7rem",
              }}
            >
              Discover the Real You — not the version you pretend to be.
            </h1>

            <p
              style={{
                fontSize: "clamp(0.95rem, 2.6vw, 1rem)",
                maxWidth: "580px",
                color: "#e5e7eb",
                marginBottom: "1.2rem",
              }}
            >
              Answer a few questions to reveal your true personality snapshot,
              how people actually experience you, and the hidden traits that
              drive your decisions.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                alignItems: "center",
                marginBottom: "0.9rem",
              }}
            >
              <button
                type="button"
                className="primary-btn btn-glow"
                onClick={handleStartClick}
              >
                Reveal My Snapshot
              </button>

              <button
                type="button"
                className="secondary-btn btn-glow"
                onClick={() => scrollToId("plans")}
              >
                See Plans &amp; Deep Dive
              </button>
            </div>

            <p
              style={{
                fontSize: "0.82rem",
                color: "#cbd5f5",
                marginBottom: "0.4rem",
              }}
            >
              No grades. No labels. Just insight.
            </p>

            <p style={{ fontSize: "0.84rem", color: "#cbd5f5" }}>
              Takes about 10 minutes. No account needed.
            </p>
          </div>

          {/* RIGHT NEON CARD / LOGO COLUMN */}
          <div
            className="landing-hero-card"
            style={{
              position: "relative",
              borderRadius: "999px",
              padding: "clamp(1.1rem, 3vw, 1.8rem) clamp(1rem, 3vw, 1.5rem)",
              background:
                "radial-gradient(circle at 20% 0%, rgba(244,63,94,0.6), transparent 60%), radial-gradient(circle at 80% 100%, rgba(59,130,246,0.7), #020617 80%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px solid rgba(148,163,184,0.6)",
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: "clamp(160px, 40vw, 210px)",
                height: "clamp(160px, 40vw, 210px)",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 10%, #f973d1, #4f46e5 55%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                boxShadow:
                  "0 0 40px rgba(236,72,153,0.9), 0 0 90px rgba(59,130,246,0.9)",
                overflow: "hidden",
              }}
            >
              <img
                src="/realyou-logo.png"
                alt="RealYou Snapshot Logo"
                style={{
                  width: "85%",
                  height: "85%",
                  objectFit: "cover",
                  filter: "drop-shadow(0 0 12px rgba(248,250,252,0.85))",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#e5e7eb",
                marginBottom: "0.3rem",
              }}
            >
              Built to feel like a late-night real talk session, not a dusty
              textbook quiz.
            </p>

            <p style={{ fontSize: "0.8rem", color: "#cbd5f5", margin: 0 }}>
              Start free, then upgrade only if the snapshot hits home.
            </p>
          </div>
        </header>

        {/* WHAT YOU GET */}
        <section
          id="benefits"
          className="section-fade section-1"
          style={{
            marginBottom: "2.25rem",
            padding: "1.6rem 1.8rem",
            borderRadius: "22px",
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>
            What You’ll Learn in Minutes
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <div
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,1))",
                border: "1px solid rgba(55,65,81,0.9)",
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: "0.35rem" }}>
                Your Core Type
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                The real 4-letter code that explains how you think, vibe, and
                move through the world.
              </p>
            </div>

            <div
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,1))",
                border: "1px solid rgba(55,65,81,0.9)",
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: "0.35rem" }}>
                Strengths + Blind Spots
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                Brutally honest but empowering — where you shine and where you
                quietly cause your own problems.
              </p>
            </div>

            <div
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,1))",
                border: "1px solid rgba(55,65,81,0.9)",
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: "0.35rem" }}>
                Relationship Style
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                How you love, argue, choose people, and why the same patterns
                keep showing up in your life.
              </p>
            </div>
          </div>

          <p
            style={{
              marginTop: "0.9rem",
              marginBottom: 0,
              fontSize: "0.82rem",
              color: "#9ca3af",
            }}
          >
            No sign-up. No email required. Just straight answers.
          </p>
        </section>

        {/* TRAIT BREAKDOWN PREVIEW */}
        <section
          id="traits"
          className="section-fade section-2"
          style={{
            marginBottom: "2.25rem",
            padding: "1.6rem 1.8rem",
            borderRadius: "22px",
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.6rem" }}>
            See Yourself More Clearly
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              maxWidth: "620px",
              color: "#e5e7eb",
              marginBottom: "1rem",
            }}
          >
            Your RealYou result breaks down how your answers land across the four
            major personality axes — with clean visuals that make everything
            obvious at a glance.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.9rem",
              fontSize: "0.9rem",
            }}
          >
            {[
              "Introversion ↔ Extraversion",
              "Intuition ↔ Sensing",
              "Thinking ↔ Feeling",
              "Judging ↔ Perceiving",
            ].map((label) => (
              <div
                key={label}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(17,24,39,1))",
                  border: "1px solid rgba(55,65,81,0.9)",
                }}
              >
                <p style={{ margin: 0, color: "#d1d5db", fontWeight: 500 }}>
                  {label}
                </p>
                <div
                  style={{
                    marginTop: "0.45rem",
                    height: "6px",
                    borderRadius: "999px",
                    overflow: "hidden",
                    background: "#020617",
                    display: "flex",
                  }}
                >
                  <div style={{ flex: 1, background: "#38bdf8" }} />
                  <div style={{ flex: 1, background: "#8b5cf6" }} />
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: "0.9rem",
              marginBottom: 0,
              fontSize: "0.84rem",
              color: "#9ca3af",
            }}
          >
            These scores explain why you click with some people instantly… and
            crash with others.
          </p>
        </section>

        {/* RELATIONSHIP SNAPSHOT */}
        <section
          id="relationships"
          className="section-fade section-3"
          style={{
            marginBottom: "2.25rem",
            padding: "1.6rem 1.8rem",
            borderRadius: "22px",
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.6rem" }}>
            Who You’re Most Compatible With — and Why
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              maxWidth: "640px",
              color: "#e5e7eb",
              marginBottom: "0.9rem",
            }}
          >
            RealYou gives you a relationship snapshot that shows your natural
            chemistry, challenges, and the types you tend to do best with —
            without sugar-coating it.
          </p>

          <ul
            style={{
              paddingLeft: "1.1rem",
              margin: 0,
              fontSize: "0.92rem",
              color: "#e5e7eb",
              lineHeight: 1.6,
            }}
          >
            <li>Best match types that feel natural and low-drama.</li>
            <li>High-friction types so you know where to tread carefully.</li>
            <li>Why certain people feel “easy” and others drain you fast.</li>
            <li>Communication patterns that either fix problems or fuel them.</li>
          </ul>

          <div
            style={{
              marginTop: "1.1rem",
              padding: "1rem 1rem",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(15,23,42,0.98))",
              border: "1px dashed rgba(129,140,248,0.8)",
              fontSize: "0.9rem",
            }}
          >
            <strong>Premium Only:</strong> Enter another person’s type and see a{" "}
            <strong>live % match</strong> with a breakdown of where your combo
            wins and where it gets messy.
          </div>
        </section>

        {/* PLAN BREAKDOWN */}
        <section
          id="plans"
          className="section-fade section-4"
          style={{ marginBottom: "2.5rem" }}
        >
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.4rem" }}>
            Choose How Deep You Want to Go
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#e5e7eb",
              marginBottom: "1.1rem",
              maxWidth: "620px",
            }}
          >
            Start free. Upgrade only if you want the deeper breakdowns,
            relationship tools, and PDF report.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.1rem",
            }}
          >
            {/* FREE */}
            <div
              style={{
                padding: "1.1rem 1.1rem 1.2rem",
                borderRadius: "20px",
                background: "#020617",
                border: "1px solid #1f2937",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "0.9rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#9ca3af",
                    marginBottom: "0.3rem",
                  }}
                >
                  Free
                </p>
                <h3 style={{ fontSize: "1.05rem", margin: 0, marginBottom: "0.25rem" }}>
                  RealYou Starter
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#e5e7eb", marginBottom: "0.6rem" }}>
                  Get your type and a full snapshot of your core wiring — free.
                </p>
                <ul
                  style={{
                    paddingLeft: "1.1rem",
                    margin: 0,
                    fontSize: "0.86rem",
                    color: "#e5e7eb",
                    lineHeight: 1.6,
                  }}
                >
                  <li>Core MBTI type</li>
                  <li>Trait breakdown across 4 axes</li>
                  <li>Snapshot strengths &amp; blind spots</li>
                  <li>Relationship style preview</li>
                </ul>
              </div>
              <button
                type="button"
                className="secondary-btn btn-glow"
                onClick={handleStartClick}
              >
                Try Free
              </button>
            </div>

            {/* STANDARD */}
            <div
              style={{
                padding: "1.1rem 1.1rem 1.2rem",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,1))",
                border: "1px solid rgba(59,130,246,0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "0.9rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#bfdbfe",
                    marginBottom: "0.3rem",
                  }}
                >
                  Standard
                </p>
                <h3 style={{ fontSize: "1.05rem", margin: 0, marginBottom: "0.25rem" }}>
                  RealYou Insight
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#e5e7eb", marginBottom: "0.6rem" }}>
                  Deeper explanations, full lists, and clear next steps.
                </p>
                <ul
                  style={{
                    paddingLeft: "1.1rem",
                    margin: 0,
                    fontSize: "0.86rem",
                    color: "#e5e7eb",
                    lineHeight: 1.6,
                  }}
                >
                  <li>Full strengths &amp; blind spots</li>
                  <li>Full communication tips</li>
                  <li>Full relationship style breakdown</li>
                  <li>Compatibility snapshot (best &amp; challenging types)</li>
                  <li>Growth path &amp; focus areas</li>
                </ul>
              </div>
              <button
                type="button"
                className="primary-btn btn-glow"
                onClick={handleStandardClick}
              >
                Unlock Standard – $6.99
              </button>
            </div>

            {/* PREMIUM */}
            <div
              style={{
                padding: "1.1rem 1.1rem 1.2rem",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(94,234,212,0.13), rgba(15,23,42,1))",
                border: "1px solid rgba(45,212,191,0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "0.9rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#a7f3d0",
                    marginBottom: "0.3rem",
                  }}
                >
                  Premium
                </p>
                <h3 style={{ fontSize: "1.05rem", margin: 0, marginBottom: "0.25rem" }}>
                  RealYou DeepDive
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#e5e7eb", marginBottom: "0.6rem" }}>
                  The no-BS full breakdown with live tools and a PDF you can keep.
                </p>
                <ul
                  style={{
                    paddingLeft: "1.1rem",
                    margin: 0,
                    fontSize: "0.86rem",
                    color: "#e5e7eb",
                    lineHeight: 1.6,
                  }}
                >
                  <li>Everything in Standard</li>
                  <li>Live type comparison with % match</li>
                  <li>Deep Dive Story Mode</li>
                  <li>Coach Mode &amp; flexibility map</li>
                  <li>Downloadable PDF report</li>
                </ul>
              </div>
              <button
                type="button"
                className="primary-btn btn-glow"
                onClick={handlePremiumClick}
              >
                Unlock Premium – $14.99
              </button>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section
          id="social-proof"
          className="section-fade section-5"
          style={{
            marginBottom: "2.25rem",
            padding: "1.6rem 1.8rem",
            borderRadius: "22px",
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.7rem" }}>
            Early Users Are Already Locked In
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,1))",
                border: "1px solid rgba(55,65,81,0.9)",
              }}
            >
              <p style={{ margin: 0 }}>
                “This snapshot lowkey read me for FILTH. I sent it to my whole
                group chat.”
              </p>
              <p style={{ margin: 0, marginTop: "0.4rem", fontSize: "0.8rem", color: "#9ca3af" }}>
                — T. Johnson
              </p>
            </div>

            <div
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,1))",
                border: "1px solid rgba(55,65,81,0.9)",
              }}
            >
              <p style={{ margin: 0 }}>
                “Me and my girl compared our types… it explained everything we
                kept arguing about.”
              </p>
              <p style={{ margin: 0, marginTop: "0.4rem", fontSize: "0.8rem", color: "#9ca3af" }}>
                — Cam D.
              </p>
            </div>

            <div
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,1))",
                border: "1px solid rgba(55,65,81,0.9)",
              }}
            >
              <p style={{ margin: 0 }}>
                “Finally a personality snapshot that doesn’t feel like a 2009
                BuzzFeed quiz.”
              </p>
              <p style={{ margin: 0, marginTop: "0.4rem", fontSize: "0.8rem", color: "#9ca3af" }}>
                — Mia S.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          style={{
            marginBottom: "2.2rem",
            padding: "1.6rem 1.8rem",
            borderRadius: "22px",
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.8rem" }}>
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
              fontSize: "0.9rem",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                Is this really free?
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                Yes. You get your full core type and trait breakdown free. You
                only pay if you want Standard or Premium.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                Do I need an account?
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                No. No login and no sign-up. You go straight to results.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                What’s the difference between Standard and Premium?
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                Standard unlocks the full core report. Premium adds the Deep
                Dive story, Coach Mode, the compatibility tool, and the PDF
                report.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                Can I do it again?
              </p>
              <p style={{ margin: 0, color: "#e5e7eb" }}>
                Yes. You can retake it as many times as you want to track your
                growth or check how life changes your patterns.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid #111827",
            paddingTop: "1.1rem",
            fontSize: "0.8rem",
            color: "#9ca3af",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "0.6rem",
          }}
        >
          <span>RealYou by NMotion Media Group</span>
          <span>© {new Date().getFullYear()} All Rights Reserved</span>
          <span>Privacy Policy • Terms • Contact Support</span>
        </footer>
      </div>
    </div>
  );
}
