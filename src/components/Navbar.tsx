import React, { useEffect, useMemo, useRef, useState } from "react";
import "./navbar.css";

export type NavbarProps = {
  className?: string;
};

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

const LARGE_H = 64; // px
const SMALL_H = 48; // px
const THRESHOLD = 80; // px

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shrink, setShrink] = useState<boolean>(false);
  const ticking = useRef<boolean>(false);

  // Ensure CSS var is set on mount and whenever state changes
  useEffect(() => {
    const h = shrink ? SMALL_H : LARGE_H;
    document.documentElement.style.setProperty("--nav-h", `${h}px`);
  }, [shrink]);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      const run = () => {
        const shouldShrink = window.scrollY >= THRESHOLD;
        setShrink((prev) => (prev !== shouldShrink ? shouldShrink : prev));
        ticking.current = false;
      };
      if (prefersReducedMotion) {
        run();
      } else {
        requestAnimationFrame(run);
      }
    };
    // Set initial state and var
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll as any);
  }, [prefersReducedMotion]);

  const cls = useMemo(
    () => ["navbar", shrink ? "navbar--shrink" : "", className ?? ""].join(" ").trim(),
    [shrink, className]
  );

  return (
    <header className={cls} role="banner" aria-label="Primary navigation">
      <div className="navbar__inner">
        <nav className="navbar__nav" aria-label="Primary">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#explorations">Explorations</a></li>
            <li><a href="#podcasts">Podcasts</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
