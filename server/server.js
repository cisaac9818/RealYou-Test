// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import nodemailer from "nodemailer";

console.log("✅ LOADED server.js (duplicate-fix) —", new Date().toISOString());
console.log("✅ LOADED server.js version: 2025-12-16 duplicate-fix-v3 (snapshot routes)");

dotenv.config();

const app = express();

/**
 * CORS
 * - In dev you can keep it open.
 * - In prod, lock this down to your domain.
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// -----------------------------
// Basic health check
// -----------------------------
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getSupabaseServerConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return { supabaseUrl, supabaseServiceKey };
}

// -----------------------------
// Stripe
// -----------------------------
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[server] Missing STRIPE_SECRET_KEY in .env");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// ----------------------------------------------
// STRIPE CHECKOUT SESSION
// ----------------------------------------------
app.post("/api/create-checkout-session", async (req, res) => {
  const { priceId, tier } = req.body;

  try {
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted",
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `http://localhost:5173/?checkout=success&tier=${tier}`,
      cancel_url: `http://localhost:5173/?checkout=cancel`,
    });

    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------
// Lead capture -> Supabase + Gmail notify
// ----------------------------------------------
/**
 * Requires these SERVER env vars (do NOT put service key in Vite):
 *  SUPABASE_URL=https://xxxxx.supabase.co
 *  SUPABASE_SERVICE_ROLE_KEY=xxxxx
 *
 * Gmail env vars (optional):
 *  GMAIL_USER=...
 *  GMAIL_APP_PASSWORD=...
 *  ADMIN_NOTIFICATION_EMAIL=...
 */
app.post("/api/lead-capture", async (req, res) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload?.email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const cfg = getSupabaseServerConfig();
    if (!cfg) {
      return res.status(500).json({
        error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the server.",
      });
    }
    const { supabaseUrl, supabaseServiceKey } = cfg;

    const cleanEmail = normalizeEmail(payload.email);

    // 1) Insert into Supabase securely (server-side)
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/realyou_leads`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: payload.name ?? null,
        email: cleanEmail,
        agree_to_emails: payload.agree_to_emails ?? payload.agreeToEmails ?? null,
        plan_at_signup: payload.plan_at_signup ?? payload.planAtSignup ?? null,
        has_completed_assessment:
          payload.has_completed_assessment ??
          payload.hasCompletedAssessment ??
          false,
        referral_code: payload.referral_code ?? null,
        utm_source: payload.utm_source ?? null,
        utm_medium: payload.utm_medium ?? null,
        utm_campaign: payload.utm_campaign ?? null,
        captured_at: payload.captured_at ?? new Date().toISOString(),
      }),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text();

      // ✅ treat duplicate email as success (status OR body)
      const isDuplicate =
        insertRes.status === 409 ||
        text.includes('"code":"23505"') ||
        text.includes("duplicate key value") ||
        text.includes("realyou_leads_email_unique") ||
        text.includes("Key (email)=");

      if (isDuplicate) {
        console.log("[lead-capture] Duplicate email. Treating as success.");
        // Still continue to Gmail notify? Usually no. We’ll just return success.
        return res.status(200).json({ ok: true, duplicate: true });
      }

      console.error("[lead-capture] Supabase insert failed:", insertRes.status, text);
      return res.status(500).json({
        error: "Supabase insert failed",
        status: insertRes.status,
        details: text,
      });
    }

    // 2) Send admin notification via Gmail (optional)
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (gmailUser && gmailPass && adminEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });

      const subject = `New RealYou lead: ${cleanEmail}`;
      const body = `
New lead captured:

Name: ${payload.name || ""}
Email: ${cleanEmail || ""}
Plan at signup: ${payload.plan_at_signup || payload.planAtSignup || ""}
Completed assessment: ${
        payload.has_completed_assessment || payload.hasCompletedAssessment ? "Yes" : "No"
      }

UTM:
Source: ${payload.utm_source || ""}
Medium: ${payload.utm_medium || ""}
Campaign: ${payload.utm_campaign || ""}

Referral: ${payload.referral_code || ""}
Captured at: ${payload.captured_at || ""}
`.trim();

      await transporter.sendMail({
        from: `"RealYou" <${gmailUser}>`,
        to: adminEmail,
        subject,
        text: body,
      });
    } else {
      console.warn(
        "[lead-capture] Gmail env vars missing; saved to Supabase but skipped email notify."
      );
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("[lead-capture] route error:", err);
    return res.status(500).json({ error: "Lead capture failed" });
  }
});

// ----------------------------------------------
// ✅ NEW: Save result_snapshot securely (SERVER SIDE)
// ----------------------------------------------
/**
 * This fixes your RLS 401 problem by NEVER writing snapshots from the browser.
 * Frontend will call this route instead.
 */
app.post("/api/save-snapshot", async (req, res) => {
  try {
    const { email, name, results } = req.body || {};
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) return res.status(400).json({ error: "Missing email" });
    if (!results) return res.status(400).json({ error: "Missing results snapshot" });

    const cfg = getSupabaseServerConfig();
    if (!cfg) {
      return res.status(500).json({
        error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the server.",
      });
    }
    const { supabaseUrl, supabaseServiceKey } = cfg;

    const payload = {
      email: cleanEmail,
      name: name || null,
      result_snapshot: results,
      last_completed_at: new Date().toISOString(),
    };

    // Upsert by email (merge)
    const upsertRes = await fetch(
      `${supabaseUrl}/rest/v1/realyou_leads?on_conflict=email`,
      {
        method: "POST",
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!upsertRes.ok) {
      const text = await upsertRes.text();
      console.error("[save-snapshot] Supabase upsert failed:", upsertRes.status, text);
      return res.status(500).json({
        error: "Snapshot upsert failed",
        status: upsertRes.status,
        details: text,
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("[save-snapshot] route error:", err);
    return res.status(500).json({ error: "Save snapshot failed" });
  }
});

// ----------------------------------------------
// ✅ NEW: Recover snapshot securely by email (SERVER SIDE)
// ----------------------------------------------
app.get("/api/recover-snapshot", async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.query?.email);
    if (!cleanEmail) return res.status(400).json({ error: "Missing email" });

    const cfg = getSupabaseServerConfig();
    if (!cfg) {
      return res.status(500).json({
        error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the server.",
      });
    }
    const { supabaseUrl, supabaseServiceKey } = cfg;

    const url =
      `${supabaseUrl}/rest/v1/realyou_leads` +
      `?select=email,name,result_snapshot,last_completed_at` +
      `&email=eq.${encodeURIComponent(cleanEmail)}` +
      `&limit=1`;

    const readRes = await fetch(url, {
      method: "GET",
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!readRes.ok) {
      const text = await readRes.text();
      console.error("[recover-snapshot] Supabase read failed:", readRes.status, text);
      return res.status(500).json({
        error: "Recover snapshot failed",
        status: readRes.status,
        details: text,
      });
    }

    const rows = await readRes.json();
    if (!rows || !rows.length || !rows[0]?.result_snapshot) {
      return res.status(404).json({ ok: false, message: "No snapshot found." });
    }

    return res.json({ ok: true, row: rows[0] });
  } catch (err) {
    console.error("[recover-snapshot] route error:", err);
    return res.status(500).json({ error: "Recover snapshot failed" });
  }
});

// ----------------------------------------------
// PDF HELPER FUNCTIONS (match frontend logic)
// ----------------------------------------------

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

// Build axis explanation (Standard/Premium style)
function buildAxisSummary(code, value) {
  const meta = getAxisMeta(code);
  const { firstLabel, secondLabel, axisLabel } = meta;
  const { firstPercent, secondPercent } = axisPercentages(value);
  const abs = Math.abs(value || 0);

  let intensity;
  if (abs === 0) intensity = "a balanced position";
  else if (abs <= 2) intensity = "a slight preference";
  else if (abs <= 5) intensity = "a moderate preference";
  else intensity = "a strong preference";

  if (value === 0) {
    return `${code}: about ${firstPercent}% / ${secondPercent}% — ${intensity} on this axis. You can move fairly easily between both sides of ${axisLabel}.`;
  }

  const toward = value > 0 ? firstLabel : secondLabel;
  const leaningPercent = value > 0 ? firstPercent : secondPercent;

  return `${code}: about ${leaningPercent}% toward ${toward} (${firstPercent}% / ${secondPercent}%). That shows ${intensity} in ${axisLabel}.`;
}

// Premium flexibility helpers
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
      "New routines that demand either more structure and facts or more brainstorming and vision.",
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

function buildFlexibilityLine(axis, rankIndex) {
  const { code, firstLabel, secondLabel, axisLabel, value } = axis;
  const abs = Math.abs(value || 0);

  let flexibility;
  if (abs === 0) flexibility = "highly flexible for you right now";
  else if (abs <= 2) flexibility = "quite flexible and can shift over time";
  else if (abs <= 5) flexibility = "moderately stable but still adaptable";
  else flexibility = "pretty stable unless life hits you hard";

  const examples = FLEX_EXAMPLES[code] || FLEX_EXAMPLES.EI;
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

// ----------------------------------------------
// PDF GENERATION ROUTE (PREMIUM ONLY)
// ----------------------------------------------
app.post("/api/generate-pdf", async (req, res) => {
  try {
    const { results, plan } = req.body;

    if (!results) {
      return res.status(400).json({ error: "Missing results for PDF" });
    }

    // Hard gate: PDF is Premium-only
    if (plan !== "premium") {
      return res
        .status(403)
        .json({ error: "PDF report is available for Premium plan only." });
    }

    const profile = results.profile;
    const traitScores = results.traitScores || {};
    const mbtiType = results.mbtiType || "Unknown";

    const axes = ["EI", "SN", "TF", "JP"].map((code) => {
      const value = traitScores[code] || 0;
      const meta = getAxisMeta(code);
      const { firstPercent, secondPercent } = axisPercentages(value);
      return { code, value, ...meta, firstPercent, secondPercent };
    });

    const flexibilityRanking = [...axes].sort(
      (a, b) => Math.abs(a.value || 0) - Math.abs(b.value || 0)
    );

    const doc = new PDFDocument({ margin: 50 });

    // Buffer the PDF output
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="realyou-personality-report.pdf"',
          "Content-Length": pdfData.length,
        })
        .end(pdfData);
    });

    // ------------- PAGE 1 -------------
    doc.fontSize(22).text("RealYou Test – Personality Report", { align: "center" });
    doc.moveDown(0.4);
    doc.fontSize(13).text("Plan: Premium (includes all insights)", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(16).text(`Type: ${mbtiType}`, { align: "left" });
    if (profile?.label) {
      doc.moveDown(0.2);
      doc.fontSize(12).text(`Profile: ${profile.label}`);
    }
    doc.moveDown(1);

    doc.fontSize(14).text("Summary", { underline: true }).moveDown(0.4);
    doc.fontSize(11).text(profile?.summary || "No summary available.");
    doc.moveDown(0.8);

    doc.fontSize(14).text("Trait Scores & Balance", { underline: true });
    doc.moveDown(0.4);

    doc.fontSize(11).text(
      `Raw scores — EI: ${traitScores.EI} | SN: ${traitScores.SN} | TF: ${traitScores.TF} | JP: ${traitScores.JP}`
    );
    doc.moveDown(0.3);

    axes.forEach((axis) => {
      doc.fontSize(11).text(
        `${axis.code}: ${axis.firstPercent}% ${axis.firstLetter} / ${axis.secondPercent}% ${axis.secondLetter}`
      );
    });
    doc.moveDown(0.4);

    doc.fontSize(10).text("How to read your numbers:").moveDown(0.2);
    axes.forEach((axis) => {
      doc.fontSize(10).text("• " + buildAxisSummary(axis.code, axis.value));
    });

    // ------------- PAGE 2 -------------
    doc.addPage();

    doc.fontSize(16).text("Premium Deep Dive", { underline: true });
    doc.moveDown(0.6);

    doc.fontSize(11).text(
      profile?.summary ||
        "You bring a specific mix of strengths, blindspots, and patterns to how you work, relate, and make decisions."
    );
    doc.moveDown(0.6);

    doc.fontSize(14).text("Trait Flexibility & Life Events");
    doc.moveDown(0.4);
    doc.fontSize(11).text(
      "Some parts of your wiring are highly flexible and respond to life events; others stay almost the same unless life hits you hard. Here’s your axis ranking from most flexible to most stable:"
    );
    doc.moveDown(0.4);

    flexibilityRanking.forEach((axis, idx) => {
      const line = buildFlexibilityLine(axis, idx);
      doc.fontSize(11).text(line.heading);
      doc.fontSize(10).text(
        `• For you right now, this axis is ${line.flexibility} (${line.axisLabel}).`
      );
      doc.fontSize(10).text(`• Major shifts: ${line.major}`);
      doc.fontSize(10).text(`• Everyday nudges: ${line.minor}`);
      doc.moveDown(0.4);
    });

    doc.moveDown(0.5)
      .fontSize(10)
      .text(
        "The goal isn’t to become a different person. It’s to use what you’ve got on purpose — so your wiring works for you, not against you."
      );

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

// ----------------------------------------------
const PORT = process.env.PORT ? Number(process.env.PORT) : 4242;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
