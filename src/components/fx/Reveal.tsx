"use client";

import { useEffect, useRef, useState } from "react";

/* in-view hook (fire once) — drives every reveal on the page */
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* count-up numeral */
export function useCountUp(target: number, active: boolean, dur = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setV(Math.round(target * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, dur]);
  return v;
}

/* a paragraph / block that declassifies: gold sweep bar + clip reveal */
export function RedactBlock({
  children,
  active,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`rblock ${active ? "on sweep" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* a heading word revealed by a sliding redaction bar */
export function RedactWord({
  children,
  active,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      {children}
      <span
        aria-hidden
        className={`redact-bar absolute -inset-x-1 -inset-y-0.5 ${active ? "off" : ""}`}
        style={{ transitionDelay: `${delay}ms` }}
      />
    </span>
  );
}
