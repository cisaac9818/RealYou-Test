import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
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
  if (abs === 0) {
    intensity = "a balanced position";
  } else if (abs <= 2) {
    intensity = "a slight preference";
  } else if (abs <= 5) {
    intensity = "a moderate preference";
  } else {
    intensity = "a strong preference";
  }

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

    const joinedCareers = (profile.idealCareers || []).join(", ");
    const bestTypes = (profile.compatibility?.bestTypes || []).join(", ");
    const challengingTypes = (
      profile.compatibility?.challengingTypes || []
    ).join(", ");
    const friendsPerception =
      profile.friendsPerception ||
      "Someone people watch, even if they don’t always say it out loud.";

    const dominantTrait =
      (profile.coreTraits && profile.coreTraits[0]) || "your strongest traits";
    const secondaryTrait =
      (profile.coreTraits && profile.coreTraits[1]) || "your backup traits";
    const topBlindspot =
      (profile.blindspots && profile.blindspots[0]) ||
      "your most common stress habits";

    const doc = new PDFDocument({ margin: 50 });

    // Buffer the PDF output
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="realyou-personality-report.pdf"',
          "Content-Length": pdfData.length,
        })
        .end(pdfData);
    });

    // ------------- PAGE 1: CORE / FREE + STANDARD INFO -------------

    // Title + plan
    doc
      .fontSize(22)
      .text("RealYou Test – Personality Report", { align: "center" });
    doc.moveDown(0.4);
    doc.fontSize(13).text("Plan: Premium (includes all insights)", {
      align: "center",
    });
    doc.moveDown(1);

    // Type + label
    doc.fontSize(16).text(`Type: ${mbtiType}`, { align: "left" });
    if (profile.label) {
      doc.moveDown(0.2);
      doc.fontSize(12).text(`Profile: ${profile.label}`);
    }
    doc.moveDown(1);

    // Summary
    doc.fontSize(14).text("Summary", { underline: true }).moveDown(0.4);
    doc.fontSize(11).text(profile.summary || "No summary available.");
    doc.moveDown(0.4);

    // Standard-style extra summary
    doc
      .fontSize(10)
      .text(
        `Standard Summary: Your responses show a clear pattern: you lead with ${dominantTrait}, rely on ${secondaryTrait}, and struggle most when ${topBlindspot}. This version of your report helps you understand why these patterns show up — and what to do with them.`
      );
    doc.moveDown(0.8);

    // Trait Scores & Balance
    doc.fontSize(14).text("Trait Scores & Balance", { underline: true });
    doc.moveDown(0.4);

    doc
      .fontSize(11)
      .text(
        `Raw scores — EI: ${traitScores.EI} | SN: ${traitScores.SN} | TF: ${traitScores.TF} | JP: ${traitScores.JP}`
      );
    doc.moveDown(0.3);

    axes.forEach((axis) => {
      doc
        .fontSize(11)
        .text(
          `${axis.code}: ${axis.firstPercent}% ${axis.firstLetter} / ${axis.secondPercent}% ${axis.secondLetter}`
        );
    });
    doc.moveDown(0.4);

    doc.fontSize(10).text("How to read your numbers:").moveDown(0.2);
    axes.forEach((axis) => {
      doc
        .fontSize(10)
        .text("• " + buildAxisSummary(axis.code, axis.value));
    });

    doc.moveDown(0.4);
    doc
      .fontSize(10)
      .text(
        "Standard Insight: Your patterns show where you make your best decisions, but also where you might overplay your strengths. Focus on balancing these traits to unlock your next level."
      );
    doc.moveDown(0.8);

    // Strengths
    doc.fontSize(14).text("Strengths", { underline: true }).moveDown(0.3);
    (profile.strengths || []).forEach((s) =>
      doc.fontSize(11).text(`• ${s}`)
    );
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .text(
        "Standard Insight: Leaning into these strengths is how your type wins at work and in relationships. Overuse any one of them and it can flip into a blindspot."
      )
      .moveDown(0.2)
      .text(
        "Bonus Strength Insight: Your type thrives when people give you trust early. You perform best when you're not micromanaged."
      );
    doc.moveDown(0.8);

    // Blindspots
    doc.fontSize(14).text("Blindspots", { underline: true }).moveDown(0.3);
    (profile.blindspots || []).forEach((b) =>
      doc.fontSize(11).text(`• ${b}`)
    );
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .text(
        "Standard Insight: Blindspots don’t mean flaws. They’re early warning signs that you’re tired, stressed, or overextending yourself."
      );
    doc.moveDown(0.8);

    // Relationship Style
    doc
      .fontSize(14)
      .text("Relationship Style", { underline: true })
      .moveDown(0.3);
    doc
      .fontSize(11)
      .text(
        profile.relationshipStyle ||
          "Your type has a distinct way of showing up in relationships and the kinds of bonds you build most naturally."
      );
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .text(
        "Standard Insight: Here’s the secret to your type’s best relationships — and why people sometimes misunderstand your intentions."
      );
    doc.moveDown(0.8);

    // Communication Tips
    doc
      .fontSize(14)
      .text("Communication Tips", { underline: true })
      .moveDown(0.3);
    (profile.communicationTips || []).forEach((tip) =>
      doc.fontSize(11).text(`• ${tip}`)
    );
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .text(
        "Standard Insight: If you master these communication patterns, you stop arguments before they happen."
      )
      .moveDown(0.2)
      .text(
        "Bonus Communication Insight: You connect deeply when conversations have meaning — not when they stay on the surface."
      );
    doc.moveDown(0.8);

    // Growth Focus
    doc.fontSize(14).text("Growth Focus", { underline: true }).moveDown(0.3);
    (profile.growthFocus || []).forEach((g) =>
      doc.fontSize(11).text(`• ${g}`)
    );
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .text(
        "Standard Insight: Your biggest growth edge is about choosing intention over autopilot."
      );

    // ------------- PAGE 2: PREMIUM DEEP DIVE + COACH + FLEX -------------

    doc.addPage();

    // Premium Deep Dive (short narrative)
    doc.fontSize(16).text("Premium Deep Dive", { underline: true });
    doc.moveDown(0.6);

    doc
      .fontSize(12)
      .text(
        `As a ${mbtiType}, you don’t move through life on default. You move through it as ${profile.label ||
          "a specific pattern of energy, focus, and instinct"}.`
      );
    doc.moveDown(0.3);
    doc
      .fontSize(11)
      .text(
        profile.summary ||
          "You bring a specific mix of strengths, blindspots, and patterns to how you work, relate, and make decisions."
      );
    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(
        `Career & Money: You do your best work in roles like ${
          joinedCareers ||
          "places that actually use your brain instead of treating you like a robot"
        }. If a job keeps you small, bored, or boxed in, your energy drops fast.`
      )
      .moveDown(0.3);

    doc
      .fontSize(11)
      .text(
        `Relationships: You click fastest with types such as ${
          bestTypes || "people who respect your pace and style"
        }. The tougher mix is ${
          challengingTypes ||
          "people who shut down, explode, or demand constant emotional labor when you’re already stretched"
        }.`
      )
      .moveDown(0.3);

    doc
      .fontSize(11)
      .text(
        "Stress & Reset: When you’re not okay, your blindspots don’t whisper — they get loud. The more you see those patterns early, the less you let one bad week turn into a bad season."
      );
    doc.moveDown(0.8);

    // Coach Mode Playbook (three blocks, sharper tone)
    doc.fontSize(14).text("Coach Mode Playbook", { underline: true });
    doc.moveDown(0.4);

    // Career & Money Focus
    doc.fontSize(12).text("Career & Money Focus");
    doc.moveDown(0.2);
    doc
      .fontSize(11)
      .text(
        `• Best environments: Places where your mind is actually needed — not “just clock in, clock out” work. Think roles where your judgment, ideas, or strategy matter every day${
          joinedCareers ? ` (for you, that often looks like: ${joinedCareers}).` : "."
        }`
      );
    doc
      .fontSize(11)
      .text(
        `• Watch out for: Staying loyal to the wrong situation. If a job keeps asking for your time but never uses your real strengths, that’s not dedication — that’s a slow leak on your confidence and your money.`
      );
    doc
      .fontSize(11)
      .text(
        `• Power move: Pick one move this month that stretches you but also respects your wiring — a new project, a skill upgrade, or a conversation about money and role. Don’t wait for “perfect timing”; move when the window opens.`
      );
    doc.moveDown(0.6);

    // Relationships & Social Energy
    doc.fontSize(12).text("Relationships & Social Energy");
    doc.moveDown(0.2);
    doc
      .fontSize(11)
      .text(
        `• How you show up: You don’t do fake. People feel your energy right away — whether that’s calm, intense, playful, or focused. When you’re present, you’re really present, and the room adjusts around you.`
      );
    doc
      .fontSize(11)
      .text(
        `• Best matches: ${
          bestTypes ||
          "People who give you space to be yourself and don’t punish you for how you recharge."
        }`
      );
    doc
      .fontSize(11)
      .text(
        `• Tricky dynamics: ${
          challengingTypes ||
          "People who demand constant access, constant reassurance, or constant drama when you’re already drained."
        }`
      );
    doc
      .fontSize(11)
      .text(
        `• Social upgrade: Don’t assume people “just know” what’s going on with you. Say it once, clearly. The right people lean in when you’re honest; the wrong people fall off — and that’s a win too.`
      );
    doc.moveDown(0.6);

    // Growth & Self-Management
    doc.fontSize(12).text("Growth & Self-Management");
    doc.moveDown(0.2);
    doc
      .fontSize(11)
      .text(
        `• Stress warning sign: ${
          profile.blindspots && profile.blindspots.length
            ? profile.blindspots[0]
            : "You catch yourself reacting fast, overthinking everything, or shutting down instead of choosing your moves."
        }`
      );
    doc
      .fontSize(11)
      .text(
        `• Reset move: ${
          profile.growthFocus && profile.growthFocus.length > 1
            ? profile.growthFocus[1]
            : "Pull back for a short, intentional reset — sleep, water, one clean meal, and one small task finished start to finish. Your brain needs a “win” to get back in gear."
        }`
      );
    doc
      .fontSize(11)
      .text(
        `• How people really see you: ${friendsPerception} Most of the time, you’re harder on yourself than anybody else is.`
      );
    doc.moveDown(0.8);

    // Trait Flexibility & Life Events
    doc.fontSize(14).text("Trait Flexibility & Life Events");
    doc.moveDown(0.4);
    doc
      .fontSize(11)
      .text(
        "Some parts of your wiring are highly flexible and respond to life events; others stay almost the same unless life hits you hard. Here’s your axis ranking from most flexible to most stable:"
      );
    doc.moveDown(0.4);

    flexibilityRanking.forEach((axis, idx) => {
      const line = buildFlexibilityLine(axis, idx);
      doc.fontSize(11).text(line.heading);
      doc
        .fontSize(10)
        .text(
          `• For you right now, this axis is ${line.flexibility} (${line.axisLabel}).`
        );
      doc.fontSize(10).text(`• Major shifts: ${line.major}`);
      doc.fontSize(10).text(`• Everyday nudges: ${line.minor}`);
      doc.moveDown(0.4);
    });

    doc
      .moveDown(0.5)
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
const PORT = 4242;
app.listen(PORT, () => {
  console.log(`Stripe + PDF server running on http://localhost:${PORT}`);
});
