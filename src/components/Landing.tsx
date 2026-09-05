"use client";

import { useStore, reviewedPct } from "@/lib/store";
import HeroTrail from "./fx/HeroTrail";
import Scramble from "./fx/Scramble";
import { useInView, useCountUp, RedactBlock, RedactWord } from "./fx/Reveal";

/* ── v6 landing — "REDACTED" ─────────────────────────────────
   every animation here is css/canvas — identical on phone and
   desktop, nothing gated behind pointer:hover or min-width. */

function Stat({ v, label, suffix }: { v: number; label: string; suffix?: string }) {
  const [ref, on] = useInView<HTMLDivElement>(0.5);
  const n = useCountUp(v, on);
  return (
    <div ref={ref} className="flex flex-col gap-1 px-2 py-4 text-center">
      <span className="disp text-2xl font-bold text-gold-hi sm:text-3xl">
        {n}
        {suffix}
      </span>
      <span className="label">{label}</span>
    </div>
  );
}

export default function Landing() {
  const openCase = useStore((s) => s.openCase);
  const setOverlay = useStore((s) => s.setOverlay);
  const cf = useStore((s) => s.caseFile);
  const visited = useStore((s) => s.visited);
  const pct = reviewedPct({ visited, caseFile: cf });

  const [heroRef, heroOn] = useInView<HTMLDivElement>(0.15);
  const [cardRef, cardOn] = useInView<HTMLDivElement>(0.25);

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background">
      {/* corner chrome */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="mono text-[10px] font-bold tracking-[0.3em] text-bone">
          TARAONCHAIN
        </span>
        <span className="chip">TEST BUILD · V6 · REDACTED</span>
      </div>

      {/* ── hero ── */}
      <section
        ref={heroRef}
        className="scanlines relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-20 sm:px-8"
      >
        <HeroTrail className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,7,4,0.72)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <p className="label mb-5 fade-up" style={{ animationDelay: "80ms" }}>
            <Scramble text="ON-CHAIN FORENSICS · CASE ARCHIVE" duration={900} />
          </p>

          <h1 className="disp font-bold leading-[0.98] tracking-tight text-ink">
            <span className="block text-[12vw] sm:text-6xl md:text-7xl">
              <RedactWord active={heroOn} delay={250}>EVERY</RedactWord>{" "}
              <RedactWord active={heroOn} delay={420}>CHAIN</RedactWord>
            </span>
            <span className="block text-[12vw] sm:text-6xl md:text-7xl">
              <RedactWord active={heroOn} delay={620}>LEAVES</RedactWord>{" "}
              <RedactWord active={heroOn} delay={790}>A</RedactWord>
            </span>
            <span className="gold-text block text-[15vw] sm:text-7xl md:text-8xl">
              <RedactWord active={heroOn} delay={1020}>TRAIL.</RedactWord>
            </span>
          </h1>

          <RedactBlock active={heroOn} delay={1250} className="mt-7 max-w-xl">
            <p className="read text-[15px] sm:text-base">
              The mempool forgets nothing. TARAONCHAIN turns verified
              investigation reports into case files you can walk through —
              every bubble a wallet, every gold thread a movement of funds,
              every claim stamped with what is observed, assessed or unknown.
            </p>
          </RedactBlock>

          <div
            className="mt-9 flex flex-wrap items-center gap-3 fade-up"
            style={{ animationDelay: "1500ms" }}
          >
            <button
              className="btn btn-gold"
              onClick={(e) => {
                const rip = document.createElement("span");
                rip.className = "ripple-ink";
                rip.style.left = `${e.nativeEvent.offsetX}px`;
                rip.style.top = `${e.nativeEvent.offsetY}px`;
                (e.currentTarget as HTMLElement).appendChild(rip);
                setTimeout(() => rip.remove(), 720);
                openCase();
              }}
            >
              OPEN CASE {cf.id} ▸
            </button>
            <button className="btn btn-ghost" onClick={() => setOverlay("method")}>
              METHOD
            </button>
          </div>

          <p
            className="label mt-10 fade-up caret"
            style={{ animationDelay: "1900ms" }}
          >
            DRAG THE BUBBLES — THEY ANSWER
          </p>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
          <span className="label deco-blink">▼ SCROLL</span>
        </div>
      </section>

      {/* ── stats strip ── */}
      <section className="hairline-t hairline-b relative bg-[rgba(12,10,6,0.6)]">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-[var(--line)] sm:grid-cols-4">
          <Stat v={cf.stats.entities} label="ENTITIES MAPPED" />
          <Stat v={cf.stats.hops} label="LINKS TRACED" />
          <Stat v={cf.chapters.length} label="CHAPTERS" />
          <Stat v={100} label="TELEMETRY" suffix="% OFF" />
        </div>
      </section>

      {/* ── case card ── */}
      <section className="relative px-5 py-14 sm:px-8 sm:py-20">
        <div ref={cardRef} className="mx-auto w-full max-w-3xl">
          <p className="label mb-4">
            <Scramble text="LATEST DECLASSIFICATION" duration={700} />
          </p>

          <div
            className={`panel gold-glow relative overflow-hidden p-5 fade-up sm:p-8 ${
              cardOn ? "" : "opacity-0"
            }`}
          >
            {/* stamp */}
            <div className="absolute right-4 top-4 sm:right-7 sm:top-7">
              {cardOn && <span className="stamp stamp-in">{cf.status}</span>}
            </div>

            <p className="label mb-2">
              CASE {cf.id} · {cf.chains.join(" / ")} · {cf.span}
            </p>
            <h2 className="disp text-4xl font-bold tracking-tight text-gold-hi sm:text-6xl">
              {cf.codename}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">≈$25,150 EXTRACTED</span>
              <span className="chip">$512K PEAK MCAP</span>
              <span className="chip" style={{ color: "var(--ember)" }}>
                −98.8% FROM PEAK
              </span>
            </div>

            <RedactBlock active={cardOn} delay={300} className="mt-5">
              <p className="read">{cf.summary}</p>
            </RedactBlock>

            {/* declassify progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="label">DECLASSIFIED</span>
                <span className="mono text-[11px] text-gold">{Math.max(pct, visited.length > 0 ? pct : 0)}%{pct === 0 ? " · UNOPENED" : " REVIEWED"}</span>
              </div>
              <div className="h-[3px] w-full bg-[rgba(232,193,90,0.12)]">
                <div
                  className="h-full bg-[linear-gradient(90deg,var(--gold-dim),var(--gold-hi))] transition-all duration-1000"
                  style={{ width: `${Math.max(pct, 8)}%` }}
                />
              </div>
            </div>

            <button
              className="btn btn-gold mt-7 w-full sm:w-auto"
              onClick={(e) => {
                const rip = document.createElement("span");
                rip.className = "ripple-ink";
                rip.style.left = `${e.nativeEvent.offsetX}px`;
                rip.style.top = `${e.nativeEvent.offsetY}px`;
                (e.currentTarget as HTMLElement).appendChild(rip);
                setTimeout(() => rip.remove(), 720);
                openCase();
              }}
            >
              OPEN CASE FILE ▸
            </button>
          </div>
        </div>
      </section>

      {/* ── privacy strip ── */}
      <section className="hairline-t relative px-5 py-12 text-center sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="mono text-[11px] leading-relaxed tracking-[0.2em] text-gold">
            ▣ ZERO TELEMETRY &nbsp;·&nbsp; ▣ LOCAL ARCHIVE &nbsp;·&nbsp; ▣
            NOTHING LEAVES THIS DEVICE
          </p>
          <RedactBlock active={cardOn} delay={200} className="mt-5">
            <p className="mx-auto max-w-xl text-[12.5px] leading-relaxed text-mute">
              This build reads its case data from the bundle in front of you.
              No account, no database round-trip, no analytics beacon — the
              only network request is the one that fetched this page.
            </p>
          </RedactBlock>
          <p className="label mt-10">
            TARAONCHAIN TEST BUILD · V6 · REDACTED · {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </div>
  );
}
