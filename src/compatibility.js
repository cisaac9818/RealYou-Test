// src/compatibility.js

// Basic compatibility map for all 16 types.
// You can tweak any of these lists or texts later for your brand voice.

const COMPATIBILITY_MAP = {
  ENFP: {
    bestMatches: ["INFJ", "INTJ"],
    goodMatches: ["INFP", "ENFJ", "ENTP"],
    challengeMatches: ["ISTJ", "ESTJ"],
    summary:
      "Warm, expressive, and future-focused. You bring energy, ideas, and emotional depth into relationships.",
    romanceScore: 92,
    friendshipScore: 88,
    workScore: 78,
    romanticVibe:
      "You crave emotional connection, shared adventures, and deep conversations that move beyond surface talk.",
    friendshipVibe:
      "You’re the hype friend: encouraging, spontaneous, and always ready to dream big with people you care about.",
    workVibe:
      "You thrive when you’re given freedom, creativity, and a mission that feels meaningful—not just a job.",
    challenges:
      "You can lose interest when routines drag on or when partners shut down emotionally or stay too rigid.",
    growthTips:
      "Ground your ideas in concrete steps, and learn to communicate your need for emotional connection without assuming others just ‘get it’.",
    dateIdeas:
      "Late-night rooftop talks, live music, a spontaneous road trip, or a creative workshop you try together."
  },

  ENFJ: {
    bestMatches: ["INFP", "ISFP"],
    goodMatches: ["INFJ", "ENFP", "ESFJ"],
    challengeMatches: ["ISTP", "INTP"],
    summary:
      "Supportive, expressive, and people-centered. You naturally tune into others’ needs and lift them up.",
    romanceScore: 90,
    friendshipScore: 93,
    workScore: 82,
    romanticVibe:
      "You show love through encouragement, planning meaningful moments, and actively investing in your partner’s growth.",
    friendshipVibe:
      "You’re the connector: you bring people together and remember the details that make them feel seen.",
    workVibe:
      "You lead best when you can coach others, set vision, and maintain harmony while still driving results.",
    challenges:
      "You may over-give, over-function, or take responsibility for other people’s emotions and choices.",
    growthTips:
      "Practice boundaries, allow others to solve their own problems, and remember you don’t have to be ‘on’ all the time.",
    dateIdeas:
      "A thoughtful dinner you plan around their favorites, a charity or community event together, or a shared class you both enjoy."
  },

  INFJ: {
    bestMatches: ["ENFP", "ENTP"],
    goodMatches: ["INFP", "ENFJ"],
    challengeMatches: ["ESTP", "ISTP"],
    summary:
      "Insightful, idealistic, and quietly intense. You look for purpose, depth, and emotional honesty.",
    romanceScore: 91,
    friendshipScore: 84,
    workScore: 80,
    romanticVibe:
      "You want soul-level connection, shared values, and a partner who respects your inner world.",
    friendshipVibe:
      "You’re the deep confidant: people feel safe opening up, and you remember what matters to them.",
    workVibe:
      "You work best when your values align with the mission and you have time to think, plan, and refine.",
    challenges:
      "You may hold back your needs, expect people to read between the lines, or withdraw when overwhelmed.",
    growthTips:
      "Share your thoughts even when they’re not fully polished, and allow conflict as a path to deeper honesty.",
    dateIdeas:
      "Quiet coffee in a cozy spot, a scenic walk, a bookshop date, or planning a future vision together."
  },

  INFP: {
    bestMatches: ["ENFJ", "ENTJ"],
    goodMatches: ["INFJ", "ENFP"],
    challengeMatches: ["ESTJ", "ISTJ"],
    summary:
      "Deeply feeling, values-driven, and imaginative. You seek authenticity and emotional resonance.",
    romanceScore: 89,
    friendshipScore: 86,
    workScore: 72,
    romanticVibe:
      "You long for a partner who understands your emotional world and respects your individuality.",
    friendshipVibe:
      "You’re the loyal inner-circle friend, selectively open but incredibly supportive once someone earns your trust.",
    workVibe:
      "You work best with creative freedom and meaning; strict, cold environments drain you quickly.",
    challenges:
      "You might idealize people, then feel disappointed when real life doesn’t match the inner image.",
    growthTips:
      "Communicate expectations clearly, and allow relationships to be imperfect but real instead of perfect in your head.",
    dateIdeas:
      "Indie films, art shows, intimate concerts, journaling or vision-boarding together, or exploring nature."
  },

  ENTP: {
    bestMatches: ["INFJ", "INTJ"],
    goodMatches: ["ENFP", "INFP", "ENTJ"],
    challengeMatches: ["ISFJ", "ESFJ"],
    summary:
      "Curious, quick-thinking, and playful. You love exploring ideas and challenging assumptions.",
    romanceScore: 87,
    friendshipScore: 90,
    workScore: 85,
    romanticVibe:
      "You bring excitement, mental stimulation, and a sense of possibility into relationships.",
    friendshipVibe:
      "You’re the debate partner and adventure buddy rolled into one—never boring, always scheming the next move.",
    workVibe:
      "You shine when you can innovate, solve complex problems, and avoid repetitive routines.",
    challenges:
      "You may get bored once the chase is over, or unintentionally come off as argumentative or detached.",
    growthTips:
      "Follow through on commitments and signal emotional investment, not just intellectual engagement.",
    dateIdeas:
      "Escape rooms, improv shows, travel, late-night debates over food, or trying something neither of you has done before."
  },

  ENTJ: {
    bestMatches: ["INFP", "ISFP"],
    goodMatches: ["ENTP", "INTP", "ENFJ"],
    challengeMatches: ["ISFJ", "ESFP"],
    summary:
      "Decisive, driven, and strategic. You like efficiency, progress, and clear direction.",
    romanceScore: 84,
    friendshipScore: 80,
    workScore: 95,
    romanticVibe:
      "You show love through action: planning, building, and pushing for growth together.",
    friendshipVibe:
      "You’re the challenger-friend: you push people to level up and rarely sugar-coat the truth.",
    workVibe:
      "You excel in leadership, complex problem-solving, and long-term planning environments.",
    challenges:
      "You may seem too blunt, controlling, or impatient with people who move slowly or lead with emotions.",
    growthTips:
      "Slow down to listen, invite input before deciding, and show appreciation for emotional support—not just tangible results.",
    dateIdeas:
      "Power dates: goal-planning brunch, a trip you organize, or experiences that feel like building something together."
  },

  INTJ: {
    bestMatches: ["ENFP", "ENTP"],
    goodMatches: ["INFJ", "INTP"],
    challengeMatches: ["ESFP", "ENFP (immature)"],
    summary:
      "Strategic, future-focused, and independent. You like systems that work and people who think deeply.",
    romanceScore: 82,
    friendshipScore: 78,
    workScore: 94,
    romanticVibe:
      "You express love through loyalty, long-term planning, and quietly making life run smoother.",
    friendshipVibe:
      "You value a small circle of competent, thoughtful people more than a large crowd.",
    workVibe:
      "You thrive on autonomy, complex ideas, and long-range strategy more than day-to-day handholding.",
    challenges:
      "You may seem distant, overly critical, or uninterested in ‘small’ emotional signals.",
    growthTips:
      "Explain your thought process out loud and practice verbal appreciation—it doesn’t weaken you to say how you feel.",
    dateIdeas:
      "Museum dates, strategy games, planning a long-term trip, or sharing deep documentaries and analysis."
  },

  INTP: {
    bestMatches: ["ENTJ", "ESTJ"],
    goodMatches: ["ENTP", "INTJ", "INFJ"],
    challengeMatches: ["ESFJ", "ENFJ"],
    summary:
      "Analytical, independent, and idea-focused. You live in concepts, patterns, and ‘how things work’.",
    romanceScore: 78,
    friendshipScore: 82,
    workScore: 88,
    romanticVibe:
      "You show care through problem-solving, thoughtful insights, and giving partners mental space.",
    friendshipVibe:
      "You’re the quiet brain in the group—low drama, high curiosity, and very loyal once bonded.",
    workVibe:
      "You fit roles that reward deep analysis, troubleshooting, and innovation over people-pleasing.",
    challenges:
      "You may seem emotionally distant or indecisive, and can forget to share feelings verbally.",
    growthTips:
      "Practice small, frequent emotional check-ins and act on decisions rather than endlessly optimizing them.",
    dateIdeas:
      "Science centers, tech expos, board games, co-op video games, or long talks about how the world works."
  },

  ESFP: {
    bestMatches: ["ISTJ", "ISFJ"],
    goodMatches: ["ESTP", "ENFP", "ESFJ"],
    challengeMatches: ["INTJ", "INFJ"],
    summary:
      "Lively, spontaneous, and fun-loving. You bring energy, warmth, and presence into the moment.",
    romanceScore: 88,
    friendshipScore: 90,
    workScore: 74,
    romanticVibe:
      "You love shared experiences, physical closeness, and partners who enjoy life with you right now.",
    friendshipVibe:
      "You’re the fun friend who keeps everyone laughing and pulls people out of their heads.",
    workVibe:
      "You do well in hands-on, people-facing roles with visible impact and variety.",
    challenges:
      "Long-term planning and serious conversations can feel heavy or restrictive if overdone.",
    growthTips:
      "Balance fun with a few realistic plans, and show you can be present for deeper talks when it really matters.",
    dateIdeas:
      "Live shows, dancing, festivals, amusement parks, or any high-energy shared activity."
  },

  ESTP: {
    bestMatches: ["ISFJ", "ISTJ"],
    goodMatches: ["ESFP", "ENTP"],
    challengeMatches: ["INFJ", "INFP"],
    summary:
      "Action-oriented, adaptable, and bold. You like testing limits and learning by doing.",
    romanceScore: 84,
    friendshipScore: 88,
    workScore: 82,
    romanticVibe:
      "You bring excitement, directness, and physical presence into relationships.",
    friendshipVibe:
      "You’re the ‘let’s just do it’ friend who turns ideas into real experiences.",
    workVibe:
      "You’re strong in crisis, negotiation, and fast-paced environments where thinking on your feet matters.",
    challenges:
      "You might avoid emotional conversations or commitments that feel like they restrict your freedom.",
    growthTips:
      "Practice slowing down to reflect on long-term impact—not just short-term wins.",
    dateIdeas:
      "Sports events, road trips, adventurous activities, or challenges you tackle together."
  },

  ISFP: {
    bestMatches: ["ENFJ", "ESFJ"],
    goodMatches: ["INFP", "ISFJ"],
    challengeMatches: ["ENTJ", "ESTJ"],
    summary:
      "Gentle, present, and values-driven. You prefer authentic, low-drama environments.",
    romanceScore: 86,
    friendshipScore: 80,
    workScore: 70,
    romanticVibe:
      "You show love through small, thoughtful actions and shared peaceful moments.",
    friendshipVibe:
      "You’re the quiet supporter who shows up when it counts and respects people’s space.",
    workVibe:
      "You prefer work that allows creativity, independence, and a calm atmosphere.",
    challenges:
      "Direct confrontation, rigid structures, and pushy personalities can drain you quickly.",
    growthTips:
      "Express your preferences earlier instead of silently adapting until you burn out.",
    dateIdeas:
      "Nature walks, art or photography dates, cozy nights in, or exploring quiet scenic spots."
  },

  ISTP: {
    bestMatches: ["ESFJ", "ESTJ"],
    goodMatches: ["ISTJ", "ISFP"],
    challengeMatches: ["ENFJ", "ESFP"],
    summary:
      "Calm, hands-on, and practical. You like figuring out how things work and having personal space.",
    romanceScore: 80,
    friendshipScore: 78,
    workScore: 86,
    romanticVibe:
      "You show love through fixing things, problem-solving, and being there when needed—even if you don’t say much.",
    friendshipVibe:
      "You’re the unflappable friend: low drama, good in emergencies, and reliable in a crisis.",
    workVibe:
      "You succeed with technical, mechanical, or tactical work that rewards skill and precision.",
    challenges:
      "Emotional intensity or constant social demands can make you shut down or withdraw.",
    growthTips:
      "Share what you’re thinking before people assume you don’t care, and schedule some emotional ‘maintenance’ time.",
    dateIdeas:
      "Go-karts, shooting ranges, DIY projects, engineering exhibits, or any activity with tools or gear."
  },

  ESFJ: {
    bestMatches: ["ISFP", "ISTP"],
    goodMatches: ["ESFP", "ENFJ"],
    challengeMatches: ["INTP", "INTJ"],
    summary:
      "Caring, structured, and community-focused. You want harmony, reliability, and clear expectations.",
    romanceScore: 88,
    friendshipScore: 92,
    workScore: 84,
    romanticVibe:
      "You show love through caretaking, consistency, and planning practical support.",
    friendshipVibe:
      "You’re the organizer-friend who remembers birthdays and keeps people connected.",
    workVibe:
      "You shine in people-facing roles, coordination, and service-oriented environments.",
    challenges:
      "You may take things personally or overextend yourself trying to keep everyone happy.",
    growthTips:
      "Allow others to handle their own emotions sometimes, and set boundaries around how much you give.",
    dateIdeas:
      "Family gatherings, dinners with friends, cooking together, or community events."
  },

  ESTJ: {
    bestMatches: ["ISFJ", "ISTJ"],
    goodMatches: ["ESFJ", "ENTJ"],
    challengeMatches: ["INFP", "ISFP"],
    summary:
      "Organized, direct, and duty-focused. You value responsibility, structure, and clear rules.",
    romanceScore: 82,
    friendshipScore: 80,
    workScore: 96,
    romanticVibe:
      "You show love by providing stability, planning, and taking care of practical needs.",
    friendshipVibe:
      "You’re the ‘rock’ friend, dependable and willing to speak the hard truths.",
    workVibe:
      "You excel at management, logistics, and keeping systems running efficiently.",
    challenges:
      "You might dismiss emotions as ‘illogical’ or push people too hard toward productivity.",
    growthTips:
      "Make room for feelings—even when they slow things down—and practice softening your delivery.",
    dateIdeas:
      "Structured but fun outings: planned trips, traditional dinners, or activities with a clear plan."
  },

  ISFJ: {
    bestMatches: ["ESFP", "ESTP"],
    goodMatches: ["ESFJ", "ISTJ"],
    challengeMatches: ["ENTP", "ENTJ"],
    summary:
      "Quietly supportive, detail-focused, and loyal. You notice what people need before they ask.",
    romanceScore: 86,
    friendshipScore: 88,
    workScore: 84,
    romanticVibe:
      "You express love through service, consistency, and remembering the little things.",
    friendshipVibe:
      "You’re the long-term friend, steady and dependable even when life gets chaotic.",
    workVibe:
      "You do well in roles with clear expectations, routines, and direct impact on people’s well-being.",
    challenges:
      "You may overwork yourself, avoid conflict, or struggle to say no.",
    growthTips:
      "State your limits openly and allow others to support you instead of always being the helper.",
    dateIdeas:
      "Cozy dinners, nostalgic spots, meaningful traditions, or low-key shared hobbies."
  },

  ISTJ: {
    bestMatches: ["ESFP", "ESTP"],
    goodMatches: ["ISFJ", "ESTJ"],
    challengeMatches: ["ENFP", "INFP"],
    summary:
      "Reliable, structured, and thorough. You like facts, routines, and clear expectations.",
    romanceScore: 80,
    friendshipScore: 82,
    workScore: 95,
    romanticVibe:
      "You show love by being steady, practical, and doing what you say you’ll do.",
    friendshipVibe:
      "You’re the consistent friend who shows up on time and follows through.",
    workVibe:
      "You fit structured environments that reward accuracy, responsibility, and long-term commitment.",
    challenges:
      "You might resist change, dismiss new ideas too quickly, or struggle with emotional ambiguity.",
    growthTips:
      "Experiment with small changes and practice asking people about their feelings—not just the facts.",
    dateIdeas:
      "Classic dinners, familiar favorite spots, or revisiting meaningful places together."
  }
};

export function getCompatibilityProfile(typeCode) {
  const fallback = {
    bestMatches: [],
    goodMatches: [],
    challengeMatches: [],
    summary:
      "We don’t have a detailed profile for this type yet, but you show a balanced mix of traits.",
    romanceScore: 75,
    friendshipScore: 75,
    workScore: 75,
    romanticVibe:
      "You bring a blend of stability and curiosity into romantic connections.",
    friendshipVibe:
      "You can adapt to many different people and play multiple roles in a friend group.",
    workVibe:
      "You have the potential to succeed in a range of environments when your strengths are recognized.",
    challenges:
      "Without a tailored profile, your main challenge is understanding how your unique mix plays out with others.",
    growthTips:
      "Notice what drains versus energizes you and choose relationships and work that lean into your natural flow.",
    dateIdeas:
      "Mix structure and spontaneity—have a plan, but leave space for surprises."
  };

  return COMPATIBILITY_MAP[typeCode] || fallback;
}
