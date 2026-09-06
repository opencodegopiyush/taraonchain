"use client";

import { useRef } from "react";
import { useStore, reviewedPct } from "@/lib/store";
import { CASES } from "@/lib/case-data";
import type { CaseFile } from "@/lib/types";
import { TUNE, useDevice } from "@/lib/edition";
import HeroTrail from "./fx/HeroTrail";
import EvidenceCloud from "./fx/EvidenceCloud";
import Scramble from "./fx/Scramble";
import GoldWord from "./fx/GoldWord";
import { useInView, useCountUp } from "./fx/Reveal";

/* ── v12 landing — the evidence cloud is the brand ─────────
   the cloud no longer spells a case id. it forms the name
   itself — TARAONCHAIN — from living gold particles that
   assemble, scatter under your finger and spring back. no
   labels, no captions: the band is pure word + interaction.
   the platform is case-agnostic — many reports, many cases;
   SHARAV stays only as the latest declassified file below.
   all v10 rules hold: single auto-tuned build, no HOW IT
   WORKS, no case-number button, stats welded to the file,
   decrypt open. */

function Stat({ v, label, suffix }: { v: number; label: string; suffix?: string }) {
  const [ref, on] = useInView<HTMLDivElement>(0.5);
  const n = useCountUp(v, on, 900);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 px-2 py-4 text-center transition-colors duration-200"
    >
      <span className="disp text-2xl font-bold text-gold-hi sm:text-3xl">
        {n}
        {suffix}
      </span>
      <span className="label">{label}</span>
    </div>
  );
}

/* v9 decrypt word — cover-free reveal. the word is always in
   the DOM fully painted; the animation only carries it in
   (blur + rise). the gold tick beneath is decoration that
   draws then fades — it can never cover the word. */
function DecryptWord({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span
      className="relative inline-block"
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      <span className="decrypt-word inline-block">{children}</span>
      <span aria-hidden className="decrypt-tick" />
    </span>
  );
}

/* v13 — per-case card chrome: archive kicker + the one drawdown line.
   both lines are report facts, keyed by case id. */
const CARD_META: Record<string, { kicker: string; drawdown: string }> = {
  "R-0905": { kicker: "LATEST DECLASSIFICATION", drawdown: "−99.3% FROM PEAK" },
  "S-0830": { kicker: "PREVIOUSLY DECLASSIFIED", drawdown: "−98.8% FROM PEAK" },
};

/* the case file card — the WHOLE CARD is the button (v9 rule).
   stats live inside, welded to that case's own footprint. */
function CaseCard({ cf, second }: { cf: CaseFile; second?: boolean }) {
  const openCase = useStore((s) => s.openCase);
  const visited = useStore((s) => s.visited);
  const pct = reviewedPct({ visited, caseFile: cf });
  const meta = CARD_META[cf.id] ?? { kicker: "DECLASSIFIED FILE", drawdown: "" };

  const [cardRef, cardOn] = useInView<HTMLDivElement>(0.18);
  const device = useDevice();

  /* desktop: the case card tilts toward your cursor.
     transform-only (compositor-friendly), reset on leave. */
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const onCardMove = device === "desktop"
    ? (e: React.PointerEvent) => {
        const el = tiltRef.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-dy * 2.4).toFixed(2)}deg) rotateY(${(dx * 2.8).toFixed(2)}deg)`;
      }
    : undefined;
  const onCardLeave = device === "desktop"
    ? () => {
        const el = tiltRef.current;
        if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      }
    : undefined;

  const openFile = () => openCase(cf.id);

  return (
    <div ref={cardRef} className={second ? "mt-14 sm:mt-16" : undefined}>
      <p className="label mb-4">
        <Scramble text={meta.kicker} duration={650} />
      </p>

      <div
        ref={tiltRef}
        role="button"
        tabIndex={0}
        aria-label={`Open case file ${cf.id} — ${cf.codename}`}
        onClick={openFile}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFile();
          }
        }}
        onPointerMove={onCardMove}
        onPointerLeave={onCardLeave}
        className={`panel glow-pulse t4-spring relative cursor-pointer overflow-hidden p-5 fade-up sm:p-8 ${
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
          <span className="chip">{cf.amountLabel ?? cf.amountUsd}</span>
          <span className="chip">{cf.amountUsd}</span>
          <span className="chip" style={{ color: "var(--ember)" }}>
            {meta.drawdown}
          </span>
        </div>

        <p className="read mt-5">{cf.summary}</p>

        {/* footprint — the stats belong to this file, not the page */}
        <div className="hairline-t mt-7 pt-5">
          <p className="label mb-2 flex items-center gap-2">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            FOOTPRINT · MEASURED FROM CASE {cf.id} — {cf.codename}
          </p>
          <div className="grid grid-cols-2 divide-x divide-[var(--line)] sm:grid-cols-4">
            <Stat v={cf.stats.entities} label="ENTITIES MAPPED" />
            <Stat v={cf.stats.hops} label="LINKS TRACED" />
            <Stat v={cf.chapters.length} label="CHAPTERS" />
            <Stat v={100} label="TELEMETRY" suffix="% OFF" />
          </div>
        </div>

        {/* declassify progress */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">DECLASSIFIED</span>
            <span className="mono text-[11px] text-gold">
              {Math.max(pct, visited.length > 0 ? pct : 0)}%
              {pct === 0 ? " · UNOPENED" : " REVIEWED"}
            </span>
          </div>
          <div className="h-[3px] w-full overflow-hidden bg-[rgba(232,193,90,0.12)]">
            <div
              className="declassify-bar h-full bg-[linear-gradient(90deg,var(--gold-dim),var(--gold-hi))] transition-all duration-1000"
              style={{ width: `${Math.max(pct, 8)}%` }}
            />
          </div>
        </div>

        {/* the file is the button — no case-number button anymore */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="label">TAP ANYWHERE ON THE FILE TO OPEN</span>
          <span className="mono shrink-0 text-[11px] font-bold tracking-[0.18em] text-gold">
            OPEN FILE ▸
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-background">
      {/* corner chrome */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="mono text-[10px] font-bold tracking-[0.3em] text-bone">
          TARAONCHAIN
        </span>
        <span className="chip">{TUNE.chip}</span>
      </div>

      {/* ── hero — decrypt open ── */}
      <section className="scanlines relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-20 sm:px-8">
        <HeroTrail className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,7,4,0.72)_100%)]" />
        <span aria-hidden className="hero-scan" />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <p className="label mb-5 fade-up" style={{ animationDelay: "80ms" }}>
            <Scramble text="ON-CHAIN FORENSICS · CASE ARCHIVE" duration={650} />
          </p>

          <h1 className="disp font-bold leading-[0.98] tracking-tight text-ink">
            <span className="block text-[12vw] sm:text-6xl md:text-7xl">
              <DecryptWord delay={260}>EVERY</DecryptWord>{" "}
              <DecryptWord delay={400}>CHAIN</DecryptWord>
            </span>
            <span className="block text-[12vw] sm:text-6xl md:text-7xl">
              <DecryptWord delay={560}>LEAVES</DecryptWord>{" "}
              <DecryptWord delay={680}>A</DecryptWord>
            </span>
            <span className="block text-[15vw] sm:text-7xl md:text-8xl">
              <DecryptWord delay={860}>
                <GoldWord>TRAIL.</GoldWord>
              </DecryptWord>
            </span>
          </h1>

          <div className="mt-7 max-w-xl fade-up" style={{ animationDelay: "1000ms" }}>
            <p className="read text-[15px] sm:text-base">
              The mempool forgets nothing. TARAONCHAIN conducts independent
              on-chain investigations tracing wallets, reconstructing movements
              of funds, and examining the relationships hidden within public
              transaction data.
            </p>
            <p className="read mt-3 text-[15px] sm:text-base">
              Every case is built from the chain itself and documented as an
              interactive investigation — allowing the evidence, transaction
              paths, and analytical reasoning behind each finding to be
              examined directly.
            </p>
          </div>

          <p
            className="label mt-10 fade-up caret"
            style={{ animationDelay: "1300ms" }}
          >
            DRAG THE BUBBLES — THEY ANSWER
          </p>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
          <span className="label deco-blink">▼ SCROLL</span>
        </div>
      </section>

      {/* ── the name, alive — no labels, no captions ── */}
      <section className="hairline-t hairline-b relative h-[190px] overflow-hidden bg-[rgba(10,8,5,0.7)] sm:h-[240px]">
        <EvidenceCloud className="absolute inset-0 h-full w-full" />
        <span className="sr-only">TARAONCHAIN</span>
      </section>

      {/* ── the archive — every published investigation, newest first ── */}
      <section className="relative px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-3xl">
          {CASES.map((c, i) => (
            <CaseCard key={c.id} cf={c} second={i > 0} />
          ))}
        </div>
      </section>

      {/* ── privacy strip ── */}
      <section className="hairline-t relative px-5 py-12 text-center sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="mono text-[11px] leading-relaxed tracking-[0.2em] text-gold">
            ▣ ZERO TELEMETRY &nbsp;·&nbsp; ▣ LOCAL ARCHIVE &nbsp;·&nbsp; ▣
            NOTHING LEAVES THIS DEVICE
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[12.5px] leading-relaxed text-mute">
            This build reads its case data from the bundle in front of you. No
            account, no database round-trip, no analytics beacon — the only
            network request is the one that fetched this page.
          </p>
          <p className="label mt-10">
            TARAONCHAIN TEST BUILD · V13.1 · SINGLE BUILD · {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </div>
  );
}
