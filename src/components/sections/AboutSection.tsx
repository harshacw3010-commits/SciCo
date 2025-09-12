import React, { useEffect, useRef } from "react";
import "./about-section.css";
import ImageSwapGallery from "./ImageSwapGallery";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useReveal<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);
  return ref;
}

export type AboutSectionProps = Record<string, never>;

const AboutSection: React.FC<AboutSectionProps> = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const titleRef = useReveal<HTMLHeadingElement>(!prefersReducedMotion);
  const mediaRef = useReveal<HTMLDivElement>(!prefersReducedMotion);
  const copyRef = useReveal<HTMLDivElement>(!prefersReducedMotion);

  return (
    <section id="about" className="about-section" aria-label="About SciCo">
      <div className="about-inner">
        <div ref={titleRef} className="about-heading reveal">
          <p className="about-eyebrow">Stay hungry, stay foolish.</p>
          <h1 className="about-title" aria-label="About SciCo">About SciCo</h1>
        </div>

        <div className="about-grid">
          <div ref={mediaRef} className="about-media reveal">
            <ImageSwapGallery />
          </div>

          <div ref={copyRef} className="about-copy reveal">
            <p>
              SciCo is a story that honors obsession. A mindset with Obsession for Science, curiosity and becoming better in life. SciCos (the people with this mindset) are the real HEROES of this story, not Gaurav Thakur.
            </p>
            <p>
              SciCos embody self-acceptance of individuality, obsessions and vulnerabilities, and uses Science to improve themselves and world around them. They use Science to achieve anything in life.
            </p>
            <p>
              SciCo is cool, humorous, takes things easy, broadminded, laidback/chill and optimistic.
            </p>

            <ul className="about-bullets" aria-label="SciCo values">
              <li>SciCo is Obsession</li>
              <li>SciCo is Enthusiasm for Science</li>
              <li>SciCo is Curiosity</li>
              <li>SciCo is Enthusiasm to become better in life</li>
              <li>SciCo is about doing something constructive for the world</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
