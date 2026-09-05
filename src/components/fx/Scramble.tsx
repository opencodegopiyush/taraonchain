"use client";

import { useEffect, useRef, useState } from "react";

/* decrypt-style text: glyphs cycle, characters lock left→right */

const GLYPHS = "█▓▒░<>/\\|#*+=—0123456789ABCDEF";

export default function Scramble({
  text,
  className,
  delay = 0,
  duration,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = () => {
      const dur = duration ?? 700 + text.length * 26;
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const lock = Math.floor(k * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          if (c === " " || i < lock) s += c;
          else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
        if (k < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting && !done.current) {
          done.current = true;
          timer = setTimeout(run, delay);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}
