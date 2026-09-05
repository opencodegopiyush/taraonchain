"use client";

import { useEffect, useRef } from "react";
import { TUNE, retune } from "@/lib/edition";

/* ── EvidenceCloud — v12, the band IS the brand ──────────────
   the word TARAONCHAIN rebuilt from a swarm of living gold
   particles. fake-3D: every particle carries a z that
   drives its size, brightness and parallax, so the cloud reads
   as a shallow-volume object, not a flat texture.
   case-agnostic by design — the name belongs to the platform,
   not to any single report.

   reactive by design:
   · assembles — particles are born scattered and spring into
     the glyphs when the band scrolls into view
   · scatters — cursor/finger pushes them apart (stronger when
     pressed/dragged; drag velocity is imparted to the swarm)
   · recovers — a damped spring pulls every particle home
   · flares — a scan sweep crosses the band every few seconds
     and the particles it passes light up (the v9 scan language)

   pure canvas2d, additive "lighter" composite, no cover
   layers, nothing that can hide content. prefers-reduced-motion
   renders the formed glyphs once, static, interaction-free. */

interface P {
  hx: number; // home x
  hy: number; // home y
  x: number;
  y: number;
  vx: number;
  vy: number;
  ph: number; // phase 0..1 — desyncs breathing + depth
  glow: number; // sweep flare 0..1, decays
}

const GOLD = "227, 185, 92";
const HI = "246, 227, 161";
const WORD = "TARAONCHAIN";

export default function EvidenceCloud({
  className,
}: {
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    retune(); // v10 seam — pick desktop/mobile tuning up front
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const N = TUNE.cloudParticles;
    const PUSH_R = TUNE.cloudPushRadius;
    const PUSH_F = TUNE.cloudPushForce;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let parts: P[] = [];
    let raf = 0;
    let inView = false;
    let built = false;
    const t0 = performance.now();

    const ptr = {
      x: -9999,
      y: -9999,
      down: false,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
    };

    /* ── glyph sampling: draw the word offscreen, take pixels.
       the word is fitted to ~86% of the band width so it reads
       on every viewport; the band holds nothing else — no
       labels, no captions. ── */
    const sample = () => {
      if (w < 40 || h < 40) return;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const c = off.getContext("2d");
      if (!c) return;
      const target = w * 0.86;
      let size = 100;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = `700 ${size}px "JetBrains Mono", monospace`;
      const measured = c.measureText(WORD).width || 1;
      size = Math.min(210, Math.max(34, size * (target / measured)));
      c.font = `700 ${size}px "JetBrains Mono", monospace`;
      c.fillStyle = "#fff";
      c.fillText(WORD, w / 2, h * 0.5);

      const data = c.getImageData(0, 0, w, h).data;
      const pts: { x: number; y: number }[] = [];
      const step = w > 700 ? 2 : 3;
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step)
          if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
      if (pts.length === 0) return;

      parts = [];
      const n = Math.min(N, pts.length);
      const stride = pts.length / n;
      const scatter = built ? 0 : 1; // only the first build assembles
      for (let i = 0; i < n; i++) {
        const p = pts[Math.floor(i * stride)];
        parts.push({
          hx: p.x,
          hy: p.y,
          x: p.x + (Math.random() - 0.5) * 320 * scatter,
          y: p.y + (Math.random() - 0.5) * 200 * scatter,
          vx: 0,
          vy: 0,
          ph: Math.random(),
          glow: 0,
        });
      }
      built = true;
    };

    /* ── size + rebuild (debounced through rAF) ── */
    let roQueued = false;
    const resize = () => {
      if (roQueued) return;
      roQueued = true;
      requestAnimationFrame(() => {
        roQueued = false;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        sample();
        if (reduced) drawStatic();
      });
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    /* ── pointer — pan-y keeps vertical page scroll alive; the
       horizontal component of a drag still reaches the swarm ── */
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.vx = e.clientX - ptr.px;
      ptr.vy = e.clientY - ptr.py;
      ptr.px = e.clientX;
      ptr.py = e.clientY;
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const onDown = (e: PointerEvent) => {
      ptr.down = true;
      onMove(e);
    };
    const onUp = () => {
      ptr.down = false;
    };
    const onLeave = () => {
      ptr.x = -9999;
      ptr.y = -9999;
      ptr.down = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      (es) => {
        inView = es[0].isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    /* ── one static pass for prefers-reduced-motion ── */
    function drawStatic() {
      if (!ctx || parts.length === 0 || w === 0) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        ctx.fillStyle = `rgba(${GOLD}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.hx, p.hy, 1.1, 0, 6.2832);
        ctx.fill();
      }
    }

    /* ── main loop ── */
    const SPRING = 26; // home pull, /s²
    const DAMP = 5.2; // velocity decay, /s
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!inView || document.hidden || w === 0 || parts.length === 0)
        return;
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, 1 / 60);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      /* scan sweep — crosses the band in the first 35% of a
         5.2s cycle, then rests */
      const cyc = (t % 5.2) / 5.2;
      const sweepX =
        cyc < 0.35 ? (cyc / 0.35) * (w + 240) - 120 : Number.MAX_SAFE_INTEGER;

      const damp = Math.exp(-DAMP * dt);
      const spring = SPRING * dt;
      const dragBoost = ptr.down ? 2.4 : 1;
      const psize = w > 700 ? 1.3 : 1.05; // longer word = sparser field, slightly fatter dots

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        /* spring home + integrate */
        p.vx += (p.hx - p.x) * spring;
        p.vy += (p.hy - p.y) * spring;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        /* pointer repulsion + drag impulse */
        const dx = p.x - ptr.x;
        const dy = p.y - ptr.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < PUSH_R * PUSH_R) {
          const d = Math.max(10, Math.sqrt(d2));
          const f = ((PUSH_R - d) / PUSH_R) * PUSH_F * dragBoost;
          p.vx += (dx / d) * f * 44 * dt;
          p.vy += (dy / d) * f * 44 * dt;
          if (ptr.down) {
            p.vx += ptr.vx * 1.4;
            p.vy += ptr.vy * 1.4;
          }
        }

        /* fake-3D — depth oscillation drives size + parallax */
        const zt = Math.sin(t * 0.7 + p.ph * 6.283);
        const persp = 1 + zt * 0.085;
        const bx = Math.sin(t * 0.5 + p.ph * 12.9) * 1.4;
        const by = Math.cos(t * 0.43 + p.ph * 9.1) * 1.1;

        /* sweep flare */
        const sd = Math.abs(p.x - sweepX);
        if (sd < 70) p.glow = Math.max(p.glow, 1 - sd / 70);
        p.glow *= Math.exp(-2.1 * dt);

        const a = 0.22 + 0.42 * (0.5 + 0.5 * zt) + p.glow * 0.36;
        const r = Math.max(
          0.6,
          (1.05 + 0.55 * zt) * psize * (1 + p.glow * 0.7),
        );
        const x = p.x + bx * persp;
        const y = p.y + by * persp;

        ctx.fillStyle = `rgba(${GOLD}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2832);
        ctx.fill();

        if (p.glow > 0.06) {
          ctx.fillStyle = `rgba(${HI}, ${(p.glow * 0.3).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, r * 2.6, 0, 6.2832);
          ctx.fill();
        }
      }
    };

    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
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
