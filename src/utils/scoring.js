// src/utils/scoring.js
import MBTI_PROFILES from "../data/mbtiProfiles";
import questions from "../data/questions.json";

/**
 * answers: Array<{ id: string, value: 1|2|3|4|5 }>
 * We reconstruct dimension + positiveTrait from questions.json by id.
 */
export function scoreAssessment(answers) {
  const traitScores = {
    EI: 0, // + = E, - = I
    SN: 0, // + = N, - = S
    TF: 0, // + = T, - = F
    JP: 0, // + = J, - = P
  };

  // "Positive" direction letter for each dimension (+ side in traitScores)
  const POSITIVE_LETTER = {
    EI: "E",
    SN: "N",
    TF: "T",
    JP: "J",
  };

  // Build map from question id -> { dimension, positiveTrait }
  const metaById = {};
  const seen = new Set();
  const dupes = [];

  questions.forEach((q) => {
    if (!q || !q.id || !q.dimension) return;

    if (seen.has(q.id)) dupes.push(q.id);
    seen.add(q.id);

    metaById[q.id] = {
      dimension: q.dimension,
      positiveTrait: q.positiveTrait, // may be undefined in old packs (we handle that)
    };
  });

  // Helpful warning (won't break production)
  if (dupes.length && typeof console !== "undefined") {
    console.warn(
      `[RealYou] Duplicate question ids found in questions.json (last one wins):`,
      dupes
    );
  }

  answers.forEach((ans) => {
    const { id, value } = ans;
    const meta = metaById[id];
    if (!meta) return;

    const { dimension, positiveTrait } = meta;
    if (!Object.prototype.hasOwnProperty.call(traitScores, dimension)) return;

    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;

    // 1..5 -> -2..+2
    const delta = numeric - 3;

    // If pack doesn't provide positiveTrait (older files), fall back to old behavior
    // (agree pushes the "+" side).
    if (!positiveTrait) {
      traitScores[dimension] += delta;
      return;
    }

    // If the question’s positiveTrait matches the "+" letter, keep delta sign.
    // Otherwise flip it (agree pushes the negative side).
    const sign = positiveTrait === POSITIVE_LETTER[dimension] ? 1 : -1;
    traitScores[dimension] += sign * delta;
  });

  const mbtiType = inferMbtiType(traitScores);
  const profile = buildProfile(traitScores, mbtiType);

  return {
    mbtiType,
    traitScores,
    profile,
  };
}

function inferMbtiType(traitScores) {
  const { EI, SN, TF, JP } = traitScores;

  const eOrI = EI >= 0 ? "E" : "I";
  const sOrN = SN >= 0 ? "N" : "S";
  const tOrF = TF >= 0 ? "T" : "F";
  const jOrP = JP >= 0 ? "J" : "P";

  return `${eOrI}${sOrN}${tOrF}${jOrP}`;
}

function buildProfile(traitScores, mbtiType) {
  const rawBase = MBTI_PROFILES[mbtiType];

  const fallback = {
    label: "Unknown Type",
    summary: "Your responses are balanced across several traits.",
    coreTraits: [],
    strengths: [],
    blindspots: [],
    idealCareers: [],
    relationshipStyle: "",
    communicationTips: [],
    growthFocus: [],
    friendsPerception: "",
    compatibility: {
      bestTypes: [],
      challengingTypes: [],
    },
  };

  const base = {
    ...fallback,
    ...(rawBase || {}),
    compatibility: {
      ...fallback.compatibility,
      ...(rawBase && rawBase.compatibility ? rawBase.compatibility : {}),
    },
  };

  const positiveExtras = derivePositiveTraits(traitScores);

  return {
    type: mbtiType,
    label: base.label,
    summary: base.summary,
    coreTraits: [...base.coreTraits, ...positiveExtras.coreTraits],
    strengths: [...base.strengths, ...positiveExtras.strengths],
    blindspots: [...base.blindspots, ...positiveExtras.blindspots],
    idealCareers: base.idealCareers,
    relationshipStyle: base.relationshipStyle,
    communicationTips: base.communicationTips,
    growthFocus: base.growthFocus,
    friendsPerception: base.friendsPerception,
    compatibility: base.compatibility,
    rawTraitScores: traitScores,
  };
}

function derivePositiveTraits(traitScores) {
  const extras = {
    coreTraits: [],
    strengths: [],
    blindspots: [],
  };

  const { EI, SN, TF, JP } = traitScores;

  // EI – Extraversion / Introversion
  if (EI >= 3) {
    extras.coreTraits.push("Energized by people and interaction");
    extras.strengths.push("Comfortable networking and connecting groups");
  } else if (EI <= -3) {
    extras.coreTraits.push("Energized by time alone or in small groups");
    extras.strengths.push("Good at deep focus and reflection");
  }

  // SN – Sensing / Intuition
  if (SN >= 3) {
    extras.coreTraits.push("Future-focused and imaginative");
    extras.strengths.push("Sees patterns and possibilities others miss");
  } else if (SN <= -3) {
    extras.coreTraits.push("Grounded in reality and practical details");
    extras.strengths.push("Good at noticing what’s concrete and proven");
  }

  // TF – Thinking / Feeling
  if (TF >= 3) {
    extras.coreTraits.push("Logical and principle-driven");
    extras.strengths.push("Can stay objective during tough decisions");
    extras.blindspots.push("May come off as blunt if stressed");
  } else if (TF <= -3) {
    extras.coreTraits.push("Empathy and harmony matter a lot to you");
    extras.strengths.push("Good at reading emotional tone in a room");
    extras.blindspots.push("May avoid necessary conflict too long");
  }

  // JP – Judging / Perceiving
  if (JP >= 3) {
    extras.coreTraits.push("Likes structure, plans, and clarity");
    extras.strengths.push("Good at organizing and driving closure");
    extras.blindspots.push("May get frustrated with last-minute changes");
  } else if (JP <= -3) {
    extras.coreTraits.push("Flexible, go-with-the-flow approach");
    extras.strengths.push("Adaptable when plans shift suddenly");
    extras.blindspots.push("Can procrastinate or leave things open too long");
  }

  return extras;
}
