"use client";

import { useStore } from "@/lib/store";
import TraceCanvas from "@/engine/TraceCanvas";
import TopBar from "./TopBar";
import ChapterRail from "./ChapterRail";
import ChapterSheet from "./ChapterSheet";
import Inspector from "./Inspector";

/* ── case desk — v6 layout ───────────────────────────────────
   mobile: top bar / chapter chips / full-bleed trail canvas /
   drag-sheet + compact inspector card.
   desktop: top bar / left dossier column / canvas / right
   inspector slide-over. */

export default function CaseDesk() {
  const recenter = useStore((s) => s.recenter);
  const cf = useStore((s) => s.caseFile);

  return (
    <div className="scanlines relative h-[100dvh] overflow-hidden bg-background">
      <TopBar />
      <ChapterRail />

      {/* trace viewport — full bleed under the chrome */}
      <div className="absolute inset-x-0 bottom-0 top-[88px] lg:top-12 lg:left-[402px]">
        <TraceCanvas />

        {/* floating HUD */}
        <div className="absolute bottom-[150px] right-3 z-20 flex flex-col items-end gap-2 lg:bottom-5 lg:right-5">
          <button
            onClick={recenter}
            className="chip cursor-pointer border-[rgba(232,193,90,0.3)] px-3 py-2 transition-colors hover:border-[rgba(232,193,90,0.6)]"
            title="Re-frame this chapter"
          >
            ↺ RECENTER
          </button>
          <div className="chip flex-col !items-start gap-1 border-[rgba(232,193,90,0.18)] px-3 py-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#e6d9b8" }} />
              OBSERVED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#e3b95c" }} />
              ASSESSED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#877e6c" }} />
              UNKNOWN
            </span>
          </div>
          <span className="label hidden lg:block">
            {cf.stats.entities} ENT · {cf.stats.hops} LINKS · DRAG TO ORBIT
          </span>
        </div>

        {/* viewport title plate */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 lg:left-5 lg:top-5">
          <div className="panel px-3 py-2">
            <p className="mono text-[9px] tracking-[0.24em] text-faint">
              <span className="pulse-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--gold)] align-middle" />
              TRACE VIEWPORT · LIVE
            </p>
          </div>
        </div>
      </div>

      <ChapterSheet />
      <Inspector />
    </div>
  );
}
