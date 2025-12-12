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

export default function Assessment({ mode, onComplete, plan }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: number }
  const [isFinished, setIsFinished] = useState(false);

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
      setCurrentIndex((old) => (old === indexAtClick ? indexAtClick + 1 : old));
    }, 150);
  }

  // Manual Next button (optional)
  function handleNext() {
    if (!selected) return;

    if (currentIndex < total - 1) {
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
        padding: "2rem",
        background: "#020617",
      }}
    >
      {/* Centered assessment card */}
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "26px",
          padding: "2.75rem 2.5rem 2.25rem",
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
            fontSize: "2.6rem",
            fontWeight: 800,
            marginBottom: "0.25rem",
            textAlign: "center",
          }}
        >
          Personality Snapshot
        </h1>

        <p
          style={{
            opacity: 0.8,
            marginBottom: "1.75rem",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          Question {currentIndex + 1} of {total}
        </p>

        {/* Question text */}
        <p
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "2.5rem",
            lineHeight: 1.4,
          }}
        >
          {questionText}
        </p>

        {/* Answer choices – single row, colorful boxes */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.9rem",
            marginBottom: "2.5rem",
            flexWrap: "nowrap",
          }}
        >
          {[1, 2, 3, 4, 5].map((val) => {
            const isActive = selected === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelect(val)}
                style={{
                  width: "150px",
                  padding: "0.9rem 0.8rem",
                  borderRadius: "16px",
                  border: isActive
                    ? "2px solid rgba(59,130,246,0.95)"
                    : "1px solid rgba(148,163,184,0.28)",
                  background: isActive
                    ? "rgba(59,130,246,0.18)"
                    : "rgba(15,23,42,0.75)",
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 120ms ease, background 120ms ease",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                  boxShadow: isActive
                    ? "0 14px 32px rgba(37,99,235,0.22)"
                    : "none",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{val}</div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    opacity: 0.85,
                    marginTop: "0.3rem",
                  }}
                >
                  {SCALE_LABELS[val]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Nav buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            style={{
              opacity: currentIndex === 0 ? 0.35 : 1,
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              padding: "0.85rem 1.15rem",
              borderRadius: "14px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(15,23,42,0.85)",
              color: "white",
              fontWeight: 700,
              minWidth: "140px",
            }}
          >
            Back
          </button>

          {/* Optional manual Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!selected}
            style={{
              opacity: !selected ? 0.35 : 1,
              cursor: !selected ? "not-allowed" : "pointer",
              padding: "0.85rem 1.15rem",
              borderRadius: "14px",
              border: "1px solid rgba(59,130,246,0.55)",
              background: "rgba(37,99,235,0.22)",
              color: "white",
              fontWeight: 800,
              minWidth: "140px",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
