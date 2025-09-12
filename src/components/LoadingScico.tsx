import React, { useEffect, useRef, useState } from "react";
import "./loading-scico.css";

export type LoadingScicoProps = {
  onComplete?: () => void;
  autoUnmount?: boolean;
};

const SLOT = 64; // width for one letter slot
const GAP = 24; // spacing between letters
const STEP = SLOT + GAP;

function usePrefersReducedMotion() {
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

const letters = ["S", "C", "I", "C", "O"];

const LoadingScico: React.FC<LoadingScicoProps> = ({ onComplete, autoUnmount = true }) => {
  const prefersReduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(0);
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const orbAnimRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [trails, setTrails] = useState<Array<{ id: number; left: number; width: number }>>([]);

  const addTrail = (fromX: number, toX: number) => {
    const left = Math.min(fromX, toX) + SLOT / 2;
    const width = Math.abs(toX - fromX);
    const id = Date.now() + Math.random();
    setTrails((p) => [...p, { id, left, width }]);
    setTimeout(() => setTrails((p) => p.filter((t) => t.id !== id)), 180);
  };

  const animateTo = (x: number, y: number, dur: number, ease = "cubic-bezier(.22,.61,.36,1)") => {
    return new Promise<void>((resolve) => {
      const orb = orbRef.current;
      if (!orb) return resolve();
      orb.style.transition = `transform ${dur}ms ${ease}`;
      orb.style.transform = `translate(${x}px, ${y}px)`;
      let doneCalled = false;
      const done = () => {
        if (doneCalled) return;
        doneCalled = true;
        orb.removeEventListener("transitionend", done);
        resolve();
      };
      orb.addEventListener("transitionend", done, { once: true });
      // Fallback in case transitionend doesn't fire (browser edge cases)
      setTimeout(done, dur + 60);
    });
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (prefersReduced) {
        // Simple sequential fade of letters
        for (let i = 0; i < letters.length; i++) {
          setRevealed(i + 1);
          await new Promise((r) => setTimeout(r, 160));
        }
        await new Promise((r) => setTimeout(r, 300));
        if (!mounted) return;
        if (overlayRef.current) overlayRef.current.classList.add("ls-out");
        setTimeout(() => {
          if (!mounted) return;
          if (autoUnmount) setVisible(false);
          onComplete?.();
        }, 320);
        return;
      }

      const fallH = 280; // px
      const dashDur = 170; // ms per dash
      const settle = 50; // ms settle between hops

      // position orb above first slot
      const orb = orbRef.current!;
      orb.style.transform = `translate(0px, ${-fallH}px)`;

      // Free-fall
      await animateTo(0, 0, 480);
      if (!mounted) return;
      // Squish + rebound (apply to inner anim wrapper to avoid transform clash)
      const anim = orbAnimRef.current;
      if (anim) {
        anim.classList.add("ls-squish");
        setTimeout(() => anim.classList.remove("ls-squish"), 140);
      }
      await animateTo(0, -10, 120);
      await animateTo(0, 0, 120);
      setRevealed(1); // S

      // Dashes to next letter positions
      for (let i = 1; i < letters.length; i++) {
        const fromX = STEP * (i - 1);
        const toX = STEP * i;
        // add dash flair
        orb.classList.add("ls-dash");
        if (anim) anim.classList.add("ls-vibrate");
        addTrail(fromX, toX);
        await animateTo(toX, 0, dashDur);
        orb.classList.remove("ls-dash");
        if (anim) anim.classList.remove("ls-vibrate");
        await new Promise((r) => setTimeout(r, settle));
        setRevealed(i + 1);
      }

      // Morph orb to O at last stop (on inner wrapper)
      if (anim) anim.classList.add("ls-morph");
      await new Promise((r) => setTimeout(r, 240));
      if (!mounted) return;
      orb.style.opacity = "0";

      // Hold, then outro fade
      await new Promise((r) => setTimeout(r, 300));
      if (overlayRef.current) overlayRef.current.classList.add("ls-out");
      setTimeout(() => {
        if (!mounted) return;
        if (autoUnmount) setVisible(false);
        onComplete?.();
      }, 320);
    };

    // Safety: force-complete if anything stalls (>5s)
    const safety = setTimeout(() => {
      if (!mounted) return;
      if (overlayRef.current) overlayRef.current.classList.add("ls-out");
      setTimeout(() => {
        if (autoUnmount) setVisible(false);
        onComplete?.();
      }, 320);
    }, 5200);

    run().finally(() => clearTimeout(safety));
    return () => {
      mounted = false;
    };
  }, [autoUnmount, prefersReduced, onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="ls-overlay"
      role="status"
      aria-live="polite"
      aria-label="Loading SciCo"
    >
      <div className="ls-gridfx" aria-hidden />
      <div ref={stageRef} className="ls-stage" style={{ width: STEP * 4 + SLOT }}>
        {/* letters */}
        <div className="ls-letters" style={{ gap: GAP }}>
          {letters.map((ch, i) => (
            <span
              key={i}
              className={`ls-letter ${revealed > i ? "is-on" : ""} ${i === 4 ? "is-o" : ""}`}
              style={{ width: SLOT }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* orb */}
        <div ref={orbRef} className="ls-orb" style={{ width: SLOT, height: SLOT }}>
          <div ref={orbAnimRef} className="ls-orb-anim">
            <div className="ls-orb-glow" />
            <div className="ls-orb-core" />
          </div>
        </div>

        {/* transient dash trails */}
        {trails.map((t) => (
          <div key={t.id} className="ls-trail" style={{ left: t.left, width: t.width }} />
        ))}
      </div>
    </div>
  );
};

export default LoadingScico;
