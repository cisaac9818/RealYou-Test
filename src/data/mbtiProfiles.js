// src/data/mbtiProfiles.js

const MBTI_PROFILES = {
  // ----------------- EXTROVERTED NFs -----------------

  ENFJ: {
    label: "The Guiding Mentor",
    summary:
      "Warm, persuasive, and people-focused. You naturally step into leadership when it serves the group.",
    coreTraits: [
      "Big-picture and people-oriented",
      "Comfortable leading and inspiring others",
      "Thinks about long-term impact"
    ],
    strengths: [
      "Motivating others",
      "Building strong relationships",
      "Seeing potential in people"
    ],
    blindspots: [
      "Can overextend yourself helping others",
      "May take things personally when people disengage",
      "Might avoid your own needs until you burn out"
    ],
    idealCareers: [
      "Team lead or manager",
      "Coach, mentor, or counselor",
      "HR, teaching, or community organizer"
    ],
    relationshipStyle:
      "You invest deeply in your relationships and want mutual growth, loyalty, and honest communication.",
    communicationTips: [
      "Say what you need directly instead of expecting others to read between the lines.",
      "Leave space for quieter voices to contribute.",
      "Ask clear questions instead of hinting when something matters."
    ],
    growthFocus: [
      "Set realistic boundaries around your time and energy.",
      "Practice saying no without over-explaining.",
      "Let others struggle a little so they can grow too."
    ],
    friendsPerception:
      "People often see you as the dependable one—the person they call for advice, encouragement, and clarity.",
    compatibility: {
      bestTypes: ["INFP", "INFJ", "ISFP"],
      challengingTypes: ["ISTP", "INTP"]
    }
  },

  ENFP: {
    label: "The Energized Connector",
    summary:
      "Curious, expressive, and imaginative. You thrive on new ideas, people, and possibilities.",
    coreTraits: [
      "Energized by social interaction and new experiences",
      "Values authenticity and emotional honesty",
      "Thinks in possibilities rather than rigid plans"
    ],
    strengths: [
      "Brainstorming creative solutions",
      "Making others feel seen and included",
      "Adapting quickly to change"
    ],
    blindspots: [
      "Can struggle with follow-through on long projects",
      "May avoid conflict to keep the vibe positive",
      "Easily bored by routine or micromanagement"
    ],
    idealCareers: [
      "Creative director or marketer",
      "Counselor, coach, or facilitator",
      "Entrepreneur or content creator"
    ],
    relationshipStyle:
      "You want relationships that feel alive, emotionally real, and constantly evolving—not stuck on autopilot.",
    communicationTips: [
      "Be specific when making commitments or promises.",
      "Pause before responding when you’re emotionally charged.",
      "Ask others what they need instead of assuming."
    ],
    growthFocus: [
      "Build simple systems to help you follow through.",
      "Learn to sit with discomfort instead of escaping it.",
      "Finish more than you start—even small things."
    ],
    friendsPerception:
      "People see you as fun, uplifting, and emotionally in tune—the friend who brings energy into the room.",
    compatibility: {
      bestTypes: ["INFJ", "INTJ", "ISFJ"],
      challengingTypes: ["ISTJ", "ESTJ"]
    }
  },

  // ----------------- INTROVERTED NFs -----------------

  INFJ: {
    label: "The Insightful Strategist",
    summary:
      "Quiet but intense. You read patterns in people and situations and think in long arcs.",
    coreTraits: [
      "Values depth over small talk",
      "Thinks far into the future",
      "Strong internal moral compass"
    ],
    strengths: [
      "Spotting long-term patterns",
      "Empathizing deeply with others",
      "Planning for meaningful impact"
    ],
    blindspots: [
      "Can overanalyze before acting",
      "May withdraw when overwhelmed instead of communicating",
      "Can be perfectionistic about ideals and plans"
    ],
    idealCareers: [
      "Therapist or counselor",
      "Writer, strategist, or analyst",
      "Mission-driven or nonprofit roles"
    ],
    relationshipStyle:
      "You want emotionally safe, loyal, long-term relationships with shared meaning and purpose.",
    communicationTips: [
      "Say what you feel directly instead of hinting.",
      "Share your thought process so others aren’t guessing.",
      "Ask for reassurance instead of silently pulling away."
    ],
    growthFocus: [
      "Act sooner on ideas instead of waiting for perfect clarity.",
      "Accept that conflict can strengthen relationships.",
      "Balance idealism with workable, concrete steps."
    ],
    friendsPerception:
      "People see you as wise, thoughtful, and reliable—even if they don’t always know what’s going on inside.",
    compatibility: {
      bestTypes: ["ENFP", "ENFJ", "INFP"],
      challengingTypes: ["ESTP", "ENTP"]
    }
  },

  INFP: {
    label: "The Inner Idealist",
    summary:
      "Values-driven, imaginative, and deeply personal. You care about staying true to yourself above all.",
    coreTraits: [
      "Guided by personal values and meaning",
      "Rich inner world of ideas and feelings",
      "Prefers authentic, one-on-one connections"
    ],
    strengths: [
      "Loyalty to people and causes you care about",
      "Creative problem-solving, especially for people issues",
      "Empathy and emotional insight"
    ],
    blindspots: [
      "Can avoid hard decisions to keep options open",
      "May take criticism very personally",
      "Sometimes struggles to translate ideals into action"
    ],
    idealCareers: [
      "Writer, artist, or designer",
      "Counselor or coach",
      "Nonprofit or cause-driven work"
    ],
    relationshipStyle:
      "You look for deep emotional connection, shared values, and room to be fully yourself.",
    communicationTips: [
      "Say what you need instead of hoping others just notice.",
      "Share boundaries early instead of disappearing when overwhelmed.",
      "Remember that disagreement doesn’t equal rejection."
    ],
    growthFocus: [
      "Turn big ideals into small, consistent actions.",
      "Practice receiving feedback without losing your sense of self.",
      "Let yourself be seen, even when you feel messy or imperfect."
    ],
    friendsPerception:
      "People see you as gentle, thoughtful, and sincere—someone who cares about what really matters.",
    compatibility: {
      bestTypes: ["ENFJ", "INFJ", "ENTJ"],
      challengingTypes: ["ESTJ", "ESFJ"]
    }
  },

  // ----------------- EXTROVERTED NTs -----------------

  ENTJ: {
    label: "The Commander",
    summary:
      "Decisive, strategic, and organized. You like to take charge, set direction, and get results.",
    coreTraits: [
      "Goal-oriented and driven",
      "Comfortable making tough calls",
      "Thinks in systems and long-term plans"
    ],
    strengths: [
      "Seeing the big picture and building a roadmap",
      "Pushing projects across the finish line",
      "Challenging people to grow and perform"
    ],
    blindspots: [
      "Can come across as harsh or impatient",
      "May prioritize efficiency over emotional nuance",
      "Can push too hard when others need support first"
    ],
    idealCareers: [
      "Executive or founder",
      "Operations or strategy leader",
      "Consultant, lawyer, or project director"
    ],
    relationshipStyle:
      "You value loyalty, competence, and mutual respect—and you appreciate partners who can hold their own.",
    communicationTips: [
      "Pair direct feedback with clear appreciation.",
      "Ask questions before jumping to solutions.",
      "Slow down and check how people feel, not just what they think."
    ],
    growthFocus: [
      "Practice patience with different work styles.",
      "Build in rest so you don’t burn out from constant pushing.",
      "Treat emotional needs as real data, not distractions."
    ],
    friendsPerception:
      "People see you as powerful, confident, and capable—the one who makes big things happen.",
    compatibility: {
      bestTypes: ["INTP", "INFP", "ENTP"],
      challengingTypes: ["ISFP", "ESFP"]
    }
  },

  ENTP: {
    label: "The Challenger",
    summary:
      "Quick, curious, and mentally agile. You love debating ideas, flipping assumptions, and testing possibilities.",
    coreTraits: [
      "Enjoys arguing ideas for fun, not conflict",
      "Energized by change, complexity, and novelty",
      "Thinks in patterns and “what if” scenarios"
    ],
    strengths: [
      "Seeing multiple angles to a problem",
      "Generating unconventional solutions",
      "Challenging stagnant thinking and systems"
    ],
    blindspots: [
      "Can dismiss emotions as “irrational”",
      "May jump to the next idea before finishing the last",
      "Sometimes argues just to win, not to understand"
    ],
    idealCareers: [
      "Entrepreneur or startup builder",
      "Consultant, strategist, or product designer",
      "Law, debate-heavy roles, or innovation work"
    ],
    relationshipStyle:
      "You enjoy mentally stimulating relationships where ideas and banter flow freely.",
    communicationTips: [
      "Make space for people who process slowly or quietly.",
      "Clarify when you’re playing devil’s advocate versus stating your own view.",
      "Remember that not every disagreement needs to be a full debate."
    ],
    growthFocus: [
      "Commit to finishing at least some of what you start.",
      "Practice listening past the first answer.",
      "Respect emotional needs even when they don’t “make sense” logically."
    ],
    friendsPerception:
      "People see you as sharp, witty, and a bit provocative—the one who keeps conversations interesting.",
    compatibility: {
      bestTypes: ["INFJ", "INTJ", "INFP"],
      challengingTypes: ["ISFJ", "ESFJ"]
    }
  },

  // ----------------- INTROVERTED NTs -----------------

  INTJ: {
    label: "The Architect",
    summary:
      "Strategic, independent, and future-oriented. You like systems that work and plans that scale.",
    coreTraits: [
      "Thinks in long-term strategies",
      "Prefers logic over emotional noise",
      "Values competence and efficiency"
    ],
    strengths: [
      "Planning and executing complex ideas",
      "Spotting weak points in systems",
      "Staying calm in chaos"
    ],
    blindspots: [
      "Can come off as distant or overly critical",
      "May underestimate emotional needs—your own and others’",
      "Sometimes holds back praise because “it’s just expected”"
    ],
    idealCareers: [
      "Systems architect or engineer",
      "Founder, strategist, or product lead",
      "Data, finance, or operations roles"
    ],
    relationshipStyle:
      "You value loyalty, intelligence, and mutual respect more than constant emotional display.",
    communicationTips: [
      "Share appreciation out loud, not just in your head.",
      "Explain your logic without dismissing other viewpoints.",
      "Practice patience when others process more slowly."
    ],
    growthFocus: [
      "Invest time into emotional literacy, not just logic.",
      "Be open to revising plans when real life intervenes.",
      "Let people in earlier instead of silently testing them."
    ],
    friendsPerception:
      "People often see you as sharp, focused, and internally driven—the person with a plan and a backup plan.",
    compatibility: {
      bestTypes: ["ENFP", "ENTP", "INFJ"],
      challengingTypes: ["ESFP", "ESFJ"]
    }
  },

  INTP: {
    label: "The Analyst",
    summary:
      "Independent, analytical, and curious. You like taking ideas apart to understand how they work.",
    coreTraits: [
      "Seeks logical consistency and clarity",
      "Enjoys exploring theories and models",
      "Prefers autonomy and mental space"
    ],
    strengths: [
      "Objective problem-solving",
      "Explaining complex things in simple terms (when you want to)",
      "Spotting inconsistencies or weak logic"
    ],
    blindspots: [
      "Can get stuck in analysis instead of taking action",
      "May appear detached or uninterested emotionally",
      "Sometimes forgets to communicate progress to others"
    ],
    idealCareers: [
      "Developer, engineer, or data scientist",
      "Researcher or systems designer",
      "Any role with deep thinking and low micromanagement"
    ],
    relationshipStyle:
      "You prefer mentally stimulating relationships with lots of space and low drama.",
    communicationTips: [
      "Share what you’re thinking instead of assuming others “don’t care.”",
      "Acknowledge feelings even when you don’t fully understand them.",
      "Let people know you value them, not just their ideas."
    ],
    growthFocus: [
      "Ship imperfect work instead of endlessly tweaking.",
      "Practice small, consistent actions instead of huge “perfect” ones.",
      "Stay present in conversations instead of disappearing into your head."
    ],
    friendsPerception:
      "People see you as smart, quirky, and thoughtful—someone who notices details others overlook.",
    compatibility: {
      bestTypes: ["ENTJ", "ENFJ", "INFJ"],
      challengingTypes: ["ISFP", "ESFP"]
    }
  },

  // ----------------- EXTROVERTED SFs -----------------

  ESFJ: {
    label: "The Supportive Organizer",
    summary:
      "Warm, responsible, and relationship-focused. You like things to be orderly and people to feel cared for.",
    coreTraits: [
      "Values harmony and stability",
      "Tuned in to others’ practical needs",
      "Prefers clear expectations and routines"
    ],
    strengths: [
      "Creating a welcoming, predictable environment",
      "Following through on commitments",
      "Picking up on social dynamics and tension"
    ],
    blindspots: [
      "Can worry too much about what others think",
      "May resist change if it disrupts stability",
      "Sometimes avoids difficult conversations to keep the peace"
    ],
    idealCareers: [
      "Teacher or trainer",
      "Nurse or caregiver",
      "Customer success, HR, or admin leadership"
    ],
    relationshipStyle:
      "You show love through consistency, acts of service, and being there when people need you.",
    communicationTips: [
      "Share your own needs instead of only caring for everyone else.",
      "Allow disagreements without assuming the relationship is broken.",
      "Give yourself permission to say no."
    ],
    growthFocus: [
      "Loosen rigid expectations to make room for growth.",
      "Accept that not everyone will appreciate your effort immediately.",
      "Explore your own independent interests, not just others’ needs."
    ],
    friendsPerception:
      "People see you as dependable, social, and caring—the glue that holds groups together.",
    compatibility: {
      bestTypes: ["ISFP", "INFP", "ESFP"],
      challengingTypes: ["INTP", "ENTP"]
    }
  },

  ESFP: {
    label: "The Performer",
    summary:
      "Spontaneous, energetic, and people-oriented. You like experiences that feel alive and in the moment.",
    coreTraits: [
      "Loves fun, stimulation, and variety",
      "Reads the room and adjusts quickly",
      "Prefers action over lengthy planning"
    ],
    strengths: [
      "Bringing energy and enthusiasm to groups",
      "Helping others relax and enjoy themselves",
      "Reacting quickly in real-time situations"
    ],
    blindspots: [
      "Can avoid long-term planning and hard conversations",
      "May overspend energy, time, or money chasing experiences",
      "Sometimes downplays problems until they’re urgent"
    ],
    idealCareers: [
      "Performer, host, or entertainer",
      "Sales, events, or hospitality",
      "Emergency response or hands-on service roles"
    ],
    relationshipStyle:
      "You enjoy relationships that feel fun, physically present, and not overly controlled.",
    communicationTips: [
      "Talk about future plans, not just the present moment.",
      "Share worries early instead of waiting for a blow-up.",
      "Listen fully before reacting or joking things away."
    ],
    growthFocus: [
      "Build simple routines to support long-term goals.",
      "Balance play with saving money, time, and energy.",
      "Let people know when you’re struggling, not just when you’re fine."
    ],
    friendsPerception:
      "People see you as fun, warm, and engaging—the spark that keeps things from feeling dull.",
    compatibility: {
      bestTypes: ["ISFJ", "ISTJ", "ESFJ"],
      challengingTypes: ["INTJ", "ENTJ"]
    }
  },

  // ----------------- INTROVERTED SFs -----------------

  ISFJ: {
    label: "The Quiet Protector",
    summary:
      "Steady, observant, and thoughtful. You like to create security for yourself and the people you care about.",
    coreTraits: [
      "Values duty, loyalty, and responsibility",
      "Notices details others miss",
      "Prefers familiarity over constant novelty"
    ],
    strengths: [
      "Following through even when it’s not glamorous",
      "Remembering personal details about people",
      "Creating stability at home and work"
    ],
    blindspots: [
      "Can ignore your own needs to take care of others",
      "May resist change even when it’s healthy",
      "Sometimes avoids speaking up until resentment builds"
    ],
    idealCareers: [
      "Healthcare, nursing, or caregiving",
      "Administrative, support, or operations roles",
      "Teaching, librarianship, or archival work"
    ],
    relationshipStyle:
      "You show love through reliability, service, and remembering the small things about people.",
    communicationTips: [
      "Speak up about problems early instead of quietly absorbing them.",
      "Let people know your limits so they don’t overload you.",
      "Recognize that your feelings and preferences matter too."
    ],
    growthFocus: [
      "Experiment with small, safe changes.",
      "Delegate instead of taking everything on yourself.",
      "Share your inner world with people you trust."
    ],
    friendsPerception:
      "People see you as kind, reliable, and grounded—the one who always shows up.",
    compatibility: {
      bestTypes: ["ESFP", "ENFP", "ISFP"],
      challengingTypes: ["ENTP", "INTP"]
    }
  },

  ISFP: {
    label: "The Gentle Creator",
    summary:
      "Quiet, sensitive, and aesthetic. You’re drawn to experiences that feel authentic and emotionally real.",
    coreTraits: [
      "Values freedom and personal expression",
      "Strong sense of what feels right or wrong for you",
      "Prefers low-drama, low-pressure environments"
    ],
    strengths: [
      "Bringing warmth and calm to tense situations",
      "Expressing feelings through art, style, or music",
      "Being present-focused and grounded"
    ],
    blindspots: [
      "Can avoid planning until deadlines are close",
      "May withdraw instead of confronting issues",
      "Sometimes struggles to explain your inner world verbally"
    ],
    idealCareers: [
      "Artist, musician, or designer",
      "Hands-on helping roles (health, animal care, etc.)",
      "Craft, trades, or nature-related work"
    ],
    relationshipStyle:
      "You prefer gentle, accepting relationships where you’re not rushed or pressured to perform.",
    communicationTips: [
      "Share feelings before they build up.",
      "Let others know when you need space instead of just disappearing.",
      "Ask for what you want instead of hoping people guess."
    ],
    growthFocus: [
      "Build light structure so your creativity has room to shine.",
      "Practice honest conversations even when they feel uncomfortable.",
      "Take small risks to share your work and voice."
    ],
    friendsPerception:
      "People see you as kind, easygoing, and artistic—someone who brings softness into hard spaces.",
    compatibility: {
      bestTypes: ["ESFJ", "ISFJ", "ENFJ"],
      challengingTypes: ["ENTJ", "INTJ"]
    }
  },

  // ----------------- EXTROVERTED STs -----------------

  ESTJ: {
    label: "The Supervisor",
    summary:
      "Practical, organized, and direct. You like clear rules, defined roles, and measurable results.",
    coreTraits: [
      "Values structure and accountability",
      "Speaks plainly and expects the same",
      "Prefers proven methods over untested theories"
    ],
    strengths: [
      "Keeping teams and systems on track",
      "Making decisions efficiently",
      "Handling logistics and details others avoid"
    ],
    blindspots: [
      "Can come across as controlling or rigid",
      "May undervalue emotional nuance",
      "Sometimes pushes your way as “the only right way”"
    ],
    idealCareers: [
      "Manager or operations lead",
      "Project management or logistics",
      "Law enforcement, military, or compliance roles"
    ],
    relationshipStyle:
      "You show love by being dependable, taking responsibility, and solving practical problems.",
    communicationTips: [
      "Ask for input before finalizing decisions that affect others.",
      "Pair criticism with genuine appreciation.",
      "Recognize that soft-spoken people may still have strong opinions."
    ],
    growthFocus: [
      "Be open to different—but still valid—ways of doing things.",
      "Make room for rest, not just productivity.",
      "Invite feedback on your leadership style and actually use it."
    ],
    friendsPerception:
      "People see you as strong, straightforward, and reliable—the one who gets things done.",
    compatibility: {
      bestTypes: ["ISFP", "ISTP", "ESFP"],
      challengingTypes: ["INFP", "ENFP"]
    }
  },

  ESTP: {
    label: "The Tactical Realist",
    summary:
      "Bold, observant, and action-oriented. You thrive in high-energy, hands-on situations.",
    coreTraits: [
      "Prefers action over talk",
      "Good at reading real-time cues",
      "Comfortable taking calculated risks"
    ],
    strengths: [
      "Staying calm and effective under pressure",
      "Reacting quickly to new information",
      "Cutting through fluff to what’s real"
    ],
    blindspots: [
      "Can be impulsive or thrill-seeking",
      "May ignore long-term consequences in the moment",
      "Sometimes dismisses emotions as overreactions"
    ],
    idealCareers: [
      "Emergency services, law enforcement, or military",
      "Trades, mechanics, or technical troubleshooting",
      "Sales, negotiations, or entrepreneurial roles"
    ],
    relationshipStyle:
      "You like relationships that feel active, real, and not weighed down by drama or overthinking.",
    communicationTips: [
      "Slow down long enough to hear the full story.",
      "Acknowledge feelings even if they don’t seem logical to you.",
      "Talk about long-term impacts, not just today."
    ],
    growthFocus: [
      "Practice pausing before big decisions.",
      "Balance risk with sustainable routines.",
      "Let people know when you do care, not just when you’re annoyed."
    ],
    friendsPerception:
      "People see you as bold, fun, and resourceful—the person they call in a crisis.",
    compatibility: {
      bestTypes: ["ISFJ", "ISTJ", "ESFJ"],
      challengingTypes: ["INFJ", "INFP"]
    }
  },

  // ----------------- INTROVERTED STs -----------------

  ISTJ: {
    label: "The Responsible Realist",
    summary:
      "Reliable, thorough, and detail-focused. You prefer clear expectations and proven processes.",
    coreTraits: [
      "Values duty, stability, and structure",
      "Prefers facts over speculation",
      "Likes to know what’s expected in advance"
    ],
    strengths: [
      "Following through on commitments",
      "Catching errors and inconsistencies",
      "Creating order in chaotic environments"
    ],
    blindspots: [
      "Can be slow to trust new methods or ideas",
      "May come off as rigid or pessimistic",
      "Sometimes keeps feelings to yourself until they leak out indirectly"
    ],
    idealCareers: [
      "Accounting, finance, or auditing",
      "Engineering, quality control, or logistics",
      "Administrative or governmental roles"
    ],
    relationshipStyle:
      "You express care through consistency, responsibility, and doing what you say you’ll do.",
    communicationTips: [
      "Share feelings and preferences, not just facts.",
      "Allow for flexibility when it won’t break anything important.",
      "Let people know you appreciate them explicitly."
    ],
    growthFocus: [
      "Experiment with small changes to build adaptability.",
      "Recognize that others may prioritize connection over efficiency.",
      "Practice saying what you want, not just what’s practical."
    ],
    friendsPerception:
      "People see you as steady, grounded, and trustworthy—the one they can count on.",
    compatibility: {
      bestTypes: ["ESFP", "ENFP", "ESFJ"],
      challengingTypes: ["ENTP", "ENFJ"]
    }
  },

  ISTP: {
    label: "The Practical Problem-Solver",
    summary:
      "Calm, independent, and hands-on. You like understanding how things work and fixing what’s broken.",
    coreTraits: [
      "Prefers autonomy and space",
      "Learns by doing, not by theory alone",
      "Cool-headed in crises"
    ],
    strengths: [
      "Troubleshooting problems quickly",
      "Staying composed under pressure",
      "Adjusting to new information on the fly"
    ],
    blindspots: [
      "Can seem emotionally distant or disinterested",
      "May delay decisions until the last possible moment",
      "Sometimes avoids long-term commitments or obligations"
    ],
    idealCareers: [
      "Mechanic, technician, or engineer",
      "Emergency response, pilot, or tactical roles",
      "Any job with practical challenges and minimal micromanagement"
    ],
    relationshipStyle:
      "You prefer low-drama relationships with lots of mutual freedom and respect.",
    communicationTips: [
      "Tell people you care, not just show it through actions.",
      "Share what’s going on in your head occasionally.",
      "Address conflicts directly instead of disappearing."
    ],
    growthFocus: [
      "Plan ahead just enough to support your freedom.",
      "Practice committing to a few key people or projects.",
      "Let others help instead of assuming you must handle everything alone."
    ],
    friendsPerception:
      "People see you as chill, capable, and resourceful—the one who can fix things when they break.",
    compatibility: {
      bestTypes: ["ESTJ", "ESFJ", "ISFJ"],
      challengingTypes: ["ENFJ", "INFJ"]
    }
  }
};

export default MBTI_PROFILES;
