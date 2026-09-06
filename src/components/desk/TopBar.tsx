"use client";

import { useStore, reviewedPct } from "@/lib/store";

/* ── top bar — wordmark · case · review % · chapter stepper ── */

export default function TopBar() {
  const home = useStore((s) => s.home);
  const cf = useStore((s) => s.caseFile);
  const chapter = useStore((s) => s.chapter);
  const next = useStore((s) => s.nextChapter);
  const prev = useStore((s) => s.prevChapter);
  const paused = useStore((s) => s.paused);
  const togglePaused = useStore((s) => s.togglePaused);
  const setOverlay = useStore((s) => s.setOverlay);
  const visited = useStore((s) => s.visited);
  const pct = Math.max(reviewedPct({ visited, caseFile: cf }), 4);
  const total = cf.chapters.length;

  return (
    <header className="panel-deep hairline-b absolute inset-x-0 top-0 z-30 flex h-12 items-center gap-1.5 px-2.5 sm:gap-3 sm:px-4">
      <button
        onClick={home}
        className="mono shrink-0 text-[10px] font-bold tracking-[0.16em] text-bone transition-colors hover:text-gold-hi sm:text-[11px] sm:tracking-[0.28em]"
        title="Back to the archive"
      >
        TARAONCHAIN
      </button>
      <span className="hidden text-faint sm:inline">│</span>
      <span className="mono shrink-0 text-[11px] tracking-[0.14em] text-mute">
        {cf.id}
      </span>
      <span className="mono shrink-0 text-[12px] font-bold tabular-nums text-gold">
        {pct}%
      </span>

      <div className="min-w-2 flex-1" />

      {/* chapter stepper */}
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          onClick={prev}
          disabled={chapter === 0}
          className="flex h-9 w-8 items-center justify-center text-[15px] text-mute transition-colors hover:text-gold-hi disabled:opacity-30"
          aria-label="Previous chapter"
        >
          ‹
        </button>
        <span className="mono w-[46px] text-center text-[11px] tabular-nums text-bone">
          {cf.chapters[chapter].no}/{total.toString().padStart(2, "0")}
        </span>
        <button
          onClick={next}
          disabled={chapter === total - 1}
          className="flex h-9 w-8 items-center justify-center text-[15px] text-mute transition-colors hover:text-gold-hi disabled:opacity-30"
          aria-label="Next chapter"
        >
          ›
        </button>
      </div>

      <button
        onClick={togglePaused}
        className="flex h-9 w-9 shrink-0 items-center justify-center border text-[11px] transition-colors"
        style={{
          borderColor: paused ? "rgba(227,185,92,0.5)" : "var(--line)",
          color: paused ? "var(--gold)" : "var(--mute)",
        }}
        aria-label={paused ? "Resume motion" : "Pause motion"}
        title={paused ? "Resume motion" : "Pause motion"}
      >
        {paused ? "▶" : "❚❚"}
      </button>

      <button
        onClick={() => setOverlay("report")}
        className="chip hidden h-9 shrink-0 cursor-pointer items-center sm:inline-flex"
        title="Open the full case file"
      >
        FILE
      </button>
    </header>
  );
}
