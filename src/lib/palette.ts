import type { NodeKind, Epistemic } from "./types";

/* ── v6 "REDACTED" palette — black & gold, nothing else ────── */

export const SCENE_BG = "#060503";

export const NODE_COLORS: Record<NodeKind, string> = {
  protocol: "#e3b95c",
  wallet: "#cfae6e",
  contract: "#a08b62",
  mixer: "#d96a4a",
  bridge: "#d9c08a",
  otc: "#b59a68",
  exchange: "#eecb69",
  cluster: "#a3937a",
  vault: "#8f846f",
};

export const EPI_COLORS: Record<Epistemic, string> = {
  observed: "#e6d9b8",
  assessed: "#e3b95c",
  unknown: "#877e6c",
};

export const EPI_LABEL: Record<Epistemic, string> = {
  observed: "OBSERVED",
  assessed: "ASSESSED",
  unknown: "UNKNOWN",
};

export const KIND_LABEL: Record<NodeKind, string> = {
  protocol: "PROTOCOL",
  wallet: "WALLET",
  contract: "CONTRACT",
  mixer: "MIXER",
  bridge: "BRIDGE",
  otc: "OTC DESK",
  exchange: "EXCHANGE",
  cluster: "CLUSTER",
  vault: "VAULT",
};

export const RISK_LABEL: Record<0 | 1 | 2 | 3, string> = {
  0: "CLEAN",
  1: "LOW",
  2: "ELEVATED",
  3: "CRITICAL",
};

export const RISK_COLORS: Record<0 | 1 | 2 | 3, string> = {
  0: "#877e6c",
  1: "#b59a68",
  2: "#d9a04a",
  3: "#e06a45",
};

export function fmtEth(n: number): string {
  /* huge aggregates read better rounded — exact figures stay on the
     edge labels via valueLabel, which is never re-formatted */
  const digits = Math.abs(n) >= 100 ? 0 : 2;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}
