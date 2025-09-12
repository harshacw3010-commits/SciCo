import React, { KeyboardEvent, useEffect, useState } from "react";
import "./explorations.css";

export type ExplorationsSectionProps = {
  museumVideoId?: string;
  onNotifyClick?: () => void;
};

const YOUTUBE_ID_MOF = "ZvgQF30KD38";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

const ExplorationsSection: React.FC<ExplorationsSectionProps> = ({
  museumVideoId = YOUTUBE_ID_MOF,
  onNotifyClick,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const youtubeHref = `https://www.youtube.com/watch?v=${museumVideoId}`;
  const youtubeThumb = `https://img.youtube.com/vi/${museumVideoId}/hqdefault.jpg`;

  const onMediaKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  };

  return (
    <section id="explorations" className="explorations" aria-label="Explorations">
      <div className="explorations__inner">
        <header className="explorations__header">
          <p className="explorations__eyebrow">Where obsession meets the unknown.</p>
          <h2 className="explorations__title">Explorations</h2>
        </header>

        <div className="explorations__grid">
          {/* Card 1: Museum of Future */}
          <article className="expl-card" aria-labelledby="mof-title">
            <div className="expl-card__body">
              <h3 id="mof-title" className="expl-card__title">Museum of Future</h3>
              <p className="expl-card__copy">“A walk into tomorrow—where curiosity becomes architecture.”</p>
              <p className="expl-card__copy">“We trace the blueprints of a world built by bold questions.”</p>
            </div>
            <a
              className={"expl-card__media" + (prefersReducedMotion ? " reduced-motion" : "")}
              href={youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Museum of Future — watch on YouTube"
              onKeyDown={onMediaKeyDown}
            >
              <img src={youtubeThumb} alt="Museum of Future — watch on YouTube" />
              <span className="expl-card__play" aria-hidden="true">
                <span className="expl-card__play-ring" />
                <span className="expl-card__play-triangle" />
              </span>
            </a>
          </article>

          {/* Card 2: Ice Breaker Ship (Coming Soon) */}
          <article className="expl-card" aria-labelledby="ibs-title">
            <div className="expl-card__body">
              <h3 id="ibs-title" className="expl-card__title">Ice Breaker Ship</h3>
              <p className="expl-card__copy">“Engines whisper under polar night; data carves pathways through ice.”</p>
              <p className="expl-card__copy">“The experiment is set. The horizon waits.”</p>
            </div>
            <div className="expl-card__media coming-soon" aria-live="polite">
              <span className="coming-soon__label" aria-hidden="true">COMING SOON…</span>
              <span className="coming-soon__sub">
                The drop is near…
                {" "}
                <a
                  className="coming-soon__link"
                  href="https://www.youtube.com/@GetSetFly"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stay tuned
                </a>
              </span>
              {onNotifyClick && (
                <button type="button" className="coming-soon__cta" onClick={onNotifyClick}>
                  Notify me
                </button>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ExplorationsSection;
