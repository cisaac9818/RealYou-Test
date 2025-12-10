// src/App.jsx
import { downloadPersonalityPdf } from "./utils/pdfReport";
import React, { useState, useEffect } from "react";
import ModeSelector from "./Components/ModeSelector";
import Assessment from "./Components/Assessment";
import Results from "./Components/Results";
import { scoreAssessment } from "./utils/scoring";

// REAL STRIPE PRICE IDS (LIVE MODE)
// (kept for reference, not used in Payment Link mode)
const STANDARD_PRICE_ID = "price_1ScYHxPw7L4bxLNhPUs7AmXI"; // $6.99 LIVE
const PREMIUM_PRICE_ID = "price_1ScYN6Pw7L4bxLNhTuP1AE75"; // $14.99 LIVE

// Stripe Payment Links (LIVE, no backend)
const STANDARD_CHECKOUT_URL =
  "https://buy.stripe.com/eVqeVf6JV3Nx8YO0Fw1gs00";
const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/8x28wR7NZesb0sidsi1gs01";

function getInitialPlan() {
  const storedPlan = localStorage.getItem("pp_plan");

  if (
    storedPlan === "standard" ||
    storedPlan === "premium" ||
    storedPlan === "free"
  ) {
    return storedPlan;
  }

  if (localStorage.getItem("pp_hasPremium") === "true") {
    return "premium";
  }

  return "free";
}

// restore existing results if available
function getInitialResults() {
  const raw = localStorage.getItem("pp_results");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// choose start screen based on whether user already completed assessment
function getInitialStage() {
  const hasCompleted =
    localStorage.getItem("pp_hasCompletedAssessment") === "true";
  const hasResults = !!localStorage.getItem("pp_results");

  if (hasCompleted && hasResults) return "results";
  return "mode";
}

function App() {
  const [plan, setPlan] = useState(getInitialPlan);

  const [hasChosenPlan, setHasChosenPlan] = useState(() => {
    const p = getInitialPlan();
    return p === "free" || p === "standard" || p === "premium";
  });

  const [mode, setMode] = useState(null);

  // load persisted results
  const [results, setResults] = useState(getInitialResults);

  // track whether user has completed at least one assessment
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(() => {
    return localStorage.getItem("pp_hasCompletedAssessment") === "true";
  });

  // load stage from persisted data
  const [stage, setStage] = useState(getInitialStage);

  // show “you just upgraded” toast on Results
  const [justUpgradedTier, setJustUpgradedTier] = useState(null);

  // Persist plan
  useEffect(() => {
    localStorage.setItem("pp_plan", plan);
    if (plan === "premium") {
      localStorage.setItem("pp_hasPremium", "true");
    }
  }, [plan]);

  // Handle Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    const tier = params.get("tier");

    if (
      checkoutStatus === "success" &&
      (tier === "standard" || tier === "premium")
    ) {
      handleTierUnlocked(tier);

      // flag this run so Results can show an “unlocked” banner
      setJustUpgradedTier(tier);

      // If user already took the test → return them to Results automatically
      if (hasCompletedAssessment && results) {
        setStage("results");
      } else {
        setStage("mode");
      }

      // Clean URL
      params.delete("checkout");
      params.delete("tier");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []); // run once on mount

  function handleTierUnlocked(tier) {
    if (tier === "premium") {
      setPlan("premium");
      localStorage.setItem("pp_hasPremium", "true");
    } else if (tier === "standard") {
      setPlan("standard");
    }

    localStorage.setItem("pp_plan", tier);
    setHasChosenPlan(true);
  }

  function handlePlanChosen(tier) {
    if (tier === "free") {
      setPlan("free");
      localStorage.setItem("pp_plan", "free");
    }
    setHasChosenPlan(true);
  }

  // NEW: Use Stripe Payment Links instead of backend API
  function handleUpgradeClick(tier = "premium") {
    const url =
      tier === "standard" ? STANDARD_CHECKOUT_URL : PREMIUM_CHECKOUT_URL;

    // Send user straight to Stripe Checkout (hosted Payment Link)
    window.location.href = url;
  }

  function handleModeSelect(selectedMode) {
    setMode(selectedMode);
    setStage("assessment");
  }

  function handleAssessmentComplete(rawAnswers) {
    const scored = scoreAssessment(rawAnswers);

    setResults(scored);
    setStage("results");

    // Save results & flag so they persist past Stripe redirect
    localStorage.setItem("pp_results", JSON.stringify(scored));
    localStorage.setItem("pp_hasCompletedAssessment", "true");

    setHasCompletedAssessment(true);
  }

  function handleRestart() {
    setResults(null);
    setMode(null);
    setStage("mode");

    localStorage.removeItem("pp_results");
    localStorage.setItem("pp_hasCompletedAssessment", "false");
    setHasCompletedAssessment(false);
  }

  // PDF download handler for Premium
  function handleDownloadPdf() {
    if (!results) {
      alert("No results available to export yet.");
      return;
    }

    const tier = plan; // "free" | "standard" | "premium"

    // Try to use the richer profile object if scoring already built one
    const profile =
      results.profile || {
        typeName: results.personalityName || "Your Type",
        typeCode: results.mbtiType || "Type",
        summary: results.summary || "",
        strengths: results.strengths || [],
        blindSpots: results.blindSpots || [],
        bestMatches: results.bestMatches || [],
        growthAreas: results.growthAreas || [],
        emotionalPatterns: results.emotionalPatterns || [],
        redFlags: results.redFlags || [],
        greenFlags: results.greenFlags || [],
      };

    try {
      downloadPersonalityPdf({
        tier,
        result: results,
        profile,
      });
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Something went wrong generating your PDF. Please try again.");
    }
  }

  return (
    <div className="app-shell">
      {stage === "mode" && (
        <ModeSelector
          plan={plan}
          hasChosenPlan={hasChosenPlan}
          onPlanChosen={handlePlanChosen}
          onSelect={handleModeSelect}
          onUpgradeClick={handleUpgradeClick}
        />
      )}

      {stage === "assessment" && mode && (
        <Assessment
          mode={mode}
          onComplete={handleAssessmentComplete}
          plan={plan}
        />
      )}

      {stage === "results" && results && (
        <Results
          plan={plan}
          results={results}
          onRestart={handleRestart}
          onUpgradeClick={handleUpgradeClick}
          hasCompletedAssessment={hasCompletedAssessment}
          onDownloadPdf={handleDownloadPdf}
          justUpgradedTier={justUpgradedTier}
        />
      )}
    </div>
  );
}

export default App;
