"use client";

import { useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import {
  EPI_COLORS,
  EPI_LABEL,
  KIND_LABEL,
  NODE_COLORS,
  RISK_COLORS,
  RISK_LABEL,
  fmtEth,
} from "@/lib/palette";
import type { CaseEdge, CaseNode } from "@/lib/types";

/* ── entity inspector ────────────────────────────────────────
   mobile: compact bottom card (max 40dvh, no dimmer, no
   fullscreen takeover — the bubble stays on screen and the
   camera has already centered it). drag down to dismiss.
   desktop: right slide-over. */

type Tab = "overview" | "links" | "txns";

/* ── v8 copy — works on mobile + plain http ──────────────────
   navigator.clipboard only exists in secure contexts (https or
   localhost). Over LAN-IP http on a phone it is undefined, so
   the old code threw and silently gave up — the COPY button
   "did nothing". Fallback: classic execCommand('copy') via a
   throwaway textarea, which works on http and most mobile
   browsers inside the tap gesture. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function Inspector() {
  const node = useStore((s) => s.caseFile.nodes.find((n) => n.id === s.selectedNodeId));
  const cf = useStore((s) => s.caseFile);
  const close = () => useStore.getState().selectNode(null);

  if (!node) return null;
  return <Card key={node.id} node={node} cf={cf} close={close} />;
}

function Card({
  node,
  cf,
  close,
}: {
  node: CaseNode;
  cf: ReturnType<typeof useStore.getState>["caseFile"];
  close: () => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [dragY, setDragY] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const startY = useRef(0);
  const dragging = useRef(false);

  const conns = useMemo(
    () =>
      cf.edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          const otherId = e.source === node.id ? e.target : e.source;
          const other = cf.nodes.find((n) => n.id === otherId);
          const dir: "out" | "in" = e.source === node.id ? "out" : "in";
          return { e, other, dir };
        })
        .filter((r) => r.other),
    [cf, node.id],
  );

  const txs = useMemo(
    () => conns.flatMap((r) => r.e.txs.map((t) => ({ ...t, via: r.other!.short }))),
    [conns],
  );

  const [copyFail, setCopyFail] = useState<string | null>(null);

  const copy = async (text: string, tag: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(tag);
      setCopyFail(null);
      setTimeout(() => setCopied(null), 1200);
    } else {
      /* even on total failure, say so — never a dead button */
      setCopyFail(tag);
      setTimeout(() => setCopyFail(null), 1400);
    }
  };

  const onDown = (e: React.PointerEvent) => {
    if (window.innerWidth >= 1024) return;
    /* never hijack presses on buttons inside the handle zone —
       pointer capture would swallow their click */
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    dragging.current = true;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragY !== null && dragY > 56) close();
    setDragY(null);
  };

  const tabs: [Tab, string, number | null][] = [
    ["overview", "OVERVIEW", null],
    ["links", "LINKS", conns.length],
    ["txns", "TXNS", txs.length],
  ];

  return (
    <aside
      className="t4-spring absolute inset-x-0 bottom-0 z-40 flex max-h-[40dvh] flex-col overflow-hidden rounded-t-[14px] border-t lg:inset-x-auto lg:right-0 lg:top-12 lg:bottom-0 lg:max-h-none lg:w-[378px] lg:rounded-t-none lg:border-t-0 lg:border-l"
      style={{
        background: "var(--panel-deep)",
        borderColor: "var(--line-strong)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 -12px 44px rgba(3,2,1,0.65)",
        transform: dragY !== null ? `translateY(${dragY}px)` : undefined,
        transition: dragY !== null ? "none" : undefined,
      }}
    >
      {/* grab handle + header */}
      <div
        className="shrink-0 cursor-grab touch-none px-4 pb-2 pt-2 active:cursor-grabbing lg:cursor-default"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[rgba(232,193,90,0.3)] lg:hidden" />
        <div className="flex items-start justify-between gap-3">
          <span
            className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: NODE_COLORS[node.kind] }}
          />
          <h3 className="disp min-w-0 flex-1 text-[19px] font-bold leading-tight text-ink">
            {node.label}
          </h3>
          <button
            onClick={close}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[14px] text-mute transition-colors hover:text-gold-hi"
            aria-label="Close inspector"
          >
            ✕
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="chip">{KIND_LABEL[node.kind]}</span>
          <span className="chip" style={{ color: RISK_COLORS[node.risk] }}>
            RISK · {RISK_LABEL[node.risk]}
          </span>
          {node.key && (
            <span className="chip" style={{ color: "var(--gold)" }}>
              ★ KEY ENTITY
            </span>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="hairline-b flex shrink-0 gap-1 px-3">
        {tabs.map(([id, label, count]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="mono relative flex min-h-9 items-center gap-1.5 px-3 text-[10px] tracking-[0.16em] transition-colors"
              style={{ color: active ? "var(--gold-hi)" : "var(--faint)" }}
            >
              {label}
              {count !== null && (
                <span
                  className="rounded-sm px-1 text-[9px] tabular-nums"
                  style={{
                    background: active ? "rgba(227,185,92,0.16)" : "rgba(232,193,90,0.07)",
                    color: active ? "var(--gold)" : "var(--faint)",
                  }}
                >
                  {count}
                </span>
              )}
              {active && (
                <span className="absolute inset-x-2 bottom-0 h-[2px] bg-[var(--gold)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* body */}
      <div className="slim-scroll flex-1 overflow-y-auto px-4 py-4">
        {tab === "overview" && (
          <Overview node={node} copy={copy} copied={copied} copyFail={copyFail} />
        )}
        {tab === "links" && (
          <Links conns={conns} copy={copy} copied={copied} />
        )}
        {tab === "txns" && <Txns txs={txs} copy={copy} copied={copied} copyFail={copyFail} />}
      </div>
    </aside>
  );
}

function Overview({
  node,
  copy,
  copied,
  copyFail,
}: {
  node: CaseNode;
  copy: (t: string, tag: string) => void;
  copied: string | null;
  copyFail: string | null;
}) {
  const unit = node.chain.includes("SOLANA") ? "SOL" : "";
  return (
    <div className="space-y-4">
      <button
        className="mono flex w-full items-center justify-between gap-2 border bg-[rgba(10,8,5,0.5)] px-3 py-2.5 text-left transition-colors hover:border-[rgba(232,193,90,0.4)]"
        onClick={() => copy(node.address, "addr")}
      >
        <span className="truncate text-[11px] text-bone">{node.address}</span>
        <span
          className="label shrink-0"
          style={{
            color:
              copied === "addr"
                ? "var(--gold)"
                : copyFail === "addr"
                  ? "var(--ember)"
                  : undefined,
          }}
        >
          {copied === "addr" ? "COPIED ✓" : copyFail === "addr" ? "OPEN KEYBOARD TO COPY" : "COPY"}
        </span>
      </button>

      <div className="grid grid-cols-3 gap-px bg-[var(--line)]">
        {[
          ["RECEIVED", node.received],
          ["SENT", node.sent],
          ["BALANCE", node.balance],
        ].map(([l, v]) => (
          <div key={l as string} className="bg-[rgba(12,10,6,0.9)] px-1.5 py-3 text-center">
            <p className="mono text-[12px] font-bold tabular-nums text-gold-hi">
              {fmtEth(v as number)}
              <span className="ml-0.5 text-[8px] text-faint">{unit}</span>
            </p>
            <p className="label mt-1">{l as string}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="label">WINDOW</span>
        <span className="mono text-[10.5px] text-mute">
          {node.firstSeen} → {node.lastSeen}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="label">CHAIN</span>
        <span className="mono text-[10.5px] text-bone">{node.chain}</span>
      </div>

      {node.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {node.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}

      {node.note && (
        <p className="read border-l-2 border-[rgba(232,193,90,0.25)] pl-3 text-[13.5px]">
          {node.note}
        </p>
      )}

      {node.attribution && (
        <div
          className="border bg-[rgba(227,185,92,0.05)] px-3 py-3"
          style={{ borderColor: "rgba(227,185,92,0.35)" }}
        >
          <p className="label mb-1.5" style={{ color: "var(--gold)" }}>
            ATTRIBUTION · {node.attribution.confidence.toUpperCase()} CONFIDENCE
          </p>
          <p className="text-[12.5px] font-bold text-bone">{node.attribution.claim}</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-mute">
            {node.attribution.basis}
          </p>
        </div>
      )}
    </div>
  );
}

function Links({
  conns,
}: {
  conns: { e: CaseEdge; other?: CaseNode; dir: "in" | "out" }[];
  copy: (t: string, tag: string) => void;
  copied: string | null;
}) {
  const selectNode = useStore((s) => s.selectNode);
  if (conns.length === 0)
    return <p className="label py-6 text-center">NO LINKS ON RECORD</p>;
  return (
    <div className="space-y-1.5">
      {conns.map(({ e, other, dir }) => (
        <button
          key={e.id}
          onClick={() => other && selectNode(other.id)}
          className="flex w-full items-center gap-2.5 border bg-[rgba(10,8,5,0.5)] px-3 py-2.5 text-left transition-colors hover:border-[rgba(232,193,90,0.4)]"
        >
          <span
            className="mono shrink-0 text-[13px]"
            style={{ color: dir === "out" ? "var(--gold)" : EPI_COLORS[e.epistemic] }}
          >
            {dir === "out" ? "→" : "←"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="mono block truncate text-[12px] text-bone">
              {other?.short}
            </span>
            <span className="label">{KIND_LABEL[other!.kind]} · {EPI_LABEL[e.epistemic]}</span>
          </span>
          <span className="mono shrink-0 text-[11px] tabular-nums text-mute">
            {e.valueLabel ?? `${fmtEth(e.value)} SOL`}
          </span>
        </button>
      ))}
    </div>
  );
}

function Txns({
  txs,
  copy,
  copied,
  copyFail,
}: {
  txs: { hash: string; ts: string; value: number; chain: string; kind: string; via: string }[];
  copy: (t: string, tag: string) => void;
  copied: string | null;
  copyFail: string | null;
}) {
  if (txs.length === 0)
    return <p className="label py-6 text-center">NO TRANSACTIONS ON RECORD</p>;
  return (
    <div className="space-y-1.5">
      {txs.map((t, i) => (
        <button
          key={`${t.hash}-${i}`}
          onClick={() => copy(t.hash, `tx${i}`)}
          className="block w-full border bg-[rgba(10,8,5,0.5)] px-3 py-2.5 text-left transition-colors hover:border-[rgba(232,193,90,0.4)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="mono truncate text-[11px] text-bone">
              {t.hash.slice(0, 10)}…{t.hash.slice(-8)}
            </span>
            <span
              className="label shrink-0"
              style={{
                color:
                  copied === `tx${i}`
                    ? "var(--gold)"
                    : copyFail === `tx${i}`
                      ? "var(--ember)"
                      : undefined,
              }}
            >
              {copied === `tx${i}` ? "COPIED ✓" : copyFail === `tx${i}` ? "COPY ✕" : "COPY"}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="mono text-[10.5px] text-gold">
              {fmtEth(t.value)} SOL → {t.via}
            </span>
            <span className="label">{t.ts}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
