export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    tagline: "Basic personality breakdown",
    description:
      "Great for users who just want to see their core personality type and a short explanation.",
    features: [
      "Full personality type result",
      "Short personality description",
      "Basic strengths & blind spots",
      "Limited partner compatibility preview",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    priceMonthly: 6.99,
    tagline: "Deeper clarity on you + your matches",
    description:
      "Adds compatibility scoring so users can see how they line up with different personality types.",
    recommended: true,
    badgeLabel: "Most Popular",
    features: [
      "Everything in Free",
      "Compatibility score by type",
      "Top 3 best-fit partner types",
      "High-level communication tips",
      "Unlocks more partner profiles",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 14.99,
    tagline: "Full compatibility intelligence unlocked",
    description:
      "For serious users who want detailed insights, red flags, and exportable reports.",
    badgeLabel: "For Power Users",
    features: [
      "Everything in Standard",
      "Detailed red flag / green flag breakdown",
      "Emotional & conflict patterns",
      "Downloadable PDF report",
      "Unlimited partner comparisons",
    ],
  },
];
