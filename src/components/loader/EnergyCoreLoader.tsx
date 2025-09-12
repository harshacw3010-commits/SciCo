import React, { useEffect, useMemo, useRef, useState } from "react";
import "./energy-core-loader.css";

export type EnergyCoreLoaderProps = {
  onComplete?: () => void;
  autoUnmount?: boolean;
  /** Optional external progress [0..1]; when >= 0.95 we allow early outro */
  progress?: number;
};

// Portal layout
const SLOT = 64; // used for text spacing only
const GAP = 24;
const STEP = SLOT + GAP;

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

const letters = ["S", "C", "I", "C", "O"]; // Portal shows the whole word

const EnergyCoreLoader: React.FC<EnergyCoreLoaderProps> = ({ onComplete, autoUnmount = true, progress }) => {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const [revealed, setRevealed] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const timeouts = useRef<number[]>([]);
  const [portalOpen, setPortalOpen] = useState(false);

  const width = useMemo(() => STEP * 4 + SLOT, []); // 5 slots wide (S C I C O)

  // no core rolling in portal mode

  // Orchestrate the timeline
  useEffect(() => {
    let mounted = true;
    // Sync letter font-size into CSS var so core center aligns with letter midline
    const syncLetterHeight = () => {
      const letter = overlayRef.current?.querySelector<HTMLElement>(".ecl-letter");
      if (letter && overlayRef.current) {
        const fs = getComputedStyle(letter).fontSize;
        overlayRef.current.style.setProperty("--letter-h", fs);
      }
    };
    syncLetterHeight();
    const rsId = window.setTimeout(syncLetterHeight, 0);
    timeouts.current.push(rsId);
    const done = () => {
      if (!mounted) return;
      if (overlayRef.current) overlayRef.current.classList.add("ecl--out");
      const id = window.setTimeout(() => {
        if (!mounted) return;
        if (autoUnmount) setVisible(false);
        onComplete?.();
      }, 320);
      timeouts.current.push(id);
    };

    // Reduced motion path: fade letters quickly, then out
    if (reduced) {
      setRevealed(letters.length);
      const id1 = window.setTimeout(() => {
        // brief hold then fade out
        done();
      }, 800);
      timeouts.current.push(id1);
      return () => {
        mounted = false;
        timeouts.current.forEach(clearTimeout);
      };
    }

    const bgId = window.setTimeout(() => overlayRef.current?.classList.add("ecl--bg-on"), 60);
    timeouts.current.push(bgId);

    // Circuits flash is optional in portal mode; kept minimal

    const run = async () => {
      // Open portal iris
      setPortalOpen(true);
      // Quick staged letter reveal inside portal
      const revealStep = 100; // ms between letters
      for (let i = 0; i < letters.length; i++) {
        const id = window.setTimeout(() => setRevealed((r) => Math.max(r, i + 1)), 420 + i * revealStep);
        timeouts.current.push(id);
      }

      // Allow early finish if external progress is ready
      const ready = progress != null && progress >= 0.95;
      const hold = ready ? 600 : 1200;
      const id3 = window.setTimeout(() => {
        overlayRef.current?.classList.add("ecl--ripple");
        const id4 = window.setTimeout(done, 520);
        timeouts.current.push(id4);
      }, hold);
      timeouts.current.push(id3);
    };

    run();

    return () => {
      mounted = false;
      timeouts.current.forEach(clearTimeout);
    };
  }, [autoUnmount, onComplete, progress, reduced]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="ecl" role="status" aria-live="polite" aria-label="Loading SciCo">
      {/* Background gradient + circuits */}
      <div className="ecl-bg" aria-hidden="true">
        <svg className="ecl-circuits" viewBox="0 0 800 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ecl-wire" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
              <stop offset="100%" stopColor="rgba(217,70,239,0.12)" />
            </linearGradient>
          </defs>
          {/* A few subtle traces */}
          <path d="M40 540 H200 C260 540 260 480 320 480 H480 C540 480 540 420 600 420 H760" stroke="url(#ecl-wire)" strokeWidth="1" fill="none" strokeDasharray="8 10" />
          <path d="M40 420 H180 C220 420 240 400 280 380 L360 340 C400 320 440 320 520 330 L760 360" stroke="url(#ecl-wire)" strokeWidth="1" fill="none" strokeDasharray="8 10" />
          <path d="M60 300 H220 C260 300 280 280 320 260 L420 220 C460 200 520 200 620 220 L780 260" stroke="url(#ecl-wire)" strokeWidth="1" fill="none" strokeDasharray="8 10" />
        </svg>
      </div>

      {/* Stage with baseline */}
      <div ref={stageRef} className="ecl-stage" style={{ width }}>
        <div className="ecl-ground" aria-hidden="true" />

        {/* Portal aperture */}
        <div className={"ecl-portal" + (portalOpen ? " is-open" : "") } aria-hidden="true">
          <div className="ecl-ring ecl-ring--outer" />
          <div className="ecl-ring ecl-ring--inner" />
          <div className="ecl-sheen" />
        </div>

        {/* Letters inside portal */}
        <div className="ecl-letters ecl-letters--center" aria-hidden="true" style={{ gap: GAP }}>
          {letters.map((ch, i) => (
            <span key={i} className={"ecl-letter" + (revealed > i ? " is-on" : "")}>{ch}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyCoreLoader;
