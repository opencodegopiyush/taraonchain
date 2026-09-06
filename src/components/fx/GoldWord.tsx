"use client";

import { useEffect, useState } from "react";

/* ── GoldWord — the v7 fix for the vanishing TRAIL. ──────────
   v6 painted the hero word with an ANIMATED background-clip:
   text gradient. Some desktop Chromium compositors drop that
   layer entirely → transparent glyphs on a dark page → the
   word simply vanishes (the blank gap in the user's screenshot).

   v7 rule: VISIBILITY NEVER DEPENDS ON A CSS TRICK.
   - the letters are painted SOLID gold — always renders
   - the shimmer is a decorative skewed gradient that sweeps
     OVER the word inside an overflow-hidden wrapper; if the
     overlay ever fails to paint, worst case = a solid gold
     word, never a missing one. */

export default function GoldWord({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [sweep, setSweep] = useState(false);

  /* one polite sweep shortly after mount, then every 5s */
  useEffect(() => {
    let alive = true;
    let t1: ReturnType<typeof setTimeout>;
    let iv: ReturnType<typeof setInterval>;
    const kick = () => {
      if (!alive) return;
      setSweep(true);
      t1 = setTimeout(() => alive && setSweep(false), 1400);
    };
    t1 = setTimeout(kick, 1500);
    iv = setInterval(kick, 5200);
    return () => {
      alive = false;
      clearTimeout(t1);
      clearInterval(iv);
    };
  }, []);

  return (
    <span className={`gold-word-wrap relative inline-block ${className ?? ""}`}>
      <span className="gold-word relative z-10">{children}</span>
      <span
        aria-hidden
        className={`sheen-swipe pointer-events-none absolute inset-y-0 -left-1/3 z-20 w-1/2 -skew-x-12 ${
          sweep ? "run" : ""
        }`}
      />
    </span>
  );
}
