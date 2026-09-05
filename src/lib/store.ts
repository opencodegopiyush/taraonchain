"use client";

import { create } from "zustand";
import type { CaseFile } from "./types";
import { CASE } from "./case-data";

/* ── v6 store — lean single-case state ───────────────────────
   the trace engine subscribes imperatively to camCmd and
   selectedNodeId; nothing re-renders per frame. */

export type View = "landing" | "desk";
export type OverlayName = "report" | "method" | null;

export interface CamCmd {
  target: [number, number, number];
  radius: number;
  phi: number;
  theta: number;
  seq: number;
}

const cam = (
  target: [number, number, number],
  radius: number,
  theta: number,
  phi: number,
): CamCmd => ({ target, radius, theta, phi, seq: ++seq });
let seq = 0;

const camOf = (cf: CaseFile, i: number) =>
  cf.chapters[Math.min(cf.chapters.length - 1, Math.max(0, i))].camera;

const LS_KEY = "t6-visited";

interface V6State {
  view: View;
  chapter: number;
  selectedNodeId: string | null;
  overlay: OverlayName;
  paused: boolean;
  visited: number[];
  camCmd: CamCmd | null;
  caseFile: CaseFile;

  openCase: () => void;
  home: () => void;
  setChapter: (i: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  recenter: () => void;
  selectNode: (id: string | null) => void;
  togglePaused: () => void;
  setOverlay: (o: OverlayName) => void;
  rehydrate: () => void;
}

export const useStore = create<V6State>((set, get) => {
  const mark = (i: number) => {
    const v = get().visited;
    if (v.includes(i)) return;
    const next = [...v, i].sort((a, b) => a - b);
    set({ visited: next });
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      /* private mode — review % just won't persist */
    }
  };

  return {
    view: "landing",
    chapter: 0,
    selectedNodeId: null,
    overlay: null,
    paused: false,
    visited: [],
    camCmd: null,
    caseFile: CASE,

    openCase: () => {
      const c = camOf(get().caseFile, 0);
      set({ view: "desk", chapter: 0, selectedNodeId: null, overlay: null, camCmd: cam(c.target, c.radius, c.theta, c.phi) });
      mark(0);
    },

    home: () =>
      set({ view: "landing", chapter: 0, selectedNodeId: null, overlay: null }),

    setChapter: (i) => {
      const s = get();
      const n = Math.min(s.caseFile.chapters.length - 1, Math.max(0, i));
      if (n === s.chapter && s.camCmd) return;
      const c = camOf(s.caseFile, n);
      set({ chapter: n, selectedNodeId: null, camCmd: cam(c.target, c.radius, c.theta, c.phi) });
      mark(n);
    },

    nextChapter: () => get().setChapter(get().chapter + 1),
    prevChapter: () => get().setChapter(get().chapter - 1),

    recenter: () => {
      const s = get();
      const c = camOf(s.caseFile, s.chapter);
      set({ selectedNodeId: null, camCmd: cam(c.target, c.radius, c.theta, c.phi) });
    },

    selectNode: (id) => set({ selectedNodeId: id }),
    togglePaused: () => set({ paused: !get().paused }),
    setOverlay: (o) => set({ overlay: o }),

    rehydrate: () => {
      try {
        const raw = window.localStorage.getItem(LS_KEY);
        if (raw) {
          const arr = JSON.parse(raw) as number[];
          if (Array.isArray(arr)) set({ visited: arr.filter((n) => typeof n === "number") });
        }
      } catch {
        /* fresh archive */
      }
    },
  };
});

export const reviewedPct = (s: { visited: number[]; caseFile: CaseFile }) =>
  Math.round((s.visited.length / Math.max(1, s.caseFile.chapters.length)) * 100);
