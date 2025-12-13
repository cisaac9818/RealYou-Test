// src/Components/Assessment.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import questions from "../data/questions.json";

// Shared labels so Pro & Modern look identical in layout
const SCALE_LABELS = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly agree",
};

// ✅ Checkpoint boundaries (0-based index of the question just answered)
const CHECKPOINTS = new Set([13, 27, 41]); // after Q14, Q28, Q42

export default function Assessment({ mode, onComplete, plan }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: number }
  const [isFinished, setIsFinished] = useState(false);

  // ✅ checkpoint banner state
  const [checkpoint, setCheckpoint] = useState(null); // { title, lines[] }

  const didFinishRef = useRef(false);

  const total = questions.length;
  const current = questions[currentIndex];
  const currentId = current.id;
  const selected = answers[currentId] ?? null;

  const questionText =
    mode === "genz" && current.genz ? current.genz : current.pro;

  // Build payload only when needed
  const payload = useMemo(() => {
    return questions.map((q) => ({
      id: q.id,
      value: answers[q.id] ?? 3,
    }));
  }, [answers]);

  // ✅ Fire onComplete exactly once, outside of setState/render side-effects
  useEffect(() => {
    if (!didFinishRef.current && isFinished) {
      didFinishRef.current = true;
      onComplete(payload);
    }
  }, [isFinished, onComplete, payload]);

  // ✅ Copy: Motivation + soft analysis signals
  function getCheckpointCopy(justAnsweredIndex) {
    const isModern = mode === "genz";

    // After Q14
    if (justAnsweredIndex === 13) {
      return isModern
        ? {
            title: "Nice — you’re locked in.",
            lines: [
              "You’re already giving clear patterns.",
              "RealYou is starting to map how you move through situations.",
            ],
          }
        : {
            title: "Great momentum.",
            lines: [
              "Your response patterns are starting to form.",
              "RealYou is beginning to map your decision style.",
            ],
          };
    }

    // After Q28
    if (justAnsweredIndex === 27) {
      return isModern
        ? {
            title: "This is getting interesting 👀",
            lines: [
              "Your profile is taking shape.",
              "RealYou is picking up strong consistency in how you respond.",
            ],
          }
        : {
            title: "You’re doing excellent.",
            lines: [
              "Your RealYou profile is taking shape.",
              "RealYou is detecting consistent patterns in your responses.",
            ],
          };
    }

    // After Q42 — user-specified soft signal
    if (justAnsweredIndex === 41) {
      return isModern
        ? {
            title: "Almost there.",
            lines: [
              "Stay with it — you’re close.",
              "The RealYou is showing strong clarity.",
            ],
          }
        : {
            title: "Final stretch.",
            lines: [
              "You’re close to completing your snapshot.",
              "The RealYou is showing strong clarity.",
            ],
          };
    }

    return null;
  }

  // ✅ Show checkpoint briefly, then proceed
  function maybeShowCheckpointThen(nextIndex, justAnsweredIndex) {
    const copy = getCheckpointCopy(justAnsweredIndex);
    if (!copy) {
      setCurrentIndex(nextIndex);
      return;
    }

    setCheckpoint(copy);

    // Keep it short so it motivates without feeling like a popup
    setTimeout(() => {
      setCheckpoint(null);
      setCurrentIndex(nextIndex);
    }, 1100);
  }

  // ---- AUTO-ADVANCE HANDLER ----
  function handleSelect(val) {
    const numeric = Number(val);
    const indexAtClick = currentIndex;
    const isLast = indexAtClick === total - 1;
    const qId = currentId;

    // First update answers only
    setAnswers((prev) => ({ ...prev, [qId]: numeric }));

    if (isLast) {
      // Mark finished; effect will call onComplete
      setIsFinished(true);
      return;
    }

    // Small delay so the user sees the selection before moving
    setTimeout(() => {
      // ✅ boundary check: after Q14/Q28/Q42 show checkpoint then continue
      const nextIndex = indexAtClick + 1;

      setCurrentIndex((old) => {
        // only proceed if we’re still on the same index
        if (old !== indexAtClick) return old;

        if (CHECKPOINTS.has(indexAtClick)) {
          // temporarily keep the same question while we show checkpoint
          // then we will advance via maybeShowCheckpointThen
          maybeShowCheckpointThen(nextIndex, indexAtClick);
          return old;
        }

        return nextIndex;
      });
    }, 150);
  }

  // Manual Next button (optional)
  function handleNext() {
    if (!selected) return;

    if (currentIndex < total - 1) {
      const nextIndex = currentIndex + 1;

      if (CHECKPOINTS.has(currentIndex)) {
        maybeShowCheckpointThen(nextIndex, currentIndex);
        return;
      }

      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 3vw, 2rem)", // ✅ responsive padding
        background: "#020617",
        overflowX: "hidden", // ✅ stop any horizontal spill
      }}
    >
      {/* ✅ Checkpoint banner (non-blocking) */}
      {checkpoint && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(900px, calc(100% - 2rem))",
            borderRadius: "18px",
            padding: "0.9rem 1rem",
            background: "rgba(2, 6, 23, 0.92)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.65)",
            color: "#f9fafb",
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: "0.25rem" }}>
            {checkpoint.title}
          </div>
          {checkpoint.lines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: "0.92rem",
                color: "#e5e7eb",
                lineHeight: 1.25,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Centered assessment card */}
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "26px",
          padding:
            "clamp(1.25rem, 3vw, 2.75rem) clamp(1rem, 3vw, 2.5rem) clamp(1.25rem, 3vw, 2.25rem)",
          color: "white",
          boxShadow: "0 28px 70px rgba(0,0,0,0.85)",
          background:
            "linear-gradient(145deg, #020617 0%, #020617 45%, #050816 100%)",
        }}
      >
        {/* Top pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              padding: "0.25rem 0.9rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(96,165,250,0.15)",
              color: "#93c5fd",
            }}
          >
            Quick vibe check
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(1.7rem, 5vw, 2.6rem)", // ✅ responsive title
            fontWeight: 800,
            marginBottom: "0.25rem",
            textAlign: "center",
          }}
        >
          Personality Assessment
        </h1>

        {/* ✅ Removed the "Question X of 56" counter entirely */}
        <p
          style={{
            opacity: 0.78,
            marginBottom: "1.5rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "#cbd5f5",
          }}
        >
          Answer honestly — RealYou is learning your style.
        </p>

        {/* Question text */}
        <p
          style={{
            fontSize: "clamp(1.15rem, 4vw, 1.6rem)", // ✅ responsive question size
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "clamp(1.25rem, 3vw, 2.5rem)",
            lineHeight: 1.4,
          }}
        >
          {questionText}
        </p>

        {/* ✅ Answer choices — desktop 5-col, tablet 2-col, mobile 1-col */}
        <div
          className="realyou-answers-grid" // ✅ FIX: class added so media queries work
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "0.9rem",
            marginBottom: "clamp(1.25rem, 3vw, 2.5rem)",
            width: "100%",
          }}
        >
          {[1, 2, 3, 4, 5].map((val) => {
            const isSelected = selected === val;
            const label = SCALE_LABELS[val];

            const accentColors = [
              "#f97373", // red
              "#fb923c", // orange
              "#eab308", // yellow
              "#22c55e", // green
              "#38bdf8", // blue
            ];
            const accent = accentColors[val - 1];

            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelect(val)}
                style={{
                  width: "100%",
                  padding: "0.9rem 0.75rem",
                  borderRadius: "18px",
                  border: isSelected ? `2px solid ${accent}` : "1px solid #27272f",
                  background: isSelected ? "#020617" : "#111827",
                  color: "#e5e7eb",
                  textAlign: "center",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: "pointer",

                  // ✅ allow wrapping on small screens
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "clip",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  lineHeight: 1.2,

                  transition:
                    "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease",
                  boxShadow: isSelected
                    ? `0 16px 40px rgba(56,189,248,0.45)`
                    : "0 10px 30px rgba(0,0,0,0.6)",
                }}
              >
                {/* ✅ label only — no numbers */}
                {label}
              </button>
            );
          })}
        </div>

        {/* ✅ Make the grid responsive */}
        <style>{`
          @media (max-width: 900px) {
            .realyou-answers-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
          @media (max-width: 520px) {
            .realyou-answers-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleBack}
            disabled={currentIndex === 0 || isFinished}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              background:
                currentIndex === 0 || isFinished ? "#27272a" : "#334155",
              color: "#e5e7eb",
              cursor: currentIndex === 0 || isFinished ? "default" : "pointer",
              border: "none",
              fontWeight: 600,
              opacity: currentIndex === 0 || isFinished ? 0.5 : 1,
              width: "min(220px, 100%)",
            }}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selected || isFinished}
            style={{
              padding: "0.75rem 1.9rem",
              borderRadius: "999px",
              background: !selected || isFinished ? "#27272a" : "#e0f2fe",
              color: !selected || isFinished ? "#a1a1aa" : "#0f172a",
              cursor: !selected || isFinished ? "default" : "pointer",
              border: "none",
              fontWeight: 800,
              opacity: !selected || isFinished ? 0.7 : 1,
              boxShadow:
                !selected || isFinished
                  ? "none"
                  : "0 18px 50px rgba(59,130,246,0.55)",
              width: "min(260px, 100%)",
              marginLeft: "auto",
            }}
          >
            {currentIndex === total - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
