// src/Components/PricingSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { pricingPlans } from "../config/pricing";
import PricingTierCard from "./PricingTierCard";

export default function PricingSection({ plan, onUpgradeClick, onPlanChosen }) {
  const currentTier = plan;

  // ✅ Force columns based on actual device screen size (not CSS viewport)
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const computeCols = () => {
      const s = window.screen;
      const shortSide = Math.min(s.width, s.height); // phone ~ 360-430, tablet ~ 768+
      if (shortSide < 700) return 1;   // phones
      if (shortSide < 1024) return 2;  // tablets
      return 3;                        // desktop
    };

    const update = () => setCols(computeCols());

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  function handleClick(tierId) {
    if (onPlanChosen) onPlanChosen(tierId);

    if (tierId === "standard" || tierId === "premium") {
      if (onUpgradeClick) onUpgradeClick(tierId);
    }
  }

  const gridStyle = useMemo(
    () => ({
      width: "100%",
      display: "grid",
      gap: "16px",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    }),
    [cols]
  );

  return (
    <section
      className="pricing-section"
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
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
                overflow: "hidden", // ✅ kills any visual text spill
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
    </section>
  );
}
