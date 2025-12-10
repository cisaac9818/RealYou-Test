// src/Components/PricingSection.jsx
import React from "react";
import { pricingPlans } from "../config/pricing";
import PricingTierCard from "./PricingTierCard";

export default function PricingSection({ plan, onUpgradeClick, onPlanChosen }) {
  const currentTier = plan;

  function handleClick(tierId) {
    // Tell App a plan was chosen (free OR paid)
    if (onPlanChosen) {
      onPlanChosen(tierId);
    }

    // Paid tiers trigger Stripe checkout
    if (tierId === "standard" || tierId === "premium") {
      if (onUpgradeClick) {
        onUpgradeClick(tierId);
      }
    }
  }

  return (
    <section className="pricing-section">
      <header className="pricing-section__header">
        <p className="pricing-section__eyebrow">RealYou Test™ Plans</p>
        <h2 className="pricing-section__title">Choose your depth of insight</h2>
        <p className="pricing-section__subtitle">
          Start with a free snapshot, then unlock deeper RealYou insights,
          coaching, and a downloadable report.
        </p>
        <p className="pricing-section__current-plan">
          Current plan:{" "}
          <strong>
            {currentTier ? currentTier.toUpperCase() : "FREE (REALYOU STARTER)"}
          </strong>
        </p>
      </header>

      <div className="pricing-section__grid">
        {pricingPlans.map((planItem) => {
          const isCurrent = planItem.id === currentTier;

          return (
            <PricingTierCard
              key={planItem.id}
              plan={planItem}
              isCurrent={isCurrent}
              onClick={() => handleClick(planItem.id)}
            />
          );
        })}
      </div>

      <p className="pricing-section__disclaimer">
        Upgrade or downgrade anytime. Your RealYou type stays the same — you’re
        just choosing how deep you want to go.
      </p>
    </section>
  );
}
