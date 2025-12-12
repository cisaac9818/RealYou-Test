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
          Personality Assessment
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
                onClick={() => handleSelect(val)}
                style={{
                  flex: "1 1 0",
                  maxWidth: "155px",
                  padding: "0.9rem 0.75rem",
                  borderRadius: "18px",
                  border: isSelected ? `2px solid ${accent}` : "1px solid #27272f",
                  background: isSelected ? "#020617" : "#111827",
                  color: "#e5e7eb",
                  textAlign: "center",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition:
                    "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease",
                  boxShadow: isSelected
                    ? `0 16px 40px rgba(56,189,248,0.45)`
                    : "0 10px 30px rgba(0,0,0,0.6)",
                }}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
              cursor:
                currentIndex === 0 || isFinished ? "default" : "pointer",
              border: "none",
              fontWeight: 500,
              opacity: currentIndex === 0 || isFinished ? 0.5 : 1,
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
              fontWeight: 700,
              opacity: !selected || isFinished ? 0.7 : 1,
              boxShadow:
                !selected || isFinished
                  ? "none"
                  : "0 18px 50px rgba(59,130,246,0.55)",
            }}
          >
            {currentIndex === total - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
