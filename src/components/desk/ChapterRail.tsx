"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

/* ── chapter rail — horizontal chips (mobile strip) ────────── */

export default function ChapterRail() {
  const cf = useStore((s) => s.caseFile);
  const chapter = useStore((s) => s.chapter);
  const setChapter = useStore((s) => s.setChapter);
  const box = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = box.current?.children[chapter] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [chapter]);

  return (
    <div
      ref={box}
      className="no-scrollbar absolute inset-x-0 top-12 z-20 flex gap-1.5 overflow-x-auto px-3 py-2 lg:hidden"
      style={{ background: "linear-gradient(180deg, rgba(8,7,4,0.92), rgba(8,7,4,0.65))" }}
    >
      {cf.chapters.map((c, i) => {
        const active = i === chapter;
        return (
          <button
            key={c.id}
            onClick={() => setChapter(i)}
            className="mono flex h-8 shrink-0 items-center gap-1.5 border px-2.5 text-[10px] tracking-[0.14em] transition-all"
            style={{
              borderColor: active ? "rgba(227,185,92,0.55)" : "var(--line)",
              background: active ? "rgba(227,185,92,0.1)" : "rgba(10,8,5,0.5)",
              color: active ? "var(--gold-hi)" : "var(--faint)",
            }}
            aria-label={`Chapter ${c.no}: ${c.title}`}
          >
            <span style={{ color: active ? "var(--gold)" : "var(--faint)" }}>
              {c.no}
            </span>
            <span className="max-w-[110px] truncate">{c.title}</span>
          </button>
        );
      })}
    </div>
  );
}
