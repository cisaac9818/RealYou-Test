import React from "react";

export default function PricingTierCard({ plan, onClick, isCurrent }) {
  const isFree = plan.priceMonthly === 0;

  let buttonLabel = "Continue with this plan";
  if (isCurrent) {
    buttonLabel = "Current plan";
  } else if (isFree) {
    buttonLabel = "Get started";
  }

  const wrapText = {
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "normal",
  };

  // 🔒 HARD CLARITY LINE
  const oneTimeLine = isFree
    ? "No card required • Start instantly"
    : "ONE-TIME PURCHASE • NO SUBSCRIPTIONS";

  return (
    <div
      className={`pricing-card ${isCurrent ? "pricing-card--current" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div className="pricing-card__header" style={{ minWidth: 0 }}>
        <h3 className="pricing-card__name" style={wrapText}>
          {plan.name}
        </h3>
        {plan.badgeLabel && (
          <span className="pricing-card__badge">
            {isCurrent ? "Active" : plan.badgeLabel}
          </span>
        )}
      </div>

      {/* TAGLINE */}
      <p className="pricing-card__tagline" style={wrapText}>
        {plan.tagline}
      </p>

      {/* PRICE */}
      <div className="pricing-card__price-row">
        <span className="pricing-card__price">
          {isFree ? "Free" : `$${plan.priceMonthly}`}
        </span>
        {!isFree && (
          <span className="pricing-card__price-note"> / one-time</span>
        )}
      </div>

      {/* 🔥 ONE-TIME / NO SUBS — VISUALLY LOUD */}
      <div
        style={{
          marginTop: "0.4rem",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#c7d2fe",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          ...wrapText,
        }}
      >
        {oneTimeLine}
      </div>

      {/* DESCRIPTION */}
      <p
        className="pricing-card__description"
        style={{ ...wrapText, marginTop: "0.8rem" }}
      >
        {plan.description}
      </p>

      {/* FEATURES */}
      <ul
        className="pricing-card__features"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          flex: "1 1 auto",
        }}
      >
        {plan.features.map((item) => (
          <li
            key={item}
            className="pricing-card__feature"
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              ...wrapText,
            }}
          >
            <span>✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className="pricing-card__button"
        onClick={onClick}
        disabled={isCurrent}
        style={{ marginTop: "16px" }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
