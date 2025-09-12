import React from "react";
import "./about-gallery.css";

const ImageSwapGallery: React.FC = () => {
  return (
    <div
      className="image-swap-gallery"
      aria-label="SciCo image gallery"
      role="group"
      tabIndex={0}
    >
      {/* Base image layer */}
      <img
        className="is-base"
        src="/images/2.png"
        alt="SciCo — curiosity and science in action"
        loading="eager"
        decoding="async"
      />

      {/* Four square tiles that move to inner corners on hover */}
      <div className="tiles" aria-hidden="true">
        <img className="tile tile-tl" src="/images/3.jpg" alt="" aria-hidden="true" loading="eager" decoding="async" />
        <img className="tile tile-tr" src="/images/4.jpg" alt="" aria-hidden="true" loading="eager" decoding="async" />
        <img className="tile tile-br" src="/images/5.jpg" alt="" aria-hidden="true" loading="eager" decoding="async" />
        <img className="tile tile-bl" src="/images/6.jpg" alt="" aria-hidden="true" loading="eager" decoding="async" />
      </div>
    </div>
  );
};

export default ImageSwapGallery;
