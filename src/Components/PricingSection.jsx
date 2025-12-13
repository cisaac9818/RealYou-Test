// src/Components/PricingSection.jsx
import React, { useMemo } from "react";
import { pricingPlans } from "../config/pricing";
import PricingTierCard from "./PricingTierCard";

export default function PricingSection({ plan, onUpgradeClick, onPlanChosen }) {
  const currentTier = plan;

  function handleClick(tierId) {
    if (onPlanChosen) onPlanChosen(tierId);

    if (tierId === "standard" || tierId === "premium") {
      if (onUpgradeClick) onUpgradeClick(tierId);
    }
  }

  // ✅ Auto-wrap grid: cards can NEVER become skinny
  // - phone: 1 column
  // - tablet: 2 columns (if space)
  // - desktop: 3 columns (if space)
  const gridStyle = useMemo(
    () => ({
      width: "100%",
      display: "grid",
      gap: "16px",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      alignItems: "stretch",
    }),
    []
  );

  // ✅ Center the content and prevent nested layouts from squeezing cards too much
  const wrapStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: 1100,
      margin: "0 auto",
    }),
    []
  );

  return (
    <section
      className="pricing-section"
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <div style={wrapStyle}>
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

        <div className="pricing-section__grid" style={gridStyle}>
          {pricingPlans.map((planItem) => {
            const isCurrent = planItem.id === currentTier;

            return (
              <div
                key={planItem.id}
                style={{
                  minWidth: 0,
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <PricingTierCard
                  plan={planItem}
                  isCurrent={isCurrent}
                  onClick={() => handleClick(planItem.id)}
                />
              </div>
            );
          })}
        </div>

        <p className="pricing-section__disclaimer">
          Upgrade or downgrade anytime. Your RealYou type stays the same — you’re
          just choosing how deep you want to go.
        </p>
      </div>
    </section>
  );
}
