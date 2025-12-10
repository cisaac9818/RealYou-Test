// src/utils/pdfReport.js
import { jsPDF } from "jspdf";
import realYouLogo from "../assets/realyou-logo.png";

function normalizeToArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : String(v).trim()))
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((v) => (typeof v === "string" ? v.trim() : String(v).trim()))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|•|-/)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
}

export function downloadPersonalityPdf({ tier, result, profile }) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;
  const maxWidth = pageWidth - marginX * 2;
  const lineHeight = 7;

  let y = 20;

  const ensureSpace = () => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const addLine = (text = "", { bold = false } = {}) => {
    if (!text) {
      y += lineHeight;
      return;
    }

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line) => {
      ensureSpace();
      doc.text(line, marginX, y);
      y += lineHeight;
    });
  };

  const addSectionTitle = (text) => {
    y += 3;
    ensureSpace();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      ensureSpace();
      doc.text(line, marginX, y);
      y += lineHeight;
    });
    y += 2;
  };

  const writeBullets = (title, items) => {
    const list = normalizeToArray(items);
    if (!list.length) return;
    addSectionTitle(title);
    list.forEach((item) => addLine(`• ${item}`));
    y += 2;
  };

  // 🔹 Logo at the top
  try {
    const logoWidth = 26;
    const logoHeight = 26;
    const logoX = marginX;
    const logoY = 10;
    doc.addImage(realYouLogo, "PNG", logoX, logoY, logoWidth, logoHeight);
    y = logoY + logoHeight + 10;
  } catch (err) {
    y = 20;
  }

  const planLabel =
    tier === "premium"
      ? "Premium"
      : tier === "standard"
      ? "Standard"
      : "Free (Starter)";

  const today = new Date().toLocaleDateString();

  const typeCode =
    (profile &&
      (profile.typeCode || profile.code || profile.type)) ||
    result.mbtiType ||
    result.typeCode ||
    "Profile";

  const typeName =
    (profile &&
      (profile.typeName || profile.label || profile.personalityName)) ||
    result.personalityName ||
    result.typeName ||
    "Your Personality Type";

  // Pre-normalized arrays we’ll re-use
  const strengthsArr = normalizeToArray(profile?.strengths);
  const blindspotsArr = normalizeToArray(
    profile?.blindspots || profile?.blindSpots
  );
  const commTipsArr = normalizeToArray(profile?.communicationTips);
  const growthArr = normalizeToArray(
    profile?.growthFocus || profile?.growthAreas || result.growthFocus
  );
  const careersArr = normalizeToArray(profile?.idealCareers);

  const bestTypes =
    profile?.compatibility?.bestTypes?.length
      ? profile.compatibility.bestTypes.join(", ")
      : "a mix of types who respect your wiring";

  const challengingTypes =
    profile?.compatibility?.challengingTypes?.length
      ? profile.compatibility.challengingTypes.join(", ")
      : "types whose stress style clashes with yours";

  // 🔹 HEADER
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const title = "RealYou Personality Snapshot";
  ensureSpace();
  doc.text(title, marginX, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  addLine(`Plan: ${planLabel}`);
  addLine(`Generated: ${today}`);
  addLine(`Type: ${typeName} (${typeCode})`);
  addLine("");

  // 🔹 OVERVIEW
  addSectionTitle("Overview");
  const summaryText =
    (profile &&
      (profile.summary || profile.description || profile.overview)) ||
    result.summary ||
    result.overview ||
    "";
  if (summaryText) {
    addLine(summaryText);
  } else {
    addLine(
      "This snapshot reflects your dominant patterns in how you think, feel, make decisions, and relate to people."
    );
  }
  y += 2;

  // 🔹 CORE PREFERENCE AXES
  if (result && result.traits) {
    addSectionTitle("Core Preference Axes");
    Object.entries(result.traits).forEach(([axisCode, axis]) => {
      const label = axis.label || axisCode;
      const first =
        axis.firstLabel ||
        axis.first ||
        axis.firstLetter ||
        "Side 1";
      const second =
        axis.secondLabel ||
        axis.second ||
        axis.secondLetter ||
        "Side 2";

      addLine(`${label}: ${first} vs ${second}`);
    });
    y += 2;
  } else if (result && result.traitScores) {
    addSectionTitle("Core Preference Axes (Scores)");

    const axisInfo = {
      EI: {
        label: "Extraversion vs Introversion",
        first: "Extraversion",
        second: "Introversion",
      },
      SN: {
        label: "Sensing vs Intuition",
        first: "Sensing",
        second: "Intuition",
      },
      TF: {
        label: "Thinking vs Feeling",
        first: "Thinking",
        second: "Feeling",
      },
      JP: {
        label: "Judging vs Perceiving",
        first: "Judging",
        second: "Perceiving",
      },
    };

    Object.entries(result.traitScores).forEach(([axisCode, score]) => {
      const info = axisInfo[axisCode] || {
        label: axisCode,
        first: "Side 1",
        second: "Side 2",
      };

      const direction = score >= 0 ? info.first : info.second;
      const strength = Math.abs(score);

      addLine(
        `${info.label}: leans ${direction} (score ${score}, strength ${strength})`
      );
    });
    y += 2;
  }

  // 🔹 KEY STRENGTHS / BLIND SPOTS / MATCHES
  writeBullets(
    "Key Strengths",
    strengthsArr.length ? strengthsArr : result.strengths
  );

  writeBullets(
    "Blind Spots",
    blindspotsArr.length
      ? blindspotsArr
      : result.blindSpots || result.blindspots || result.challenges
  );

  const topMatches =
    (profile && profile.topMatches) || result.topMatches || null;

  if (Array.isArray(topMatches) && topMatches.length > 0) {
    addSectionTitle("Top Compatibility Matches");
    topMatches.forEach((m) => {
      if (m && typeof m === "object") {
        const t = m.type || m.label || "Match";
        const score =
          typeof m.score === "number" ? `${m.score}%` : m.score || "";
        const summary = m.summary || m.description || "";
        const line =
          score && summary
            ? `${t} (${score}): ${summary}`
            : score
            ? `${t} (${score})`
            : summary
            ? `${t}: ${summary}`
            : t;
        addLine("• " + line);
      } else {
        addLine("• " + String(m));
      }
    });
    y += 2;
  }

  if (tier !== "free") {
    writeBullets(
      "Growth Focus",
      growthArr.length ? growthArr : result.growthAreas
    );
  }

  // 🔹 RELATIONSHIP STYLE (EXPLICIT SECTION)
  // Matches the "Relationship Style" section in Results.jsx
  if (tier !== "free") {
    const relStyle =
      profile?.relationshipStyle ||
      "Your type has a distinct way of showing up in relationships and the kinds of bonds you build most naturally.";
    addSectionTitle("Relationship Style");
    addLine(relStyle);
    y += 2;
  }

  // 🔹 COMMUNICATION TIPS (EXPLICIT SECTION)
  // Matches the "Communication Tips" list in Results.jsx
  if (tier !== "free") {
    const commList = commTipsArr.length
      ? commTipsArr
      : normalizeToArray(result.communicationTips);

    if (commList.length) {
      writeBullets("Communication Tips", commList);
    }
  }

  // 🔹 PREMIUM DEEP DIVE — Story + Coach
  if (tier === "premium") {
    addSectionTitle("Premium Deep Dive — Story View");

    const summaryLower = summaryText
      ? summaryText.toLowerCase()
      : "move through the world in a focused, intentional way.";

    const firstStrength =
      (strengthsArr[0] && strengthsArr[0].toLowerCase()) ||
      "use your natural way of thinking and deciding";

    const firstBlind =
      (blindspotsArr[0] && blindspotsArr[0].toLowerCase()) ||
      "slip into habits that drain your energy instead of restoring it";

    const relStyle =
      profile?.relationshipStyle ||
      "bring your own mix of loyalty, intensity, and presence";

    const joinedCareers =
      careersArr && careersArr.length
        ? careersArr.join(", ")
        : "";

    addLine(
      `As a ${typeCode}, you naturally move through life as ${typeName}. You're wired to ${summaryLower}.`
    );
    addLine(
      `In work and projects, you tend to thrive when you're allowed to ${firstStrength}, and when the people around you respect your approach instead of trying to box you in.`
    );
    addLine(
      `In relationships, you show up as someone who tends to ${relStyle}. The people who fit you best are often types like ${bestTypes}. More challenging fits can be types like ${challengingTypes}, especially when stress or big decisions are on the table.`
    );
    addLine(
      `When stress hits and you're not at your best, your blind spots can start to run the show. You may notice more of ${firstBlind}. That's your cue to pause, reset, and come back on purpose instead of autopilot.`
    );
    if (joinedCareers) {
      addLine(
        `Career-wise, you often feel most alive in roles like ${joinedCareers}.`
      );
    }
    y += 2;

    addSectionTitle("Premium Deep Dive — Coach View (Straight Talk)");
    addLine(
      "Here are a few straight-talk pointers based on your pattern:"
    );

    const commTip =
      commTipsArr[0] ||
      "Practice saying what you actually feel or need instead of assuming people just know.";
    const growth1 = growthArr[0];
    const growth2 = growthArr[1];

    addLine(
      `• Alignment check: Your best fits are ${bestTypes}. If your day-to-day life doesn't reflect that mix, you're going to feel it as low energy or quiet resentment.`
    );
    addLine(
      `• Tricky dynamics: Pay attention when you're around ${challengingTypes} types under stress. It's easy for both sides to slip into old patterns.`
    );
    addLine(`• Social upgrade: ${commTip}`);
    if (growth1) {
      addLine(`• Growth focus: ${growth1}`);
    }
    if (growth2) {
      addLine(`• Next-level move: ${growth2}`);
    }
    y += 2;
  }

  const filename = `RealYou_Personality_${typeCode}.pdf`;
  doc.save(filename);
}
