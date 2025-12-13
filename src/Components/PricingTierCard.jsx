import React from "react";

export default function PricingTierCard({ plan, onClick, isCurrent }) {
  const isFree = plan.priceMonthly === 0;

  let buttonLabel = "Continue with this plan";
  if (isCurrent) {
    buttonLabel = "Current plan";
  } else if (isFree) {
    buttonLabel = "Get started";
  }

  // ✅ Text wrap safety (prevents spill no matter what CSS is doing)
  const wrapText = {
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "normal",
  };

  return (
    <div
      className={`pricing-card ${isCurrent ? "pricing-card--current" : ""}`}
      style={{
        // ✅ Make the card layout stable and prevent internal overflow
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minWidth: 0,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <div className="pricing-card__header" style={{ minWidth: 0 }}>
        <h3 className="pricing-card__name" style={wrapText}>
          {plan.name}
        </h3>

        {plan.badgeLabel && (
          <span
            className="pricing-card__badge"
            style={{
              ...wrapText,
              maxWidth: "100%",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {isCurrent ? "Active" : plan.badgeLabel}
          </span>
        )}
      </div>

      <p className="pricing-card__tagline" style={wrapText}>
        {plan.tagline}
      </p>

      <div className="pricing-card__price-row" style={{ minWidth: 0 }}>
        <span className="pricing-card__price" style={wrapText}>
          {isFree ? "Free" : `$ ${plan.priceMonthly}`}
        </span>
        {!isFree && (
          <span className="pricing-card__price-note" style={wrapText}>
            /one-time
          </span>
        )}
      </div>

      <p className="pricing-card__description" style={wrapText}>
        {plan.description}
      </p>

      <ul
        className="pricing-card__features"
        style={{
          // ✅ Allow wrapping; never overflow the card
          ...wrapText,
          minWidth: 0,
          paddingLeft: 0,
          margin: 0,
          listStyle: "none",
          flex: "1 1 auto", // ✅ lets features take space but not break layout
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
              minWidth: 0,
              ...wrapText,
            }}
          >
            <span className="pricing-card__check" style={{ flex: "0 0 auto" }}>
              ✓
            </span>
            <span style={{ minWidth: 0, ...wrapText }}>{item}</span>
          </li>
        ))}
      </ul>

      <button
        className="pricing-card__button"
        onClick={onClick}
        disabled={isCurrent}
        style={{
          marginTop: "16px",
          flex: "0 0 auto",
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
