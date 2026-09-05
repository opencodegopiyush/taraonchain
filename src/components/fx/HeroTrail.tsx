"use client";

import { useEffect, useRef } from "react";

/* ── HeroTrail — the bubble trail, on the landing page ───────
   ambient gold bubbles drifting upward, each with a comet
   trail; constellation lines between neighbours; the swarm
   scatters around your finger/cursor. pure canvas2d — renders
   on every phone, no webgl anywhere. */

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  ph: number;
  trail: { x: number; y: number }[];
}

export default function HeroTrail({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const N = 15;
    const bubbles: Bubble[] = [];

    const spawn = (b: Bubble, anywhere: boolean) => {
      b.x = Math.random() * w;
      b.y = anywhere ? Math.random() * h : h + 20 + Math.random() * 80;
      b.vx = (Math.random() - 0.5) * 0.14;
      b.vy = -0.16 - Math.random() * 0.3;
      b.r = 2.2 + Math.random() * 4.4;
      b.ph = Math.random() * 6.283;
      b.trail = [];
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    for (let i = 0; i < N; i++) {
      const b = {} as Bubble;
      spawn(b, true);
      bubbles.push(b);
    }

    const pointer = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let lastSample = 0;
    let raf = 0;

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;

      /* move + finger repulsion */
      for (const b of bubbles) {
        if (!reduced) {
          b.x += b.vx + Math.sin(t * 0.6 + b.ph) * 0.12;
          b.y += b.vy;
          if (pointer.active) {
            const dx = b.x - pointer.x;
            const dy = b.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 130 && d > 0.5) {
              const f = ((130 - d) / 130) * 0.55;
              b.x += (dx / d) * f;
              b.y += (dy / d) * f;
            }
          }
          if (b.y < -30 || b.x < -40 || b.x > w + 40) spawn(b, false);
        }
      }

      /* constellation lines */
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i];
          const c = bubbles[j];
          const d = Math.hypot(a.x - c.x, a.y - c.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(227, 185, 92, ${(1 - d / 120) * 0.13})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
        }
      }

      /* trail sampling */
      if (now - lastSample > 42) {
        lastSample = now;
        for (const b of bubbles) {
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > 11) b.trail.shift();
        }
      }

      /* trails + bubbles */
      for (const b of bubbles) {
        const tr = b.trail;
        if (tr.length > 1 && !reduced) {
          ctx.globalCompositeOperation = "lighter";
          ctx.lineCap = "round";
          for (let i = 1; i < tr.length; i++) {
            const k = i / tr.length;
            ctx.strokeStyle = `rgba(227, 185, 92, ${0.3 * k * k})`;
            ctx.lineWidth = Math.max(0.4, b.r * 0.62 * k);
            ctx.beginPath();
            ctx.moveTo(tr[i - 1].x, tr[i - 1].y);
            ctx.lineTo(tr[i].x, tr[i].y);
            ctx.stroke();
          }
          ctx.globalCompositeOperation = "source-over";
        }
        const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 3.4);
        glow.addColorStop(0, "rgba(227, 185, 92, 0.28)");
        glow.addColorStop(1, "rgba(227, 185, 92, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 3.4, 0, 6.283);
        ctx.fill();

        const g = ctx.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.35,
          b.r * 0.1,
          b.x,
          b.y,
          b.r,
        );
        g.addColorStop(0, "rgba(246, 227, 161, 0.95)");
        g.addColorStop(0.5, "rgba(227, 185, 92, 0.8)");
        g.addColorStop(1, "rgba(166, 124, 46, 0.35)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 6.283);
        ctx.fill();
      }
    };

    if (reduced) {
      draw(0);
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (document.hidden) return;
        draw(now);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    />
  );
}
