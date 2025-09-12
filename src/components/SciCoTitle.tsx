import React from "react";
import "./scico-title.css";

export type SciCoTitleProps = {
  text?: string;
  className?: string;
};

const DEFAULT_TEXT = "SciCo";

export const SciCoTitle: React.FC<SciCoTitleProps> = ({ text = DEFAULT_TEXT, className }) => {
  const letters = Array.from(text);
  return (
    <h1 className={"scico-title " + (className ?? "")} aria-label={text}>
      <span className="scico-title__inner" data-letters>
        {letters.map((ch, i) => (
          <span
            key={i}
            className="scico-title__letter"
            style={{ transitionDelay: `${i * 100}ms` }}
            aria-hidden="true"
          >
            {ch}
          </span>
        ))}
      </span>
    </h1>
  );
};

export default SciCoTitle;


