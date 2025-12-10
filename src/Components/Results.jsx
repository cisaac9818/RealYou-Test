// src/Components/Results.jsx
import React, { useState } from "react";

function getVisibleItems(arr, plan, freeCount = 2) {
  if (!Array.isArray(arr) || !arr.length) return [];
  if (plan === "free") return arr.slice(0, freeCount);
  return arr;
}

// Map axis code to labels
function getAxisMeta(code) {
  switch (code) {
    case "EI":
      return {
        firstLetter: "E",
        secondLetter: "I",
        firstLabel: "Extraversion (E)",
        secondLabel: "Introversion (I)",
        axisLabel: "how you recharge and use your social energy",
      };
    case "SN":
      return {
        firstLetter: "N",
        secondLetter: "S",
        firstLabel: "Intuition (N)",
        secondLabel: "Sensing (S)",
        axisLabel:
          "how you take in information: big-picture patterns vs concrete details",
      };
    case "TF":
      return {
        firstLetter: "T",
        secondLetter: "F",
        firstLabel: "Thinking (T)",
        secondLabel: "Feeling (F)",
        axisLabel: "how you tend to make decisions",
      };
    case "JP":
      return {
        firstLetter: "J",
        secondLetter: "P",
        firstLabel: "Judging (J)",
        secondLabel: "Perceiving (P)",
        axisLabel: "how you like to structure your outer world",
      };
    default:
      return {
        firstLetter: "A",
        secondLetter: "B",
        firstLabel: "Side A",
        secondLabel: "Side B",
        axisLabel: "this dimension",
      };
  }
}

// Convert raw score to a 20–80% split
function axisPercentages(raw) {
  const clamped = Math.max(-10, Math.min(10, raw || 0));
  const firstPercent = Math.round(50 + (clamped / 10) * 30); // -10..10 -> 20..80
  const secondPercent = 100 - firstPercent;
  return { firstPercent, secondPercent };
}

// Distinct colors for each axis and side
const AXIS_COLORS = {
  EI: {
    first: "#22c55e", // E
    second: "#6366f1", // I
  },
  SN: {
    first: "#f97316", // N
    second: "#0ea5e9", // S
  },
  TF: {
    first: "#e11d48", // T
    second: "#22c55e", // F
  },
  JP: {
    first: "#a855f7", // J
    second: "#facc15", // P
  },
};

// 🔹 MISSING BEFORE – now added back
function buildAxisSummary(code, value) {
  const meta = getAxisMeta(code);
  const { firstLabel, secondLabel, axisLabel } = meta;
  const { firstPercent, secondPercent } = axisPercentages(value);
  const abs = Math.abs(value || 0);

  let intensity;
  if (abs === 0) {
    intensity = "a balanced position";
  } else if (abs <= 2) {
    intensity = "a slight preference";
  } else if (abs <= 5) {
    intensity = "a moderate preference";
  } else {
    intensity = "a strong preference";
  }

  // Neutral / balanced
  if (value === 0) {
    return `${code}: about ${firstPercent}% / ${secondPercent}% — ${intensity} on this axis. You can move fairly easily between both sides of ${axisLabel}.`;
  }

  // Correct side + correct percentage
  const toward = value > 0 ? firstLabel : secondLabel;
  const leaningPercent = value > 0 ? firstPercent : secondPercent;

  return `${code}: about ${leaningPercent}% toward ${toward} (${firstPercent}% / ${secondPercent}%). That shows ${intensity} in ${axisLabel}.`;
}

// Examples of life events that can shift each axis
const FLEX_EXAMPLES = {
  EI: {
    major:
      "Moving to a new city, taking on a public-facing leadership role, long seasons of isolation or burnout, major loss that changes how much social energy you have to give.",
    minor:
      "New friend group, switching from remote to in-person work (or vice versa), joining a club or team, changing how often you go out vs stay home.",
  },
  SN: {
    major:
      "Long-term work in a detail-heavy or highly creative field, advanced education, big career pivot (hands-on trade to strategy role or the reverse).",
    minor:
      "New routines that demand either more structure and facts (budgets, checklists) or more brainstorming and vision (planning projects, content, creative work).",
  },
  TF: {
    major:
      "Becoming a parent or caregiver, going through therapy, major conflict or breakup, serious work conflict that forces you to rethink how you make decisions.",
    minor:
      "Getting feedback about being ‘too blunt’ or ‘too soft’, taking on a mentoring or coaching role, dealing with team decisions where people and logic both matter.",
  },
  JP: {
    major:
      "Military experience, running your own business, taking a high-responsibility role, long-term chaos that forces you to either tighten structure or loosen control.",
    minor:
      "New job with strict deadlines, switching to gig/freelance work, living with someone more structured or more spontaneous than you, managing multiple projects at once.",
  },
};

// Build a description line for flexibility ranking in Premium
function buildFlexibilityLine(axis, rankIndex) {
  const { code, firstLabel, secondLabel, axisLabel, value } = axis;
  const abs = Math.abs(value || 0);

  let flexibility;
  if (abs === 0) flexibility = "highly flexible for you right now";
  else if (abs <= 2) flexibility = "quite flexible and can shift over time";
  else if (abs <= 5) flexibility = "moderately stable but still adaptable";
  else flexibility = "pretty stable unless life hits you hard";

  const examples = FLEX_EXAMPLES[code] || FLEX_EXAMPLES["EI"];
  const rankLabel =
    rankIndex === 0
      ? "Most flexible"
      : rankIndex === 3
      ? "Most stable"
      : `Level ${rankIndex + 1}`;

  return {
    heading: `${rankLabel}: ${code} – ${firstLabel} vs ${secondLabel}`,
    flexibility,
    axisLabel,
    major: examples.major,
    minor: examples.minor,
  };
}

export default function Results({
  plan,
  results,
  onRestart,
  onUpgradeClick,
  hasCompletedAssessment, // reserved for future logic
  onDownloadPdf, // Premium PDF handler
  justUpgradedTier, // "standard" | "premium" when arriving back from Stripe
}) {
  const safeResults = results || {};
  const { mbtiType, traitScores = {}, profile = {} } = safeResults;

  const isFree = plan === "free";
  const isStandard = plan === "standard";
  const isPremium = plan === "premium";

  const [premiumView, setPremiumView] = useState("story"); // "story" | "coach"
  const [showUpgradeToast, setShowUpgradeToast] = useState(!!justUpgradedTier);

  const visibleStrengths = getVisibleItems(profile.strengths || [], plan, 2);
  const visibleBlindspots = getVisibleItems(profile.blindspots || [], plan, 2);
  const visibleCommTips = getVisibleItems(
    profile.communicationTips || [],
    plan,
    2
  );
  const visibleGrowth = getVisibleItems(profile.growthFocus || [], plan, 2);

  const joinedCareers =
    Array.isArray(profile.idealCareers) && profile.idealCareers.length
      ? profile.idealCareers.join(", ")
      : "Varied paths that fit your style.";

  const bestTypes =
    profile.compatibility?.bestTypes?.length
      ? profile.compatibility.bestTypes.join(", ")
      : "Varied types";

  const challengingTypes =
    profile.compatibility?.challengingTypes?.length
      ? profile.compatibility.challengingTypes.join(", ")
      : "Depends on dynamics";

  // Precompute axis meta + percentages
  const axes = ["EI", "SN", "TF", "JP"].map((code) => {
    const value = traitScores[code] || 0;
    const meta = getAxisMeta(code);
    const { firstPercent, secondPercent } = axisPercentages(value);
    return {
      code,
      value,
      ...meta,
      firstPercent,
      secondPercent,
    };
  });

  // Personalized flexibility ranking: sort by |value| ascending
  const flexibilityRanking = [...axes].sort(
    (a, b) => Math.abs(a.value || 0) - Math.abs(b.value || 0)
  );

  // STANDARD-ONLY: dynamic pieces for the extra summary
  const dominantTrait =
    (Array.isArray(profile.coreTraits) && profile.coreTraits[0]) ||
    "your strongest traits";
  const secondaryTrait =
    (Array.isArray(profile.coreTraits) && profile.coreTraits[1]) ||
    "your backup traits";
  const topBlindspot =
    (Array.isArray(profile.blindspots) && profile.blindspots[0]) ||
    "your most common stress habits";

  const upgradeTitle =
    justUpgradedTier === "premium"
      ? "Premium unlocked"
      : "Standard unlocked";

  const upgradeBody =
    justUpgradedTier === "premium"
      ? "You’ve unlocked the full Deep Dive: Story Mode, Coach Mode, trait flexibility insights, and the downloadable PDF."
      : "You’ve unlocked the full core report: all strengths, blindspots, relationship style, communication tips, and growth focus.";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "2.5rem 1.5rem",
        background: "#020617",
        boxSizing: "border-box",
      }}
    >
      {/* Centered main container */}
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          borderRadius: "26px",
          padding: "2.5rem 2.25rem 2rem",
          background:
            "linear-gradient(145deg, #020617 0%, #020617 45%, #050816 100%)",
          boxShadow: "0 26px 70px rgba(0,0,0,0.85)",
          color: "#f9fafb",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <header
          className="results-header"
          style={{ marginBottom: "1.25rem", textAlign: "left" }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
              color: "#a5b4fc",
            }}
          >
            RealYou Snapshot
          </p>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 800,
              marginBottom: "0.4rem",
            }}
          >
            Your RealYou Personality Snapshot
          </h1>
          <p
            className="results-type"
            style={{ marginBottom: "0.4rem", fontSize: "0.98rem" }}
          >
            Type: <strong>{mbtiType}</strong> — {profile.label}
          </p>
          <p
            className="results-summary"
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#e5e7eb",
              maxWidth: "720px",
            }}
          >
            {profile.summary}
          </p>
        </header>

        {/* JUST-UPGRADED TOAST */}
        {showUpgradeToast && justUpgradedTier && (
          <section
            style={{
              marginBottom: "1.1rem",
              padding: "0.85rem 1rem",
              borderRadius: "999px",
              background:
                justUpgradedTier === "premium"
                  ? "linear-gradient(90deg, rgba(56,189,248,0.18), rgba(129,140,248,0.3))"
                  : "linear-gradient(90deg, rgba(59,130,246,0.22), rgba(96,165,250,0.3))",
              border: "1px solid rgba(129,140,248,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              fontSize: "0.87rem",
            }}
          >
            <div>
              <strong style={{ display: "block", marginBottom: "0.1rem" }}>
                {upgradeTitle}
              </strong>
              <span>{upgradeBody}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowUpgradeToast(false)}
              style={{
                border: "none",
                background: "transparent",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </section>
        )}

        {/* STANDARD-ONLY: UNLOCK BANNER + EXTRA SUMMARY */}
        {isStandard && (
          <section
            style={{
              marginBottom: "1.5rem",
              padding: "1rem 1.1rem",
              borderRadius: "18px",
              background: "rgba(30,64,175,0.38)",
              border: "1px solid rgba(129,140,248,0.9)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "0.35rem",
                color: "#e0e7ff",
                fontWeight: 700,
              }}
            >
              Standard Plan
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.6rem",
                color: "#e5e7eb",
              }}
            >
              You&apos;ve unlocked the full insight suite — deeper explanations
              and actionable takeaways to help you understand your natural
              patterns.
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                margin: 0,
                color: "#c7d2fe",
              }}
            >
              <strong>Standard Summary:</strong>{" "}
              {`Your responses show a clear pattern: you lead with ${dominantTrait}, rely on ${secondaryTrait}, and struggle most when ${topBlindspot}. This version of your report helps you understand why these patterns show up — and what to do with them.`}
            </p>
          </section>
        )}

        {/* TOP UPGRADE BANNER */}
        {(isFree || isStandard) && (
          <section
            className="results-section upgrade-banner"
            style={{
              marginBottom: "1.75rem",
              padding: "1.2rem 1.3rem",
              borderRadius: "18px",
              background: "rgba(37, 99, 235, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.45)",
            }}
          >
            {isFree && (
              <>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "0.35rem",
                    fontWeight: 700,
                  }}
                >
                  Unlock Your Full RealYou Report
                </h2>
                <p
                  style={{
                    fontSize: "0.92rem",
                    marginBottom: "0.75rem",
                    color: "#dbeafe",
                  }}
                >
                  You&apos;re on the <strong>Free</strong> version of the{" "}
                  <strong>RealYou Test</strong>. Unlock{" "}
                  <strong>Standard ($6.99)</strong> for the full core report, or
                  go all in with <strong>Premium ($14.99)</strong> for the
                  complete Deep Dive story, coach playbook, and PDF.
                </p>
                <div
                  className="upgrade-actions"
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => onUpgradeClick && onUpgradeClick("standard")}
                  >
                    Unlock Standard Insights – $6.99
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => onUpgradeClick && onUpgradeClick("premium")}
                  >
                    Unlock Full Deep Dive – $14.99
                  </button>
                </div>
              </>
            )}

            {isStandard && (
              <>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "0.35rem",
                    fontWeight: 700,
                  }}
                >
                  Standard Plan Active
                </h2>
                <p
                  style={{
                    fontSize: "0.92rem",
                    marginBottom: "0.75rem",
                    color: "#dbeafe",
                  }}
                >
                  You&apos;ve unlocked the full core{" "}
                  <strong>RealYou report</strong>. Upgrade to{" "}
                  <strong>Premium</strong> to add the{" "}
                  <strong>Deep Dive Story + Coach Mode</strong> and trait
                  flexibility insights, plus your full downloadable PDF.
                </p>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => onUpgradeClick && onUpgradeClick("premium")}
                >
                  Unlock Premium Deep Dive – $14.99
                </button>
              </>
            )}
          </section>
        )}

        {/* TRAIT SCORES + RAW + % + EXPLANATION */}
        <section
          className="results-section"
          style={{
            marginBottom: "1.5rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
            Trait Breakdown
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              marginBottom: "0.75rem",
              color: "#e5e7eb",
            }}
          >
            This shows how your answers landed across the four major personality
            axes. The percentages show the{" "}
            <strong>current tilt of your preferences</strong> — not a life
            sentence, but a snapshot of how you&apos;re wired right now.
          </p>

          <p
            style={{
              fontSize: "0.86rem",
              margin: 0,
              marginBottom: "0.4rem",
              color: "#e5e7eb",
            }}
          >
            Raw scores: EI: {traitScores.EI} | SN: {traitScores.SN} | TF:{" "}
            {traitScores.TF} | JP: {traitScores.JP}
          </p>

          <p
            style={{
              fontSize: "0.8rem",
              marginTop: "0.2rem",
              marginBottom: "0.8rem",
              color: "#9ca3af",
            }}
          >
            These raw numbers are an internal <strong>leaning scale</strong>,
            not “points out of 10”. 0 means neutral. Positive numbers lean
            toward the <strong>first letter</strong> (E, N, T, J); negative
            numbers lean toward the <strong>second letter</strong> (I, S, F, P).
          </p>

          <div
            className="axis-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.9rem",
            }}
          >
            {axes.map((axis) => {
              const colors = AXIS_COLORS[axis.code] || {
                first: "#38bdf8",
                second: "#6366f1",
              };
              return (
                <div
                  key={axis.code}
                  style={{
                    padding: "0.85rem 0.9rem",
                    borderRadius: "14px",
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.96))",
                    border: "1px solid rgba(148,163,184,0.4)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.3rem",
                      color: "#9ca3af",
                    }}
                  >
                    {axis.code}
                  </p>
                  <p
                    style={{
                      fontSize: "0.94rem",
                      marginBottom: "0.45rem",
                      fontWeight: 600,
                    }}
                  >
                    {axis.firstLabel} vs {axis.secondLabel}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      color: "#e5e7eb",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span>
                      {axis.firstLetter} — {axis.firstPercent}%
                    </span>
                    <span>
                      {axis.secondLetter} — {axis.secondPercent}%
                    </span>
                  </div>

                  {/* Dual-color bar */}
                  <div
                    style={{
                      display: "flex",
                      height: "6px",
                      borderRadius: "999px",
                      overflow: "hidden",
                      background: "#020617",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: `${axis.firstPercent}%`,
                        background: colors.first,
                      }}
                    />
                    <div
                      style={{
                        width: `${axis.secondPercent}%`,
                        background: colors.second,
                      }}
                    />
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                    }}
                  >
                    {buildAxisSummary(axis.code, axis.value)}
                  </p>
                </div>
              );
            })}
          </div>

          {!isFree && (
            <p
              style={{
                marginTop: "0.7rem",
                marginBottom: 0,
                fontSize: "0.8rem",
                color: "#c7d2fe",
              }}
            >
              <strong>Standard / Premium Insight:</strong> These numbers tell
              you where you make your best decisions — and where you&apos;re
              most likely to overplay a strength until it backfires.
            </p>
          )}
        </section>

        {/* CORE STRENGTHS & BLINDSPOTS */}
        <section
          className="results-section"
          style={{
            marginBottom: "1.5rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
            Core Strengths & Blind Spots
          </h2>
          <div
            className="two-column"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "0.95rem",
                  marginBottom: "0.4rem",
                  color: "#bbf7d0",
                }}
              >
                Core Strengths
              </h3>
              {visibleStrengths && visibleStrengths.length > 0 ? (
                <ul
                  style={{
                    paddingLeft: "1.1rem",
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: 1.5,
                  }}
                >
                  {visibleStrengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "0.92rem", margin: 0 }}>
                  Your strengths panel didn&apos;t load yet. Try refreshing
                  this page.
                </p>
              )}
              {isFree &&
                profile.strengths &&
                profile.strengths.length > visibleStrengths.length && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.7rem",
                      color: "#9ca3af",
                    }}
                  >
                    You&apos;re seeing a taste of your strengths. Standard and
                    Premium unlock the full list plus how to use each one on
                    purpose.
                  </p>
                )}
            </div>

            <div>
              <h3
                style={{
                  fontSize: "0.95rem",
                  marginBottom: "0.4rem",
                  color: "#fecaca",
                }}
              >
                Blind Spots
              </h3>
              {visibleBlindspots && visibleBlindspots.length > 0 ? (
                <ul
                  style={{
                    paddingLeft: "1.1rem",
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: 1.5,
                  }}
                >
                  {visibleBlindspots.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "0.92rem", margin: 0 }}>
                  Your blind spot panel didn&apos;t load yet. Try refreshing
                  this page.
                </p>
              )}
              {isFree &&
                profile.blindspots &&
                profile.blindspots.length > visibleBlindspots.length && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.7rem",
                      color: "#9ca3af",
                    }}
                  >
                    You&apos;re seeing your top blind spots. Standard and
                    Premium add deeper patterns and how to keep them from
                    running the show.
                  </p>
                )}
            </div>
          </div>
        </section>

        {/* RELATIONSHIP STYLE */}
        <section
          className="results-section"
          style={{
            marginBottom: "1.5rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
            Relationship Style
          </h2>
          {isFree ? (
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              You don&apos;t connect casually — you connect{" "}
              <strong>intentionally</strong>. When people understand you,
              relationships feel steady and lower-drama. When they don&apos;t,
              the same misunderstandings keep repeating with different people.
              <br />
              <br />
              Upgrade to Standard or Premium to see exactly how your type builds
              trust, handles conflict, and chooses the right people — so you
              stop wasting energy on mismatched relationships.
            </p>
          ) : (
            <>
              <p style={{ fontSize: "0.92rem", margin: 0 }}>
                {profile.relationshipStyle ||
                  "Your type has a distinct way of showing up in relationships and the kinds of bonds you build most naturally."}
              </p>
              {(isStandard || isPremium) && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "0.7rem",
                    marginBottom: 0,
                    color: "#c7d2fe",
                  }}
                >
                  <strong>Standard Insight:</strong> This section shows you why
                  people read you the way they do — and how to choose partners,
                  friends, and collaborators who actually fit your wiring
                  instead of fighting it.
                </p>
              )}
            </>
          )}
        </section>

        {/* COMPATIBILITY SNAPSHOT */}
        <section
          className="results-section"
          style={{
            marginBottom: "1.5rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
            Compatibility Snapshot
          </h2>
          {isFree ? (
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              Some personality types tend to click with you fast — conversation
              is easy, energy feels natural, and you don&apos;t have to explain
              yourself as much. Others take more work: different pacing,
              different values, or different ways of handling stress.
              <br />
              <br />
              Upgrade to Standard or Premium to see{" "}
              <strong>which specific types</strong> usually feel most natural
              for you — and which types tend to be your most challenging matches
              so you know what you&apos;re walking into.
            </p>
          ) : (
            <>
              <p style={{ fontSize: "0.92rem", marginBottom: "0.5rem" }}>
                <strong>Most naturally compatible types:</strong> {bestTypes}
              </p>
              <p style={{ fontSize: "0.92rem", marginBottom: "0.75rem" }}>
                <strong>Types that can feel most challenging:</strong>{" "}
                {challengingTypes}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  margin: 0,
                  color: "#c7d2fe",
                }}
              >
                <strong>Standard / Premium Insight:</strong> This doesn&apos;t
                mean you can&apos;t make other combinations work. It means these
                are the patterns where your wiring is most likely to feel either
                smooth or high-friction — so you can adjust expectations and
                communication before things get messy.
              </p>
            </>
          )}
        </section>

        {/* COMMUNICATION TIPS */}
        <section
          className="results-section"
          style={{
            marginBottom: "1.5rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
            Communication Tips
          </h2>
          {isFree ? (
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              Most of your stress doesn&apos;t come from what you say — it comes
              from what people <em>think</em> you meant. The way you explain
              yourself, handle conflict, and give feedback follows a pattern
              that either reduces drama or quietly creates it.
              <br />
              <br />
              Upgrade to Standard or Premium to unlock concrete, type-specific
              communication moves so you can be understood the first time — at
              home, at work, and when money is on the line.
            </p>
          ) : visibleCommTips && visibleCommTips.length > 0 ? (
            <>
              <ul
                style={{
                  paddingLeft: "1.1rem",
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: 1.5,
                }}
              >
                {visibleCommTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
              {(isStandard || isPremium) && (
                <>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.7rem",
                      color: "#c7d2fe",
                    }}
                  >
                    <strong>Standard Insight:</strong> If you master these
                    communication patterns, you stop arguments before they
                    happen.
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.35rem",
                      color: "#9ca3af",
                    }}
                  >
                    <strong>Bonus:</strong> You communicate best when
                    conversations have a point — not just small talk.
                  </p>
                </>
              )}
            </>
          ) : (
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              Your type has a specific communication pattern. Once you see it,
              you can stop talking past people and start landing your point.
            </p>
          )}
        </section>

        {/* GROWTH FOCUS */}
        <section
          className="results-section"
          style={{
            marginBottom: "1.75rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
            Growth Focus
          </h2>
          {isFree ? (
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              Growth for you isn&apos;t about becoming someone else — it&apos;s
              about removing the friction that keeps your strengths from
              actually paying off.
              <br />
              <br />
              When you don&apos;t grow on purpose, the same patterns show up in
              your relationships, your money decisions, and your stress levels.
              Standard and Premium unlock clear, practical focus areas so you
              know exactly what to work on next instead of guessing.
            </p>
          ) : visibleGrowth && visibleGrowth.length > 0 ? (
            <>
              <ul
                style={{
                  paddingLeft: "1.1rem",
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: 1.5,
                }}
              >
                {visibleGrowth.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
              {(isStandard || isPremium) && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "0.7rem",
                    marginBottom: 0,
                    color: "#c7d2fe",
                  }}
                >
                  <strong>Standard Insight:</strong> Your biggest growth edge is
                  picking intentional moves instead of staying on autopilot when
                  pressure is high.
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              Your growth is about balancing your natural strengths so they
              don&apos;t turn into liabilities under stress.
            </p>
          )}
        </section>

        {/* PREMIUM DEEP DIVE */}
        <section
          className="results-section premium-block"
          style={{
            marginBottom: "1.75rem",
            padding: "1.2rem 1.3rem",
            borderRadius: "18px",
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%), #020617",
            border: "1px solid rgba(59,130,246,0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.9rem",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.05rem",
                  marginBottom: "0.3rem",
                }}
              >
                Premium Deep Dive
              </h2>
              <p
                style={{
                  fontSize: "0.88rem",
                  margin: 0,
                  color: "#e5e7eb",
                  maxWidth: "520px",
                }}
              >
                This section is where we stop being polite and start being
                honest about patterns — how your story plays out, why certain
                cycles repeat, and what actually changes the game.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                padding: "0.2rem",
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.6)",
              }}
            >
              <button
                type="button"
                onClick={() => setPremiumView("story")}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  backgroundColor:
                    premiumView === "story"
                      ? "rgba(59,130,246,0.9)"
                      : "transparent",
                  color:
                    premiumView === "story"
                      ? "#f9fafb"
                      : "rgba(209,213,219,0.9)",
                }}
              >
                Story View
              </button>
              <button
                type="button"
                onClick={() => setPremiumView("coach")}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  backgroundColor:
                    premiumView === "coach"
                      ? "rgba(59,130,246,0.9)"
                      : "transparent",
                  color:
                    premiumView === "coach"
                      ? "#f9fafb"
                      : "rgba(209,213,219,0.9)",
                }}
              >
                Coach View
              </button>
            </div>
          </div>

          {isPremium ? (
            <>
              {premiumView === "story" ? (
                <div
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    color: "#e5e7eb",
                  }}
                >
                  <p style={{ marginTop: 0 }}>
                    As a <strong>{mbtiType}</strong>, you naturally move through
                    life as <strong>{profile.label}</strong>. You&apos;re wired
                    to notice patterns, scan for risk, and make decisions that
                    make sense — even if they don&apos;t always look emotional
                    on the surface.
                  </p>
                  <p>
                    At your best, you&apos;re the person who keeps things from
                    sliding into chaos. You see what&apos;s coming before other
                    people do, and you&apos;re willing to make the hard calls
                    that keep things together: budgets, boundaries, schedules,
                    and standards.
                  </p>
                  <p>
                    When life is aligned, that shows up as quiet confidence.
                    People may not always understand how you got there, but they
                    feel safer because you&apos;re in the room.
                  </p>
                  <p>
                    When things tilt off balance, your type tends to double down
                    on control, distance, or overthinking. That&apos;s when your
                    strengths start to work against you — and when old patterns
                    around stress, money, or relationships repeat themselves.
                  </p>
                  <p>
                    This section is about taking that auto-pilot apart and
                    putting it back together on purpose.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    color: "#e5e7eb",
                  }}
                >
                  <p style={{ marginTop: 0 }}>
                    Here&apos;s the straight talk: your type doesn&apos;t get
                    stuck because you&apos;re lazy or don&apos;t care. You get
                    stuck because:
                  </p>
                  <ul
                    style={{
                      paddingLeft: "1.1rem",
                      margin: 0,
                      marginBottom: "0.6rem",
                    }}
                  >
                    <li>
                      You over-rely on your strongest traits until they become a
                      liability.
                    </li>
                    <li>
                      You underestimate how long-term stress changes your
                      patterns.
                    </li>
                    <li>
                      You assume other people see what you see — and they
                      don&apos;t.
                    </li>
                  </ul>
                  <p>
                    The fastest way to level up for your type is not more
                    information — it&apos;s better positioning:
                  </p>
                  <ul
                    style={{
                      paddingLeft: "1.1rem",
                      margin: 0,
                      marginBottom: "0.6rem",
                    }}
                  >
                    <li>
                      Put yourself in environments that reward your thinking
                      style.
                    </li>
                    <li>
                      Say what you&apos;re doing and why sooner, not after
                      people are confused.
                    </li>
                    <li>
                      Treat recovery (sleep, rest, mental reset) as a business
                      decision, not a luxury.
                    </li>
                  </ul>
                  <p>
                    You&apos;re not &quot;too much&quot; or &quot;too
                    intense&quot; — you&apos;re just wired in a way that needs
                    better systems, better boundaries, and better fits. The more
                    intentional you are about that, the less drama you have to
                    manage later.
                  </p>
                </div>
              )}

              {/* FLEXIBILITY INSIGHT */}
              <div
                style={{
                  marginTop: "1.2rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(148,163,184,0.5)",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    marginBottom: "0.5rem",
                    color: "#bfdbfe",
                  }}
                >
                  Trait Flexibility Map
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    marginTop: 0,
                    marginBottom: "0.75rem",
                    color: "#e5e7eb",
                  }}
                >
                  Not every part of your personality is equally fixed. Some
                  traits will flex easily with environment and season — others
                  will stay rock solid unless life hits very hard. Here&apos;s
                  where your type has the most room to shift right now:
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "0.9rem",
                  }}
                >
                  {flexibilityRanking.map((axis, index) => {
                    const line = buildFlexibilityLine(axis, index);
                    return (
                      <div
                        key={axis.code}
                        style={{
                          padding: "0.85rem 0.9rem",
                          borderRadius: "14px",
                          background:
                            "radial-gradient(circle at top left, rgba(56,189,248,0.1), rgba(15,23,42,0.98))",
                          border: "1px solid rgba(148,163,184,0.45)",
                          fontSize: "0.86rem",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            marginBottom: "0.35rem",
                            color: "#e5e7eb",
                          }}
                        >
                          {line.heading}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            marginBottom: "0.35rem",
                            color: "#cbd5f5",
                          }}
                        >
                          This trait is{" "}
                          <span style={{ fontWeight: 600 }}>
                            {line.flexibility}
                          </span>{" "}
                          for you right now — meaning it&apos;s one of the first
                          areas to shift when your environment or stress level
                          changes.
                        </p>
                        <p
                          style={{
                            margin: 0,
                            marginBottom: "0.25rem",
                            color: "#9ca3af",
                          }}
                        >
                          <strong>Big life events that move it:</strong>{" "}
                          {line.major}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "#9ca3af",
                          }}
                        >
                          <strong>Smaller daily shifts that nudge it:</strong>{" "}
                          {line.minor}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Premium-only PDF download button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1.1rem",
                }}
              >
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (onDownloadPdf) {
                      onDownloadPdf(safeResults);
                    } else {
                      alert("PDF download is not configured.");
                    }
                  }}
                >
                  Download Full PDF Report
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: "0.9rem",
                color: "#e5e7eb",
              }}
            >
              <p style={{ marginTop: 0 }}>
                Premium is where we zoom out and connect the dots: your patterns
                under stress, the kinds of cycles you repeat, and the few moves
                that actually change your trajectory.
              </p>
              <ul
                style={{
                  paddingLeft: "1.1rem",
                  margin: 0,
                  marginBottom: "0.8rem",
                }}
              >
                <li>
                  A real-world story of how your pattern tends to play out in
                  life and relationships.
                </li>
                <li>
                  A coach-style breakdown of where you&apos;re leaking energy,
                  time, or money — and how to stop.
                </li>
                <li>
                  A &quot;flexibility map&quot; that shows which traits are most likely
                  to shift as your life changes.
                </li>
              </ul>
              <button
                type="button"
                className="primary-btn"
                onClick={() => onUpgradeClick && onUpgradeClick("premium")}
              >
                Unlock Full Premium Deep Dive
              </button>
            </div>
          )}
        </section>

        {/* BOTTOM ACTIONS */}
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginTop: "0.5rem",
          }}
        >
          <button
            type="button"
            className="secondary-btn"
            onClick={onRestart}
          >
            Retake Assessment
          </button>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {isPremium && !isFree && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  if (onDownloadPdf) {
                    onDownloadPdf(safeResults);
                  } else {
                    alert("PDF download is not configured.");
                  }
                }}
              >
                Download Full PDF Report
              </button>
            )}
            {!isPremium && (
              <button
                type="button"
                className="primary-btn"
                onClick={() => onUpgradeClick && onUpgradeClick("premium")}
              >
                Go Premium for Full Deep Dive
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
