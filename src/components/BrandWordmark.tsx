import React from "react";

export type BrandWordmarkProps = {
  className?: string;
};

const BrandWordmark: React.FC<BrandWordmarkProps> = ({ className }) => {
  // Render letters with accent sizing for "S" and the central "C"
  const letters = ["S", "C", "I", "C", "O"]; // display in full uppercase
  return (
    <div className={("brand-wordmark " + (className ?? "")).trim()}>
      <h1 className="brand-wordmark__text" aria-label="SciCo brand wordmark">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={
              "brand-wordmark__letter" + (ch === "S" || (ch === "C" && i === 3) ? " brand-wordmark__letter--accent" : "")
            }
            aria-hidden="true"
          >
            {ch}
          </span>
        ))}
      </h1>
      <svg
        className="brand-wordmark__underline"
        viewBox="0 0 100 12"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="underline-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          className="brand-wordmark__underline-path"
          d="M2 8 C 22 2, 78 2, 98 8"
          stroke="url(#underline-cyan)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default BrandWordmark;
