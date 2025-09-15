import React, { useEffect, useRef } from "react";

export type BrandWordmarkProps = {
  className?: string;
};

const BrandWordmark: React.FC<BrandWordmarkProps> = ({ className }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { rootRef.current?.classList.add("is-ready"); }, []);

  return (
    <div ref={rootRef} className={("brand-wordmark " + (className ?? "")).trim()}>
      <h1 className="brand-wordmark__text" aria-label="SciCo">SciCo</h1>
      <p className="brand-tagline">
        <span className="brand-tagline__text">Where Obsession Wins.</span>
        <span className="brand-tagline__underline" aria-hidden="true" />
      </p>
    </div>
  );
};

export default BrandWordmark;
