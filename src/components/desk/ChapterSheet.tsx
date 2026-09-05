"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { EPI_COLORS, EPI_LABEL, NODE_COLORS, KIND_LABEL } from "@/lib/palette";

/* ── chapter dossier ─────────────────────────────────────────
   mobile: drag-snap bottom sheet (peek 132 / 48dvh / 88dvh),
   paragraphs declassify with a gold sweep when expanded.
   desktop: permanent left column, same content, no drag. */

const PEEK = 132;

export default function ChapterSheet() {
  const cf = useStore((s) => s.caseFile);
  const chapter = useStore((s) => s.chapter);
  const setChapter = useStore((s) => s.setChapter);
  const next = useStore((s) => s.nextChapter);
  const prev = useStore((s) => s.prevChapter);
  const selectNode = useStore((s) => s.selectNode);
  const selected = useStore((s) => s.selectedNodeId);

  const [snap, setSnap] = useState<0 | 1 | 2>(0);
  const [dragY, setDragY] = useState<number | null>(null);
  const [vh, setVh] = useState(800);
  const startY = useRef(0);
  const drag = useRef(false);
  const moved = useRef(false);

  useEffect(() => {
    const onR = () => setVh(window.innerHeight);
    onR();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  useEffect(() => {
    setSnap(0);
    setDragY(null);
  }, [chapter]);

  const heights = [PEEK, Math.round(vh * 0.48), Math.round(vh * 0.88)];
  const ch = cf.chapters[chapter];
  const expanded = snap >= 1;

  const onDown = (e: React.PointerEvent) => {
    if (window.innerWidth >= 1024) return;
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    drag.current = true;
    moved.current = false;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = e.clientY - startY.current;
    if (Math.abs(dy) > 6) moved.current = true;
    /* clamp must stay wider than the ±snap thresholds (−48 / +62) or
       the rubber-band eats the gesture */
    setDragY(Math.max(-120, Math.min(240, dy)));
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = false;
    if (dragY !== null) {
      if (dragY > 62) setSnap((s) => Math.max(0, s - 1) as 0 | 1 | 2);
      else if (dragY < -48) setSnap((s) => Math.min(2, s + 1) as 0 | 1 | 2);
    }
    setDragY(null);
  };

  return (
    <>
      {/* ══ mobile sheet ══ */}
      <div
        className={`t4-spring absolute inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-[14px] border-t lg:hidden ${selected ? "pointer-events-none translate-y-full" : ""}`}
        style={{
          height: heights[snap],
          background: "var(--panel-deep)",
          borderColor: "var(--line-strong)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 -14px 48px rgba(3,2,1,0.66)",
          transform:
            dragY !== null ? `translateY(${dragY * 0.55}px)` : undefined,
          transition: dragY !== null ? "none" : undefined,
        }}
      >
        {/* drag handle + header */}
        <div
          className="shrink-0 cursor-grab touch-none select-none px-4 pb-3 pt-2 active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClick={() => {
            if (!moved.current && snap === 0) setSnap(1);
          }}
        >
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-[rgba(232,193,90,0.3)]" />
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] font-bold tracking-[0.2em] text-gold">
              CH {ch.no}
            </span>
            <span className="label">
              {snap === 0 ? "SWIPE ↑ TO DECLASSIFY" : `${chapter + 1} / ${cf.chapters.length}`}
            </span>
          </div>
          <p className="label mt-1.5 truncate">{ch.kicker}</p>
          <h3 className="disp mt-0.5 truncate text-[17px] font-bold text-ink">
            {ch.title}
          </h3>
        </div>

        {/* expandable body */}
        {snap > 0 && (
          <ChapterBody cf={cf} chapter={chapter} active={expanded} mobile />
        )}
      </div>

      {/* ══ desktop column ══ */}
      <aside className="panel-deep hairline-r slim-scroll absolute bottom-0 left-0 top-12 z-20 hidden w-[402px] shrink-0 flex-col overflow-y-auto lg:flex">
        <div className="px-5 pb-4 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {cf.chapters.map((c, i) => {
              const active = i === chapter;
              return (
                <button
                  key={c.id}
                  onClick={() => setChapter(i)}
                  className="mono flex h-8 items-center gap-1.5 border px-2.5 text-[10px] tracking-[0.12em] transition-all"
                  style={{
                    borderColor: active ? "rgba(227,185,92,0.55)" : "var(--line)",
                    background: active ? "rgba(227,185,92,0.1)" : "transparent",
                    color: active ? "var(--gold-hi)" : "var(--faint)",
                  }}
                >
                  <span style={{ color: active ? "var(--gold)" : undefined }}>
                    {c.no}
                  </span>
                  <span className="max-w-[96px] truncate">{c.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hairline-t px-6 py-5">
          <p className="label">{ch.kicker}</p>
          <h3 className="disp mt-1 text-[24px] font-bold leading-tight text-ink">
            {ch.title}
          </h3>
          <ChapterBody cf={cf} chapter={chapter} active desktop />
        </div>

        <div className="mt-auto flex gap-2 px-6 pb-6 pt-2">
          <button
            className="btn btn-ghost flex-1"
            onClick={prev}
            disabled={chapter === 0}
          >
            ‹ PREV
          </button>
          <button
            className="btn btn-gold flex-1"
            onClick={next}
            disabled={chapter === cf.chapters.length - 1}
          >
            NEXT ▸
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── shared body ── */
function ChapterBody({
  cf,
  chapter,
  active,
  mobile = false,
}: {
  cf: ReturnType<typeof useStore.getState>["caseFile"];
  chapter: number;
  active: boolean;
  mobile?: boolean;
}) {
  const ch = cf.chapters[chapter];
  const selectNode = useStore((s) => s.selectNode);
  const nodeIds = new Set(cf.nodes.map((n) => n.id));
  const focus = ch.focus.filter((f) => nodeIds.has(f));

  return (
    <div
      className={`slim-scroll flex-1 px-4 pb-8 ${mobile ? "overflow-y-auto pt-1" : "overflow-visible pt-4 lg:px-0"}`}
    >
      {ch.body.map((p, i) => (
        <Redact key={i} active={active} delay={i * 150}>
          <p className={`read ${mobile ? "" : "text-[15px]"}`}>{p}</p>
        </Redact>
      ))}

      {/* facts */}
      {ch.facts.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="label">FIELD NOTES</p>
          {ch.facts.map((f, i) => (
            <Redact key={i} active={active} delay={ch.body.length * 150 + i * 90}>
              <div
                className="flex gap-2.5 border-l-2 bg-[rgba(10,8,5,0.5)] px-3 py-2.5"
                style={{ borderColor: EPI_COLORS[f.epistemic] }}
              >
                <span
                  className="mono mt-0.5 shrink-0 text-[8.5px] font-bold tracking-[0.14em]"
                  style={{ color: EPI_COLORS[f.epistemic] }}
                >
                  {EPI_LABEL[f.epistemic]}
                </span>
                <p className="text-[12.5px] leading-relaxed text-bone">{f.text}</p>
              </div>
            </Redact>
          ))}
        </div>
      )}

      {/* focus entities */}
      {focus.length > 0 && (
        <div className="mt-6">
          <p className="label mb-2">ENTITIES IN THIS CHAPTER — TAP TO INSPECT</p>
          <div className="flex flex-wrap gap-1.5">
            {focus.map((id) => {
              const n = cf.nodes.find((m) => m.id === id);
              if (!n) return null;
              return (
                <button
                  key={id}
                  className="chip cursor-pointer gap-1.5 transition-colors hover:border-[rgba(232,193,90,0.5)]"
                  onClick={() => selectNode(id)}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: NODE_COLORS[n.kind] }}
                  />
                  {n.short}
                  <span className="text-faint">{KIND_LABEL[n.kind]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mobile && (
        <p className="label mt-7 text-center">— END OF CHAPTER {ch.no} —</p>
      )}
    </div>
  );
}

function Redact({
  active,
  delay,
  children,
}: {
  active: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rblock ${active ? "on sweep" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
