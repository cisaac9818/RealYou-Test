// src/App.jsx
import { downloadPersonalityPdf } from "./utils/pdfReport";
import React, { useState, useEffect } from "react";
import ModeSelector from "./Components/ModeSelector";
import Assessment from "./Components/Assessment";
import Results from "./Components/Results";
import LandingPage from "./Components/LandingPage";
import EmailCapture from "./Components/EmailCapture";
import { scoreAssessment } from "./utils/scoring";

// ===========================
// ✅ ADMIN "NO CREDIT CARD" TEST KEY (LIVE + LOCAL)
// Change this to your own secret
// ===========================
const ADMIN_TEST_KEY = "REALYOU2025";

// REAL STRIPE PRICE IDS (LIVE MODE)
// (kept for reference, not used in Payment Link mode)
const STANDARD_PRICE_ID = "price_1ScYHxPw7L4bxLNhPUs7AmXI"; // $6.99 LIVE
const PREMIUM_PRICE_ID = "price_1ScYN6Pw7L4bxLNhTuP1AE75"; // $14.99 LIVE

// Stripe Payment Links (LIVE, no backend)
const STANDARD_CHECKOUT_URL =
  "https://buy.stripe.com/eVqeVf6JV3Nx8YO0Fw1gs00";
const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/8x28wR7NZesb0sidsi1gs01";

// ✅ DISCOUNT UPGRADE LINK: Standard -> Premium (ONE-TIME $8)
const PREMIUM_UPGRADE_FROM_STANDARD_URL =
  "https://buy.stripe.com/3cIbJ38S397Rdf44VM1gs02";

// ✅ Supabase constants (used for token results table ONLY here)
const SUPABASE_URL = "https://zjjctmwatmpkjjgzyqen.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_ybG6FAO6rPYLJPSX0oJmsg_AVRFqVJf"; // publishable key

// ✅ API base for Supabase Edge Functions
const API_BASE = `${SUPABASE_URL}/functions/v1`;

// ===========================
// ✅ TOKEN RESTORE HELPERS (B)
// ===========================

function makeToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `tok_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

async function saveResultsSnapshotToSupabase({ email, name, results, answers }) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[RealYou] Supabase keys missing; cannot save results token.");
    return null;
  }

  const token = makeToken();

  const payload = {
    token,
    email,
    name: name || null,
    results_json: results,
    answers_json: answers || null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/realyou_results`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn("[RealYou] Failed to save token snapshot:", res.status, text);
    return null;
  }

  return token;
}

async function loadResultsSnapshotByToken(token) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[RealYou] Supabase keys missing; cannot restore results token.");
    return null;
  }

  const url =
    `${SUPABASE_URL}/rest/v1/realyou_results` +
    `?select=token,email,name,results_json,answers_json,created_at` +
    `&token=eq.${encodeURIComponent(token)}` +
    `&limit=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn("[RealYou] Token restore fetch failed:", res.status, text);
    return null;
  }

  const rows = await res.json();
  if (!rows || !rows.length) return null;

  return rows[0];
}

/**
 * Lead capture:
 * 1) Use Supabase Edge Function first (secure insert with service role)
 * 2) If it fails, fallback to Supabase REST (optional safety net)
 *
 * NOTE: Snapshot saving is now via Edge Functions (/save-snapshot).
 */
async function saveLeadToBackend(profile, referralInfo, plan, hasCompletedAssessment) {
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

  // 1) Try Edge Function first
  try {
    const res = await fetch(`${API_BASE}/lead-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("[RealYou] Lead captured via Edge Function.");
      return;
    }

    // ✅ Treat duplicates as success
    if (res.status === 409) {
      console.log("[RealYou] Lead already exists (Edge). Treating as success.");
      return;
    }

    const text = await res.text();
    console.warn("[RealYou] Edge lead-capture failed:", res.status, text);
  } catch (err) {
    console.warn("[RealYou] Edge lead-capture error:", err);
  }

  // 2) Optional fallback to Supabase REST (only works if your RLS/policies allow)
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[RealYou] Supabase keys missing; skipping fallback lead capture.");
    return;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/realyou_leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("[RealYou] Lead inserted successfully via Supabase fallback.");
      return;
    }

    // ✅ Treat duplicates as success
    if (res.status === 409) {
      console.log("[RealYou] Lead already exists (Supabase). Treating as success.");
      return;
    }

    const text = await res.text();
    console.warn("[RealYou] Supabase lead insert failed:", res.status, text);
  } catch (err) {
    console.error("[RealYou] Supabase lead insert error:", err);
  }
}

function getInitialPlan() {
  const adminView = localStorage.getItem("pp_adminViewPlan");
  if (adminView === "free" || adminView === "standard" || adminView === "premium") {
    return adminView;
  }

  const storedPlan = localStorage.getItem("pp_plan");
  if (storedPlan === "standard" || storedPlan === "premium" || storedPlan === "free") {
    return storedPlan;
  }

  if (localStorage.getItem("pp_hasPremium") === "true") {
    return "premium";
  }

  return "free";
}

function getInitialResults() {
  const raw = localStorage.getItem("pp_results");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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
  const [results, setResults] = useState(() => getInitialResults());

  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(() => {
    return localStorage.getItem("pp_hasCompletedAssessment") === "true";
  });

  // ✅ stages: landing | mode | assessment | email | results
  const [stage, setStage] = useState(() => getInitialStage());
  const [justUpgradedTier, setJustUpgradedTier] = useState(null);

  const [hasEmailCaptureCompleted, setHasEmailCaptureCompleted] = useState(() => {
    return !!localStorage.getItem("pp_userProfile");
  });

  const [userProfile, setUserProfile] = useState(() => {
    const raw = localStorage.getItem("pp_userProfile");
    if (!raw) return { name: "", email: "" };
    try {
      return JSON.parse(raw);
    } catch {
      return { name: "", email: "" };
    }
  });

  const [referralInfo, setReferralInfo] = useState(() => {
    const raw = localStorage.getItem("pp_referralInfo");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [lastRawAnswers, setLastRawAnswers] = useState(() => {
    const raw = localStorage.getItem("pp_lastRawAnswers");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  // Persist plan
  useEffect(() => {
    const adminView = localStorage.getItem("pp_adminViewPlan");
    if (!adminView) {
      localStorage.setItem("pp_plan", plan);
    }

    if (plan === "premium") localStorage.setItem("pp_hasPremium", "true");
    if (plan === "standard") localStorage.setItem("pp_hasStandard", "true");
  }, [plan]);

  // ✅ Token restore (?token=xxxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    (async () => {
      const row = await loadResultsSnapshotByToken(token);
      if (!row || !row.results_json) {
        console.warn("[RealYou] Invalid/expired token:", token);
        return;
      }

      setResults(row.results_json);
      localStorage.setItem("pp_results", JSON.stringify(row.results_json));

      setHasCompletedAssessment(true);
      localStorage.setItem("pp_hasCompletedAssessment", "true");

      const restoredProfile = {
        name: row.name || "",
        email: row.email || "",
        agreeToEmails: true,
      };
      setUserProfile(restoredProfile);
      setHasEmailCaptureCompleted(true);
      localStorage.setItem("pp_userProfile", JSON.stringify(restoredProfile));

      setStage("results");

      params.delete("token");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, "", newUrl);

      console.log("[RealYou] Restored results via token.");
    })();
  }, []);

  // ✅ Admin view (?admin=premium&key=REALYOU2025)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const admin = (params.get("admin") || "").toLowerCase();
    const key = params.get("key") || "";

    if (!admin || !key) return;
    if (key !== ADMIN_TEST_KEY) return;

    if (admin === "standard" || admin === "premium" || admin === "free") {
      localStorage.setItem("pp_adminViewPlan", admin);
      setPlan(admin);
      setHasChosenPlan(true);

      const hasResults = !!localStorage.getItem("pp_results");
      const hasCompleted = localStorage.getItem("pp_hasCompletedAssessment") === "true";
      if (hasResults && hasCompleted) setStage("results");
    }

    if (admin === "off") {
      localStorage.removeItem("pp_adminViewPlan");
      const real = localStorage.getItem("pp_plan") || "free";
      setPlan(real);
      setHasChosenPlan(true);
    }

    ["admin", "key"].forEach((k) => params.delete(k));
    const newSearch = params.toString();
    const newUrl =
      window.location.pathname + (newSearch ? `?${newSearch}` : "");
    window.history.replaceState({}, "", newUrl);
  }, []);

  // ✅ DEV UNLOCK (LOCAL ONLY)
  useEffect(() => {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isLocal) return;

    const params = new URLSearchParams(window.location.search);
    const debug = (params.get("debug") || "").toLowerCase();
    if (!debug) return;

    if (debug === "standard") {
      handleTierUnlocked("standard");
      setJustUpgradedTier("standard");
      const hasResults = !!localStorage.getItem("pp_results");
      setStage(hasResults ? "results" : "mode");
    }

    if (debug === "premium") {
      handleTierUnlocked("premium");
      setJustUpgradedTier("premium");
      const hasResults = !!localStorage.getItem("pp_results");
      setStage(hasResults ? "results" : "mode");
    }

    if (debug === "reset") {
      localStorage.removeItem("pp_plan");
      localStorage.removeItem("pp_hasPremium");
      localStorage.removeItem("pp_hasStandard");
      localStorage.removeItem("pp_results");
      localStorage.removeItem("pp_hasCompletedAssessment");
      localStorage.removeItem("pp_adminViewPlan");
      localStorage.removeItem("pp_userProfile");
      localStorage.removeItem("pp_lastRawAnswers");
      localStorage.removeItem("pp_resultsToken");

      setPlan("free");
      setHasChosenPlan(true);
      setResults(null);
      setHasCompletedAssessment(false);
      setJustUpgradedTier(null);
      setHasEmailCaptureCompleted(false);
      setUserProfile({ name: "", email: "" });
      setLastRawAnswers(null);
      setStage("landing");
    }

    params.delete("debug");
    const newSearch = params.toString();
    const newUrl =
      window.location.pathname + (newSearch ? `?${newSearch}` : "");
    window.history.replaceState({}, "", newUrl);
  }, []);

  // ✅ Stripe redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const checkoutStatus = params.get("checkout");
    const tier = params.get("tier");

    const upgradeStatus = params.get("upgrade");
    const from = params.get("from");

    let unlocked = null;

    if (checkoutStatus === "success" && (tier === "standard" || tier === "premium")) {
      unlocked = tier;
    }

    if (
      checkoutStatus === "success" &&
      (tier === "premium_upgrade" || tier === "upgrade_premium")
    ) {
      unlocked = "premium";
    }

    if (upgradeStatus === "success" && from === "standard") {
      unlocked = "premium";
    }

    if (unlocked) {
      localStorage.removeItem("pp_adminViewPlan");

      handleTierUnlocked(unlocked);
      setJustUpgradedTier(unlocked);

      const hasCompleted = localStorage.getItem("pp_hasCompletedAssessment") === "true";
      const hasResults = !!localStorage.getItem("pp_results");

      if (hasCompleted && hasResults) setStage("results");
      else setStage("mode");

      ["checkout", "tier", "upgrade", "from"].forEach((k) => params.delete(k));
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // UTM capture
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
      localStorage.setItem("pp_hasStandard", "true");
    } else {
      setPlan("free");
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

  function handleUpgradeClick(tier = "premium") {
    const isStandardUser = plan === "standard";

    if (tier === "premium" && isStandardUser) {
      window.location.href = PREMIUM_UPGRADE_FROM_STANDARD_URL;
      return;
    }

    const url = tier === "standard" ? STANDARD_CHECKOUT_URL : PREMIUM_CHECKOUT_URL;
    window.location.href = url;
  }

  function handleModeSelect(selectedMode) {
    setMode(selectedMode);
    setStage("assessment");
  }

  // ✅ FIX: Assessment complete now routes to a dedicated EMAIL stage
  function handleAssessmentComplete(rawAnswers) {
    setLastRawAnswers(rawAnswers);
    try {
      localStorage.setItem("pp_lastRawAnswers", JSON.stringify(rawAnswers));
    } catch {}

    const scored = scoreAssessment(rawAnswers);

    setResults(scored);
    localStorage.setItem("pp_results", JSON.stringify(scored));
    localStorage.setItem("pp_hasCompletedAssessment", "true");
    setHasCompletedAssessment(true);

    // If we already have an email saved, go straight to results.
    // Otherwise force email capture (no more "skips").
    const alreadyHasEmail =
      !!(userProfile?.email && /^\S+@\S+\.\S+$/.test(userProfile.email)) &&
      hasEmailCaptureCompleted;

    setStage(alreadyHasEmail ? "results" : "email");
  }

  function handleRestart() {
    setResults(null);
    setMode(null);
    setStage("landing");

    localStorage.removeItem("pp_results");
    localStorage.setItem("pp_hasCompletedAssessment", "false");
    setHasCompletedAssessment(false);
  }

  // ✅ Email restore handler (LandingPage uses this)
  async function handleRecoverByEmail(email) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      alert("Please enter a valid email to recover your Snapshot.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/recover-snapshot?email=${encodeURIComponent(cleanEmail)}`
      );

      if (res.status === 404) {
        alert(
          "No saved Snapshot found for that email yet. If you took the test before, use the same email you entered to view results."
        );
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.warn("[RealYou] Recover snapshot failed:", res.status, text);
        alert("Could not recover Snapshot right now. Try again in a moment.");
        return;
      }

      const data = await res.json();

      // ✅ Match the Edge Function response shape:
      // { row: { email, name, result_snapshot } }
      const row = data?.row;
      const snap = row?.result_snapshot;

      if (!snap) {
        alert(
          "No saved Snapshot found for that email yet. If you took the test before, use the same email you entered to view results."
        );
        return;
      }

      // Restore results
      setResults(snap);
      localStorage.setItem("pp_results", JSON.stringify(snap));

      // Mark assessment completed so upgrades don’t force retest
      setHasCompletedAssessment(true);
      localStorage.setItem("pp_hasCompletedAssessment", "true");

      // Treat recovery as “email already provided”
      const restoredProfile = {
        name: row?.name || "",
        email: cleanEmail,
        agreeToEmails: true,
      };
      setUserProfile(restoredProfile);
      setHasEmailCaptureCompleted(true);
      localStorage.setItem("pp_userProfile", JSON.stringify(restoredProfile));

      setStage("results");
      return;
    } catch (e) {
      console.warn("[RealYou] Recover snapshot error:", e);
      alert("Could not recover Snapshot right now. Try again in a moment.");
      return;
    }
  }

  // ✅ FIX: Email submit now moves from EMAIL stage -> RESULTS stage
  async function handleEmailCaptureSubmit({ name, email, agreeToEmails }) {
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

    // 1) Capture lead (Edge first, fallback second)
    saveLeadToBackend(profile, referralInfo, plan, hasCompletedAssessment).catch((err) => {
      console.error("[RealYou] Lead capture failed:", err);
    });

    // ✅ 2) Save email-based snapshot via Edge Function
    if (results && profile.email) {
      try {
        const snapRes = await fetch(`${API_BASE}/save-snapshot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile.email,
            name: profile.name,
            results,
          }),
        });

        if (!snapRes.ok) {
          const text = await snapRes.text();
          console.warn("[RealYou] Snapshot save failed:", snapRes.status, text);
        } else {
          console.log("[RealYou] Snapshot saved via Edge Function (email recovery ready).");
        }
      } catch (e) {
        console.warn("[RealYou] Snapshot save error:", e);
      }
    }

    // ✅ 3) Save token-based snapshot (shareable restore link)
    if (results && profile.email) {
      try {
        const token = await saveResultsSnapshotToSupabase({
          email: profile.email,
          name: profile.name,
          results,
          answers: lastRawAnswers,
        });

        if (token) {
          localStorage.setItem("pp_resultsToken", token);
          const restoreLink = `${window.location.origin}${window.location.pathname}?token=${token}`;
          console.log("[RealYou] Restore link:", restoreLink);
        }
      } catch (e) {
        console.warn("[RealYou] Token save failed:", e);
      }
    }

    // ✅ Now go to results
    setStage("results");
  }

  function handleDownloadPdf() {
    if (!results) {
      alert("No results available to export yet.");
      return;
    }

    const tier = plan;

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

  function handleLandingStartFree() {
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
      {stage === "landing" && (
        <LandingPage
          onStartTest={handleLandingStartFree}
          onStandardClick={handleLandingStandardClick}
          onPremiumClick={handleLandingPremiumClick}
          onRecoverByEmail={handleRecoverByEmail}
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

      {/* ✅ NEW: dedicated Email stage */}
      {stage === "email" && results && (
        <EmailCapture
          onSubmit={handleEmailCaptureSubmit}
          initialName={userProfile.name}
          initialEmail={userProfile.email}
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
          userProfile={userProfile}
        />
      )}
    </div>
  );
}

export default App;
// deploy trigger
