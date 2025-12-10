import React from "react";

export default function PricingTierCard({ plan, onClick, isCurrent }) {
  const isFree = plan.priceMonthly === 0;

  let buttonLabel = "Continue with this plan";
  if (isCurrent) {
    buttonLabel = "Current plan";
  } else if (isFree) {
    buttonLabel = "Get started";
  }

  return (
    <div
      className={`pricing-card ${
        isCurrent ? "pricing-card--current" : ""
      }`}
    >
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{plan.name}</h3>
        {plan.badgeLabel && (
          <span className="pricing-card__badge">
            {isCurrent ? "Active" : plan.badgeLabel}
          </span>
        )}
      </div>

      <p className="pricing-card__tagline">{plan.tagline}</p>

      <div className="pricing-card__price-row">
        <span className="pricing-card__price">
          {isFree ? "Free" : `$ ${plan.priceMonthly}`}
        </span>
        {!isFree && <span className="pricing-card__price-note">/one-time</span>}
      </div>

      <p className="pricing-card__description">{plan.description}</p>

      <ul className="pricing-card__features">
        {plan.features.map((item) => (
          <li key={item} className="pricing-card__feature">
            <span className="pricing-card__check">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button
        className="pricing-card__button"
        onClick={onClick}
        disabled={isCurrent}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
