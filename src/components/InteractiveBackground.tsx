import React, { useEffect, useRef } from "react";
import "./interactive-background.css";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTsRef = useRef<number>(0);
  const runningRef = useRef<boolean>(true);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      // graceful fallback (no canvas)
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      dprRef.current = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dprRef.current);
      canvas.height = Math.floor(h * dprRef.current);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();

    // initialize particles
    const initParticles = () => {
      const count = Math.floor(Math.min(90, Math.max(40, (window.innerWidth * window.innerHeight) / 25000)));
      particlesRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.08 * dprRef.current,
        vy: (Math.random() - 0.5) * 0.08 * dprRef.current,
      }));
    };
    initParticles();

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX * dprRef.current, y: e.clientY * dprRef.current, active: true };
    };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const onVisibility = () => {
      runningRef.current = !document.hidden;
      if (runningRef.current) {
        lastTsRef.current = 0; // reset to avoid large deltas
        loop(performance.now());
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let fpsThrottle = 0; // basic throttling window

    const draw = (dt: number) => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const particles = particlesRef.current;

      // Update
      if (!prefersReducedMotion) {
        for (let p of particles) {
          p.x += p.vx * dt * 0.06;
          p.y += p.vy * dt * 0.06;

          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
      }

      // Parallax offset
      let px = 0, py = 0;
      if (mouseRef.current.active) {
        const cx = W / 2, cy = H / 2;
        px = (mouseRef.current.x - cx) * 0.02;
        py = (mouseRef.current.y - cy) * 0.02;
      }

      // Draw connections
      const maxDist = 140 * dprRef.current;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const a = 1 - Math.sqrt(d2) / maxDist;
            ctx.strokeStyle = `rgba(100, 180, 255, ${0.08 * a})`;
            ctx.lineWidth = 1 * dprRef.current;
            ctx.beginPath();
            ctx.moveTo(p.x + px, p.y + py);
            ctx.lineTo(q.x + px, q.y + py);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let p of particles) {
        const r = 1.4 * dprRef.current;
        const gx = ctx.createRadialGradient(p.x + px, p.y + py, 0, p.x + px, p.y + py, 6 * dprRef.current);
        gx.addColorStop(0, "rgba(200, 240, 255, 0.85)");
        gx.addColorStop(1, "rgba(60, 190, 255, 0.0)");
        ctx.fillStyle = gx;
        ctx.beginPath();
        ctx.arc(p.x + px, p.y + py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const loop = (ts: number) => {
      if (!runningRef.current) return;
      const last = lastTsRef.current || ts;
      const dt = Math.min(50, ts - last); // cap delta to avoid spikes
      lastTsRef.current = ts;

      if (fpsThrottle > 0) {
        fpsThrottle -= dt;
      } else {
        draw(dt);
        // light throttling when offscreen (unlikely since fixed), keep full speed otherwise
        fpsThrottle = 0; // set to e.g. 0 for 60fps equivalent
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    // Initial draw (static if reduced motion)
    draw(16);
    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(loop);
    }

    const onResize = () => { resize(); draw(16); };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (animationRef.current != null) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-bg" aria-hidden="true" />;
};

export default InteractiveBackground;
