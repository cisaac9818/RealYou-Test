// src/App.jsx
import { downloadPersonalityPdf } from "./utils/pdfReport";
import React, { useState, useEffect } from "react";
import ModeSelector from "./Components/ModeSelector";
import Assessment from "./Components/Assessment";
import Results from "./Components/Results";
import LandingPage from "./Components/LandingPage";
import EmailCapture from "./Components/EmailCapture";
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

// ✅ API base (dev vs prod). In production set VITE_API_BASE=https://yourdomain.com
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4242";

/**
 * Lead capture:
 * 1) Try your server first (so Gmail can send + server inserts securely)
 * 2) If server fails, fallback to Supabase REST (your original working method)
 *
 * Requires for fallback:
 *  VITE_SUPABASE_URL
 *  VITE_SUPABASE_ANON_KEY
 */
async function saveLeadToBackend(
  profile,
  referralInfo,
  plan,
  hasCompletedAssessment
) {
  const payload = {
    name: profile.name || null,
    email: profile.email,
    agree_to_emails: profile.agreeToEmails ?? null,
    plan_at_signup: plan || null,
    has_completed_assessment: !!hasCompletedAssessment,
    referral_code:
      referralInfo?.ref ||
      referralInfo?.code ||
      referralInfo?.utm_campaign ||
      null,
    utm_source: referralInfo?.utm_source || null,
    utm_medium: referralInfo?.utm_medium || null,
    utm_campaign: referralInfo?.utm_campaign || null,
    captured_at: new Date().toISOString(),
  };

  // 1) Try SERVER route first
  try {
    const res = await fetch(`${API_BASE}/api/lead-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("[RealYou] Lead captured via SERVER.");
      return;
    }

    const text = await res.text();
    console.warn("[RealYou] Server lead-capture failed:", res.status, text);
  } catch (err) {
    console.warn("[RealYou] Server lead-capture error:", err);
  }

  // 2) Fallback to SUPABASE REST (your original working method)
  const supabaseUrl = "https://zjjctmwatmpkjjgzyqen.supabase.co";
const supabaseAnonKey = "sb_publishable_ybG6FAO6rPYLJPSX0oJmsg_AVRFqVJf"; // your publishable key (NOT sb_secret)


  console.log("[RealYou] Supabase URL:", supabaseUrl);
  console.log("[RealYou] Supabase anon present?:", !!supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[RealYou] Supabase env vars missing; skipping fallback lead capture."
    );
    return;
  }

  console.log("[RealYou] Fallback: Sending lead payload to Supabase:", payload);

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/realyou_leads`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    console.log("[RealYou] Supabase response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.warn("[RealYou] Supabase lead insert failed:", res.status, text);
    } else {
      console.log("[RealYou] Lead inserted successfully via Supabase fallback.");
    }
  } catch (err) {
    console.error("[RealYou] Supabase lead insert error:", err);
  }
}

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

// ✅ Always start on the landing page
function getInitialStage() {
  return "landing";
}

function App() {
  const [plan, setPlan] = useState(() => getInitialPlan());
  const [hasChosenPlan, setHasChosenPlan] = useState(() => {
    const p = getInitialPlan();
    return p === "free" || p === "standard" || p === "premium";
  });

  const [mode, setMode] = useState(null);

  // load persisted results
  const [results, setResults] = useState(() => getInitialResults());

  // track whether user has completed at least one assessment
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(() => {
    return localStorage.getItem("pp_hasCompletedAssessment") === "true";
  });

  // stage: "landing" | "mode" | "assessment" | "results"
  const [stage, setStage] = useState(() => getInitialStage());

  // show “you just upgraded” toast on Results
  const [justUpgradedTier, setJustUpgradedTier] = useState(null);

  // 🔹 Email gate state
  const [hasEmailCaptureCompleted, setHasEmailCaptureCompleted] = useState(() => {
    return !!localStorage.getItem("pp_userProfile");
  });

  const [userProfile, setUserProfile] = useState(() => {
    const raw = localStorage.getItem("pp_userProfile");
    if (!raw) return { name: "", email: "" };
    try {
      return JSON.parse(raw);
    } catch (e) {
      return { name: "", email: "" };
    }
  });

  // 🔹 Hidden referral / coupon tracking state
  const [referralInfo, setReferralInfo] = useState(() => {
    const raw = localStorage.getItem("pp_referralInfo");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

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
      const hasCompleted =
        localStorage.getItem("pp_hasCompletedAssessment") === "true";
      const hasResults = !!localStorage.getItem("pp_results");

      if (hasCompleted && hasResults) {
        setStage("results");
      } else {
        // After purchase, drop them into plan/mode flow
        setStage("mode");
      }

      // Clean URL of checkout params
      params.delete("checkout");
      params.delete("tier");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []); // run once on mount

  // 🔹 Hidden coupon / UTM tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const ref = params.get("ref");
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");

    if (ref || utmSource || utmMedium || utmCampaign) {
      const info = {
        ref: ref || null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        capturedAt: new Date().toISOString(),
      };

      setReferralInfo(info);
      try {
        localStorage.setItem("pp_referralInfo", JSON.stringify(info));
      } catch (e) {
        console.warn("[RealYou] Failed to persist referral info", e);
      }
    }
  }, []);

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

  // Use Stripe Payment Links instead of backend API
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
    // ✅ Send them back to the landing page when they restart
    setStage("landing");

    localStorage.removeItem("pp_results");
    localStorage.setItem("pp_hasCompletedAssessment", "false");
    setHasCompletedAssessment(false);
    // we intentionally DO NOT clear email / referral info
  }

  // 🔹 Email capture submit
  function handleEmailCaptureSubmit({ name, email, agreeToEmails }) {
    const profile = {
      name: name || "",
      email,
      agreeToEmails: !!agreeToEmails,
    };

    setUserProfile(profile);
    setHasEmailCaptureCompleted(true);

    try {
      localStorage.setItem("pp_userProfile", JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to cache profile", e);
    }

    // Fire-and-forget lead capture (server -> gmail + supabase, fallback -> supabase)
    saveLeadToBackend(profile, referralInfo, plan, hasCompletedAssessment).catch(
      (err) => {
        console.error("[RealYou] Lead capture failed:", err);
      }
    );
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

  // Landing-page button handlers
  function handleLandingStartFree() {
    // Go straight into plan/mode selection
    setStage("mode");
  }

  function handleLandingStandardClick() {
    handleUpgradeClick("standard");
  }

  function handleLandingPremiumClick() {
    handleUpgradeClick("premium");
  }

  return (
    <div className="app-shell">
      {/* Marketing landing page */}
      {stage === "landing" && (
        <LandingPage
          onStartTest={handleLandingStartFree}
          onStandardClick={handleLandingStandardClick}
          onPremiumClick={handleLandingPremiumClick}
        />
      )}

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
        <Assessment mode={mode} onComplete={handleAssessmentComplete} plan={plan} />
      )}

      {/* 🔹 gate results behind email capture */}
      {stage === "results" && results && !hasEmailCaptureCompleted && (
        <EmailCapture
          onSubmit={handleEmailCaptureSubmit}
          initialName={userProfile.name}
          initialEmail={userProfile.email}
        />
      )}

      {stage === "results" && results && hasEmailCaptureCompleted && (
        <Results
          plan={plan}
          results={results}
          onRestart={handleRestart}
          onUpgradeClick={handleUpgradeClick}
          hasCompletedAssessment={hasCompletedAssessment}
          onDownloadPdf={handleDownloadPdf}
          justUpgradedTier={justUpgradedTier}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}

export default App;
