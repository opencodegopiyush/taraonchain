/* ── the BABITA investigation — compiled from the real on-chain report ──
   every entity, address, figure, timestamp and claim below comes verbatim
   from the FINAL INVESTIGATION REPORT v3.0 (Babita Singh Cancer Fundraiser
   — "On-Chain Audit — Strict Post-Live Window", report generated 2026-09-15
   UTC, investigation window 2026-09-13 12:43:31 UTC → 2026-09-15 ~06:30 UTC,
   ~41.5 hours). NOTHING outside the pasted report is used or fabricated.
   Verification stack per the report: Alchemy Solana + Ethereum mainnet
   RPCs, Blockscout REST API (native ETH transfer history), X post metadata
   for the post-live timestamp — ~250+ calls, fully reproducible.

   FIRST dual-chain case: figures are DOLLARIZED (report prices: SOL $165,
   ETH $2,500, USDC/USDT $1; exchange rate 1 USD = 100 INR per request),
   so the case unit is USD. 60 entities · 59 links · 8 chapters. */

import { buildDossier, type DraftCase } from "./dossier";
import type { CaseEdge, CaseNode, DossierFile, DossierGraph, Epistemic } from "./types";

const SOL = "SOLANA";
const ETH = "ETHEREUM";

const pad2 = (n: number) => String(n).padStart(2, "0");
const ethId = (i: number) => `E${pad2(i + 1)}`;
const solId = (i: number) => `S0${i + 1}`;
const inr = (n: number) => n.toLocaleString("en-US");

/* ── the 4 Solana post-live donors — report §SOLANA, verbatim ── */
const SOL_DONORS: {
  addr: string; usd: number; usdText: string; inrText: string; sol: string; remark?: string;
}[] = [
  { addr: "EQbPkVih…qzExmW", usd: 8228.13, usdText: "$8,228.13", inrText: "₹8,22,813", sol: "49.8675 SOL", remark: "FIRST POST-LIVE DONATION · 2026-09-13 13:35:40 UTC · LIKELY THE FAMILY'S PRIMARY ANGEL DONOR" },
  { addr: "B48kNVXs…DeKAAn", usd: 90.84, usdText: "$90.84", inrText: "₹9,084", sol: "0.5506 SOL" },
  { addr: "H5gmnqFn…g1gxya", usd: 29.41, usdText: "$29.41", inrText: "₹2,941", sol: "0.1783 SOL" },
  { addr: "HHF4pHuK…XMFSy2", usd: 8.51, usdText: "$8.51", inrText: "₹851", sol: "0.0516 SOL" },
];

/* ── the 48 Ethereum post-live donors — report §ETHEREUM, sorted by
   USD value exactly as printed. addr/usd/tok verbatim; remarks carry
   the report's own timeline annotations. ── */
const ETH_DONORS: {
  addr: string; usd: number; usdText: string; tok: string; remark?: string;
}[] = [
  { addr: "0x64cdaa89…109a53", usd: 6000.00, usdText: "$6,000.00", tok: "6,000.00 USDT", remark: "LARGEST USDT DONATION (WHALE) · 2026-09-14 18:25:59 UTC" },
  { addr: "0xf70da978…a3dbef", usd: 5994.16, usdText: "$5,994.16", tok: "5,994.16 USDC", remark: "LARGEST USDC DONATION (WHALE) · 2026-09-14 20:14:47 UTC · SAME ON-CHAIN ADDRESS AS THE SLINK FUNDING ROOT IN CASE R-0905" },
  { addr: "0x4e5b2e1d…7e972f", usd: 500.47, usdText: "$500.47", tok: "500.47 USDT", remark: "2026-09-13 17:24 UTC" },
  { addr: "0x9d727911…4b5596", usd: 500.00, usdText: "$500.00", tok: "500.00 USDT", remark: "LARGEST USDT DONATION OF SEPT 13–14 MORNING · 2026-09-14 09:32:47 UTC" },
  { addr: "0x51ea2590…d66323", usd: 300.00, usdText: "$300.00", tok: "300.00 USDC", remark: "MOST RECENT DONATION (AS OF REPORT) · 2026-09-15 05:46:11 UTC" },
  { addr: "0x007f655a…d66323", usd: 300.00, usdText: "$300.00", tok: "300.00 USDC", remark: "2026-09-15 05:39 UTC" },
  { addr: "0x34568cb6…bde77c", usd: 199.02, usdText: "$199.02", tok: "0.0796 ETH", remark: "LARGEST ETH DONATION · 2026-09-14 10:59:47 UTC" },
  { addr: "0x4dc720d4…d56764", usd: 115.98, usdText: "$115.98", tok: "0.0464 ETH", remark: "2026-09-14 09:45 UTC" },
  { addr: "0x22a1ae5c…c41d9e", usd: 100.00, usdText: "$100.00", tok: "0.0400 ETH", remark: "2026-09-14 10:02 UTC" },
  { addr: "0x0fdf3a16…68bad8", usd: 100.00, usdText: "$100.00", tok: "100.00 USDC" },
  { addr: "0x394997de…7fdaa6", usd: 100.00, usdText: "$100.00", tok: "100.00 USDT" },
  { addr: "0x8e79742a…ad0280", usd: 100.00, usdText: "$100.00", tok: "100.00 USDT" },
  { addr: "0x274a434f…67f3c8", usd: 99.12, usdText: "$99.12", tok: "0.0397 ETH" },
  { addr: "0x93ce6a68…f82522", usd: 69.00, usdText: "$69.00", tok: "69.00 USDT" },
  { addr: "0xc9e6d5d0…5eb860", usd: 57.69, usdText: "$57.69", tok: "0.0231 ETH" },
  { addr: "0x00c08c44…7edead", usd: 50.00, usdText: "$50.00", tok: "0.0200 ETH" },
  { addr: "0x017e1f81…0b4bf0", usd: 50.00, usdText: "$50.00", tok: "0.0200 ETH" },
  { addr: "0xdad29981…0a1fd8", usd: 50.00, usdText: "$50.00", tok: "0.0200 ETH" },
  { addr: "0x2cff890f…302680", usd: 50.00, usdText: "$50.00", tok: "50.00 USDT" },
  { addr: "0xd875d8b2…e79587", usd: 50.00, usdText: "$50.00", tok: "50.00 USDC" },
  { addr: "0xa56511f6…f147d4", usd: 50.00, usdText: "$50.00", tok: "50.00 USDC" },
  { addr: "0x8fd1db3a…f147d4", usd: 50.00, usdText: "$50.00", tok: "50.00 USDC" },
  { addr: "0x0df83462…9077ef", usd: 50.00, usdText: "$50.00", tok: "50.00 USDT" },
  { addr: "0x370a7e2d…3012cf", usd: 37.31, usdText: "$37.31", tok: "0.0149 ETH" },
  { addr: "0xf95e536a…541a85", usd: 31.25, usdText: "$31.25", tok: "0.0125 ETH" },
  { addr: "0xf99687d5…ac395e", usd: 25.28, usdText: "$25.28", tok: "25.28 USDC" },
  { addr: "0x3a682ad9…960062", usd: 25.00, usdText: "$25.00", tok: "0.0100 ETH" },
  { addr: "0x0dee77c8…f6ad83", usd: 25.00, usdText: "$25.00", tok: "25.00 USDC" },
  { addr: "0x11f81bf5…e6f3da", usd: 25.00, usdText: "$25.00", tok: "25.00 USDC" },
  { addr: "0xf0d62105…8ce6f4", usd: 20.88, usdText: "$20.88", tok: "20.88 USDC" },
  { addr: "0x30b8ddca…2fb38f", usd: 20.01, usdText: "$20.01", tok: "20.01 USDT" },
  { addr: "0x9210ce53…4fb38f", usd: 20.01, usdText: "$20.01", tok: "20.01 USDT", remark: "2ND DONATION OVERALL · 2026-09-13 13:49:47 UTC" },
  { addr: "0xbe5dca55…1aff82", usd: 20.00, usdText: "$20.00", tok: "0.0080 ETH" },
  { addr: "0x2e92234e…abd306", usd: 20.00, usdText: "$20.00", tok: "0.0080 ETH" },
  { addr: "0x09f54def…7e2187", usd: 20.00, usdText: "$20.00", tok: "20.00 USDC" },
  { addr: "0x5caa2b55…c32cf2", usd: 19.94, usdText: "$19.94", tok: "19.94 USDT" },
  { addr: "0x9cf5a7fb…cdc947", usd: 16.06, usdText: "$16.06", tok: "16.06 USDT" },
  { addr: "0x83c25942…f0628e", usd: 15.00, usdText: "$15.00", tok: "0.0060 ETH" },
  { addr: "0xf07af88a…f68e09", usd: 11.38, usdText: "$11.38", tok: "0.0046 ETH" },
  { addr: "0xe0935f2f…8c5d2d", usd: 11.00, usdText: "$11.00", tok: "11.00 USDT" },
  { addr: "0xf8c7572e…46a446", usd: 10.00, usdText: "$10.00", tok: "0.0040 ETH" },
  { addr: "0xbc874437…5629c3", usd: 10.00, usdText: "$10.00", tok: "0.0040 ETH" },
  { addr: "0x2744dfd9…87a22b", usd: 10.00, usdText: "$10.00", tok: "10.00 USDC" },
  { addr: "0xda31721f…15c495", usd: 9.76, usdText: "$9.76", tok: "9.76 USDC" },
  { addr: "0x5c6516f5…59d6f8", usd: 7.50, usdText: "$7.50", tok: "0.0030 ETH" },
  { addr: "0x00ba1767…97ba97", usd: 7.00, usdText: "$7.00", tok: "0.0028 ETH", remark: "FIRST ETH DONATION · 2026-09-13 18:15:47 UTC" },
  { addr: "0x64b9fbeb…647741", usd: 2.00, usdText: "$2.00", tok: "2.00 USDC", remark: "FIRST POST-LIVE DONATION ON ETHEREUM · 2026-09-13 13:33:59 UTC" },
  { addr: "0xae5497c7…390b5d", usd: 0, usdText: "$0.00", tok: "5.00 SEED", remark: "SPAM TOKEN · ~$0 REAL VALUE · IGNORED IN TOTALS" },
];

/* donor bubble size — log scale on USD: $2 → 0.7, $6,000 → 1.9 */
function donorSize(usd: number): number {
  if (usd <= 0) return 0.55;
  const lo = Math.log(2);
  const hi = Math.log(6000);
  return +(0.7 + 1.2 * ((Math.log(usd) - lo) / (hi - lo))).toFixed(3);
}

/* ranked arc, left → right = biggest → smallest gift; the middle of the
   arc bows toward the camera and the ends lift, so the crowd reads as a
   stage under the Ethereum wallet — the SLINK move, at double capacity */
function ethDonorPos(i: number): [number, number, number] {
  const t = (i - 23.5) / 23.5;
  return [-4 + i * (34 / 47), -4 + 2.2 * t * t, 10.5 - 4.0 * t * t];
}
/* the four Solana gifts descend like a stair from the angel */
function solDonorPos(i: number): [number, number, number] {
  return [-24.5 + i * 3.2, 6.5 + i * 1.1, 4 - i * 1.5];
}

/* ── structural entities — the post, the two subject wallets, the outflow ── */
const STRUCTURAL: CaseNode[] = [
  { id: "POST", label: "The X post — @Unfortunate_95 (Web3LORD)", short: "POST", kind: "protocol", address: "x.com/Unfortunate_95/status/2099116765523661090", chain: "X", firstSeen: "SEP 13 2026", lastSeen: "SEP 13 2026", received: 0, sent: 0, balance: 0, risk: 0, tags: ["POST LIVE 2026-09-13 12:43:31 UTC", "18:13:31 IST", "VIRAL"], note: "The fundraiser post went live on X at 2026-09-13 12:43:31 UTC (18:13:31 IST), posted by @Unfortunate_95 (Web3LORD). Verified via X post metadata (publishedTime: 2026-09-13T12:43:31.000Z). Everything in this case is filtered STRICTLY to on-chain activity after this timestamp.", pos: [-2, 9.5, -2], size: 1.15 },
  { id: "SOLW", label: "Babita Singh — Solana donation wallet", short: "SOLW", kind: "wallet", address: "HwJMgrHnGnDLvWhD8wVPMh6FVCmsHiGJrVRywrLp1hsH", chain: SOL, firstSeen: "SEP 13 2026", lastSeen: "SEP 14 2026", received: 8356.89, sent: 0, balance: 2005.80, risk: 0, tags: [SOL, "SUBJECT WALLET", "VERIFIED", "117 POST-LIVE TXS"], note: "Received $8,356.89 (₹8,35,689.47) post-live across 117 transactions — 50.65 SOL from 4 unique donors, no USDC/USDT post-live. Last post-live donation Sep 14 22:54:57 UTC. Current balance: 10.4230 SOL (~$1,719.79) + 5.00 USDC + 281.01 USDT (~$286) — the stablecoin balances are PRE-post-live, donated during a year of prior fundraising. ~$0 outgoing traced in this window.", pos: [-16, 2.5, 2], size: 1.5 },
  { id: "ETHW", label: "Babita Singh — Ethereum donation wallet", short: "ETHW", kind: "wallet", address: "0x99Fd581d47213b00b035b95b32deD0cE241902B2", chain: ETH, firstSeen: "SEP 13 2026", lastSeen: "SEP 15 2026", received: 15354.82, sent: 19744.36, balance: 141, risk: 0, tags: [ETH, "SUBJECT WALLET", "VERIFIED", "64.7% OF FUNDS"], note: "Received $15,354.82 (₹15,35,481.98) post-live — 0.3665 ETH (~$916.25) + 6,982.09 USDC + 7,456.49 USDT across 28 incoming transactions and 48 unique donors (43 ERC-20 transfers total). Forwarded $19,744.36 (₹19,74,436.13) — 83.3% of everything raised — to likely exchange deposit addresses for INR conversion. Current balance 0.0563 ETH (~$141, mixed pre/post).", pos: [14, 1.5, 2], size: 1.7 },
  { id: "EX1", label: "Likely exchange deposit A — Indian VDA pattern", short: "EX1", kind: "exchange", address: "0x5ad9f4d8211a…3991af", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 15 2026", received: 9960, sent: 0, balance: 0, risk: 0, tags: [ETH, "≈$9,960+ RECEIVED", "LIKELY COINDCX/WAZIRX/BITBNS"], note: "Received $9,960+ in USDT+USDC+ETH — the largest outflow target. Deposits: 0.14 ETH ($350) at 11:09:47, a 1.00 USDT test at 14:48:35 followed by 750.00 USDT 84 seconds later, 6,000.00 USDT at 19:04:23, then 500.00 and 2,500.00 USDC on Sep 15 06:26–06:27. Multiple deposits to the same address over 24 hours is the standard Indian VDA exchange (CoinDCX/WazirX/Giottus/Bitbns) pattern for INR conversion.", pos: [26, 7, -4], size: 1.25 },
  { id: "EX2", label: "Likely exchange deposit B — second venue or account", short: "EX2", kind: "exchange", address: "0x5ada439b9a45…df91af", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 15 2026", received: 8500, sent: 0, balance: 0, risk: 0, tags: [ETH, "≈$8,500+ RECEIVED", "SECOND EXCHANGE OR ACCOUNT"], note: "Received $8,500+ in USDT+USDC. The 6,000.00 USDT whale donation arrived at the Ethereum wallet at 18:25:59 and was forwarded here as a paired deposit at 19:04:35 — 12 seconds after deposit A received its own 6,000.00 USDT. Also received 500.00 and 2,500.00 USDC on Sep 15 06:26:23 / 06:27:59.", pos: [30.5, 4.5, -6], size: 1.15 },
  { id: "EX3", label: "Likely exchange deposit C — marked \u201cdeposit\u201d", short: "EX3", kind: "exchange", address: "0x4fef9d741011…dd47df", chain: ETH, firstSeen: "SEP 15 2026", lastSeen: "SEP 15 2026", received: 423.54, sent: 0, balance: 0, risk: 0, tags: [ETH, "0.1694 ETH"], note: "Received 0.1694 ETH ($423.54 / ₹42,354) at 2026-09-15 05:08:47 UTC, marked as \u201cdeposit\u201d — likely another exchange deposit address.", pos: [23, 10.5, -6], size: 0.85 },
  { id: "OUT1", label: "Outflow — smaller transfer (USDT)", short: "OUT1", kind: "wallet", address: "0x6f75b4de6bc9…35be61", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 14 2026", received: 109.91, sent: 0, balance: 0, risk: 0, tags: [ETH, "109.91 USDT"], note: "Received 109.91 USDT from the Ethereum wallet at 2026-09-14 18:08:23 UTC — one of the two smaller transfers alongside the exchange deposits.", pos: [19, 12, -7], size: 0.75 },
  { id: "OUT2", label: "Outflow — smaller transfer (USDC)", short: "OUT2", kind: "wallet", address: "0xcd7b56d001f5…082eb1", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 14 2026", received: 109.91, sent: 0, balance: 0, risk: 0, tags: [ETH, "109.91 USDC"], note: "Received 109.91 USDC from the Ethereum wallet at 2026-09-14 18:13:59 UTC — one of the two smaller transfers alongside the exchange deposits.", pos: [27.5, 12.5, -7], size: 0.75 },
];

/* ── donor nodes — each wallet its own bubble, ranked by USD ── */
const solDonorNodes: CaseNode[] = SOL_DONORS.map((d, i) => ({
  id: solId(i),
  label: `Solana donor ${solId(i)} — ${d.usdText} (${d.sol})`,
  short: solId(i),
  kind: "wallet" as const,
  address: d.addr,
  chain: SOL,
  firstSeen: "SEP 13 2026",
  lastSeen: "SEP 14 2026",
  received: 0,
  sent: d.usd,
  balance: 0,
  risk: 0,
  tags: [SOL, "POST-LIVE DONOR", d.usdText],
  note: `Donated ${d.sol} (${d.usdText} / ${d.inrText}) post-live.${d.remark ? ` · ${d.remark}` : ""}`,
  pos: solDonorPos(i),
  size: i === 0 ? 2.05 : i === 1 ? 1.05 : i === 2 ? 0.9 : 0.8,
  key: i === 0,
}));

const ethDonorNodes: CaseNode[] = ETH_DONORS.map((d, i) => ({
  id: ethId(i),
  label: `Ethereum donor ${ethId(i)} — ${d.usdText} (${d.tok})`,
  short: ethId(i),
  kind: "wallet" as const,
  address: d.addr,
  chain: ETH,
  firstSeen: "SEP 13 2026",
  lastSeen: "SEP 15 2026",
  received: 0,
  sent: d.usd,
  balance: 0,
  risk: 0,
  tags: [ETH, "POST-LIVE DONOR", d.usdText],
  note: `Donated ${d.tok} (${d.usdText}) post-live, ranked #${i + 1} of 48 by USD value.${d.remark ? ` · ${d.remark}` : ""}`,
  pos: ethDonorPos(i),
  size: donorSize(d.usd),
}));

/* ── edges — donors → wallets, wallets → outflow, post → wallets ── */
const donorEdges: CaseEdge[] = [
  ...SOL_DONORS.map((d, i) => ({
    id: `e-${solId(i)}`, source: solId(i), target: "SOLW",
    value: d.usd, epistemic: "observed" as Epistemic,
    basis: `${d.sol} · ${d.usdText} / ${d.inrText}${d.remark ? ` · ${d.remark}` : ""}`,
    channel: "direct" as const, txs: [],
    valueLabel: `${d.sol} · ${d.usdText}`,
  })),
  ...ETH_DONORS.map((d, i) => ({
    id: `e-${ethId(i)}`, source: ethId(i), target: "ETHW",
    value: d.usd, epistemic: "observed" as Epistemic,
    basis: `${d.tok} · ${d.usdText}${d.remark ? ` · ${d.remark}` : ""}`,
    channel: "direct" as const, txs: [],
    valueLabel: i === 47 ? `${d.tok} · SPAM ~$0` : `${d.tok} · ${d.usdText}`,
  })),
];

const infraEdges: CaseEdge[] = [
  { id: "e-POST-S", source: "POST", target: "SOLW", value: 8356.89, epistemic: "assessed", basis: "The viral X post drove the fundraising spike — assessed, not a transfer", channel: "direct", txs: [], valueLabel: "POST LIVE 12:43:31 UTC" },
  { id: "e-POST-E", source: "POST", target: "ETHW", value: 15354.82, epistemic: "assessed", basis: "The viral X post drove the fundraising spike — assessed, not a transfer", channel: "direct", txs: [], valueLabel: "POST LIVE 12:43:31 UTC" },
  { id: "e-EX1", source: "ETHW", target: "EX1", value: 9960, epistemic: "observed", basis: "≈$9,960+ across 6 deposits: 0.14 ETH ($350) · 1.00 USDT test · 750 USDT · 6,000 USDT · 500 USDC · 2,500 USDC", channel: "direct", txs: [], valueLabel: "≈$9,960+ IN" },
  { id: "e-EX2", source: "ETHW", target: "EX2", value: 8500, epistemic: "observed", basis: "≈$8,500+ across 3 deposits: 6,000 USDT (whale forward, 39 min after arrival) · 500 USDC · 2,500 USDC", channel: "direct", txs: [], valueLabel: "≈$8,500+ IN" },
  { id: "e-EX3", source: "ETHW", target: "EX3", value: 423.54, epistemic: "observed", basis: "0.1694 ETH ($423.54) marked \u201cdeposit\u201d · 2026-09-15 05:08:47 UTC", channel: "direct", txs: [], valueLabel: "0.1694 ETH · $423.54" },
  { id: "e-OUT1", source: "ETHW", target: "OUT1", value: 109.91, epistemic: "observed", basis: "109.91 USDT · 2026-09-14 18:08:23 UTC · smaller transfer", channel: "direct", txs: [], valueLabel: "109.91 USDT" },
  { id: "e-OUT2", source: "ETHW", target: "OUT2", value: 109.91, epistemic: "observed", basis: "109.91 USDC · 2026-09-14 18:13:59 UTC · smaller transfer", channel: "direct", txs: [], valueLabel: "109.91 USDC" },
];

/* active story edges per chapter — everything else renders faint */
const topDonors = ["e-S01", "e-E01", "e-E02"];
const GRAPH: DossierGraph = {
  nodes: [...STRUCTURAL, ...solDonorNodes, ...ethDonorNodes],
  edges: [...infraEdges, ...donorEdges],
  chapterEdges: [
    /* 01 the appeal */ ["e-POST-S", "e-POST-E"],
    /* 02 first signal */ ["e-E47", "e-S01", "e-E32", "e-E46"],
    /* 03 the angel */ ["e-S01", "e-S02", "e-S03", "e-S04"],
    /* 04 the crowd */ ETH_DONORS.map((_, i) => `e-${ethId(i)}`),
    /* 05 the whales */ topDonors,
    /* 06 the ledger */ ["e-S01", ...ETH_DONORS.slice(0, 10).map((_, i) => `e-${ethId(i)}`)],
    /* 07 the outflow */ ["e-EX1", "e-EX2", "e-EX3", "e-OUT1", "e-OUT2"],
    /* 08 forty-one hours */ ["e-POST-S", "e-POST-E", "e-S01", "e-E01", "e-E02", "e-EX1", "e-EX2"],
  ],
  chapterCams: [
    { target: [3, 2, 2], radius: 46, theta: 1.45, phi: 1.08 },
    { target: [0, 3, 3], radius: 38, theta: 1.38, phi: 1.1 },
    { target: [-20, 6.5, 2], radius: 17, theta: 1.32, phi: 1.12 },
    { target: [13, -1.5, 6], radius: 32, theta: 1.5, phi: 1.15 },
    { target: [-6, 0.5, 4], radius: 30, theta: 1.4, phi: 1.1 },
    { target: [5, 0, 4], radius: 36, theta: 1.52, phi: 1.06 },
    { target: [23, 7, -3], radius: 24, theta: 1.52, phi: 1.05 },
    { target: [3, 2, 2], radius: 46, theta: 1.6, phi: 1.05 },
  ],
};

const draft: DraftCase = {
  id: "B-0913",
  codename: "BABITA",
  status: "MONITORING",
  victim: "Babita Singh — Stage 4 colon cancer (patient)",
  chains: "SOLANA, ETHEREUM",
  amountText: "≈$23,711.71 RAISED IN 41.5 HOURS",
  amountUsd: "$23,711.71",
  span: "SEP 13 — SEP 15 2026",
  updated: "2026-09-15",
  progress: "100",
  unit: "USD",
  summary:
    "A cancer fundraiser for Babita Singh went live on X at 12:43:31 UTC on September 13, 2026 — asking for ₹10,00,000 (~$10,000) toward Stage 4 colon cancer treatment after ₹38,00,000+ already spent on prior care. In ~41.5 hours, 52 unique donors sent $23,711.71 (₹23,71,171.45) to two verified wallets — $8,356.89 on Solana, $15,354.82 on Ethereum — 2.37× the stated goal. Three wallets carried 85.3% of the total, 94% of the Ethereum-side value arrived in stablecoins, and $19,744.36 (83.3%) was swept to likely Indian VDA exchange deposit addresses for INR conversion — consistent with urgent hospital bills. The strict post-live audit finds no red flags: no mixers, no suspicious consolidations, and spending that matches the appeal.",
  method:
    "All data collected via Alchemy RPCs (Solana mainnet + Ethereum mainnet) and the Blockscout REST API for native ETH transfer history — no paid indexers, no keys beyond Alchemy free tier. Solana: getBalance, getSignaturesForAddress (limit 1000), getTransaction (maxSupportedTransactionVersion=1), getTokenAccountsByOwner. Ethereum: eth_getBalance, eth_getTransactionCount, eth_blockNumber. Blockscout: GET /addresses/{addr}/transactions and /token-transfers — the workaround for native ETH transfers, which eth_getLogs cannot see. Post-live timestamp verified via X post metadata (publishedTime 2026-09-13T12:43:31.000Z); all 134 Solana txs and all 43 Ethereum txs fetched, filtered to the 117 / 28 post-live, and aggregated into a per-sender donor ledger. Prices: SOL $165, ETH $2,500, USDC/USDT $1; exchange rate 1 USD = 100 INR (user-specified). ~250+ calls; every figure reproducible from the documented endpoints.",
  limitations:
    "Solana getSignaturesForAddress returns the last 1000 transactions — the wallet holds 134, well within limit. Some Solana inner-instruction token transfers may have been missed in the initial pass (the USDT balance gap suggests this). Donor wallet histories — where donors' funds came from before sending — were NOT traced and would require additional queries. Current wallet balances include BOTH pre- and post-live funds: the Solana wallet's 5.00 USDC + 281.01 USDT predate the post, and the Ethereum wallet's 0.0563 ETH is mixed — the post-live-only spendable figure is ≈$3,967.35 (₹3,96,735.32).",
  nextSteps:
    "Watch exchange deposit A (0x5ad9f4d8…) and B (0x5ada439b…) for completed INR off-ramp\nMonitor both wallets for further post-live donations and spending\nReconcile the Solana inner-instruction USDT gap flagged in the report",
  sourceNote:
    "Compiled by taraonchain from FINAL INVESTIGATION REPORT v3.0 (Babita Singh Cancer Fundraiser — strict post-live window). Post-live window 2026-09-13 12:43:31 UTC → 2026-09-15 ~06:30 UTC (~41.5 hours). All addresses, balances and transfer events verifiable on-chain via the documented Alchemy RPCs + Blockscout REST API. Report generated 2026-09-15 (UTC). Exchange rate 1 USD = 100 INR.",
  assetRows: [
    { loc: "SOLANA WALLET", amt: "10.4230 SOL + 5.00 USDC + 281.01 USDT (≈$2,006)", state: "CURRENT BALANCE · INCLUDES PRE-LIVE FUNDS", tone: "fact" },
    { loc: "ETHEREUM WALLET", amt: "0.0563 ETH (≈$141)", state: "CURRENT BALANCE · MIXED PRE/POST", tone: "fact" },
    { loc: "EXCHANGE DEPOSIT A", amt: "≈$9,960+ (USDT+USDC+ETH)", state: "LIKELY INDIAN VDA EXCHANGE PATTERN", tone: "assess" },
    { loc: "EXCHANGE DEPOSIT B", amt: "≈$8,500+ (USDT+USDC)", state: "LIKELY SECOND EXCHANGE OR ACCOUNT", tone: "assess" },
    { loc: "STILL HELD (POST-LIVE)", amt: "≈$3,967.35 (₹3,96,735)", state: "POST-LIVE DONATIONS NOT YET SWEPT", tone: "fact" },
    { loc: "SPAM TOKENS OUT", amt: "6,000 5DT + 500 5DC", state: "FAKE CLONES · ~$0 · EXCLUDED FROM TOTALS", tone: "unknown" },
  ],
  entities: [
    ...STRUCTURAL.map((n) => ({ label: n.label, short: n.short, kind: n.kind, chain: n.chain, note: n.note ?? "" })),
    ...SOL_DONORS.map((d, i) => ({
      label: `Solana donor ${solId(i)} — ${d.usdText} (${d.sol})`,
      short: solId(i),
      kind: "wallet" as const,
      chain: SOL,
      note: `Donated ${d.sol} (${d.usdText} / ${d.inrText}) post-live.${d.remark ? ` · ${d.remark}` : ""}`,
    })),
    ...ETH_DONORS.map((d, i) => ({
      label: `Ethereum donor ${ethId(i)} — ${d.usdText} (${d.tok})`,
      short: ethId(i),
      kind: "wallet" as const,
      chain: ETH,
      note: `Donated ${d.tok} (${d.usdText}) post-live, ranked #${i + 1} of 48 by USD value.${d.remark ? ` · ${d.remark}` : ""}`,
    })),
  ],
  connections: [
    { from: "POST", to: "SOLW", value: "POST LIVE 12:43:31 UTC", channel: "direct", epistemic: "assessed", basis: "The viral X post drove the fundraising spike — assessed, not a transfer", when: "2026-09-13 12:43:31 UTC", txHash: "" },
    { from: "POST", to: "ETHW", value: "POST LIVE 12:43:31 UTC", channel: "direct", epistemic: "assessed", basis: "The viral X post drove the fundraising spike — assessed, not a transfer", when: "2026-09-13 12:43:31 UTC", txHash: "" },
    ...SOL_DONORS.map((d, i) => ({ from: solId(i), to: "SOLW", value: `${d.sol} (${d.usdText})`, channel: "direct" as const, epistemic: "observed" as Epistemic, basis: d.remark ?? "", when: i === 0 ? "2026-09-13 13:35:40 UTC" : "", txHash: "" })),
    ...ETH_DONORS.map((d, i) => ({ from: ethId(i), to: "ETHW", value: `${d.tok} (${d.usdText})`, channel: "direct" as const, epistemic: "observed" as Epistemic, basis: d.remark ?? "", when: "", txHash: "" })),
    { from: "ETHW", to: "EX1", value: "≈$9,960+ (USDT+USDC+ETH)", channel: "direct", epistemic: "observed", basis: "0.14 ETH ($350) · 1.00 USDT test · 750 USDT · 6,000 USDT · 500 USDC · 2,500 USDC — likely Indian VDA exchange deposit", when: "SEP 14 11:09 — SEP 15 06:27 UTC", txHash: "" },
    { from: "ETHW", to: "EX2", value: "≈$8,500+ (USDT+USDC)", channel: "direct", epistemic: "observed", basis: "6,000 USDT (whale forward) · 500 USDC · 2,500 USDC — likely second exchange or account", when: "SEP 14 19:04 — SEP 15 06:27 UTC", txHash: "" },
    { from: "ETHW", to: "EX3", value: "0.1694 ETH ($423.54)", channel: "direct", epistemic: "observed", basis: "Marked as \u201cdeposit\u201d — likely another exchange deposit", when: "2026-09-15 05:08:47 UTC", txHash: "" },
    { from: "ETHW", to: "OUT1", value: "109.91 USDT", channel: "direct", epistemic: "observed", basis: "Smaller transfer", when: "2026-09-14 18:08:23 UTC", txHash: "" },
    { from: "ETHW", to: "OUT2", value: "109.91 USDC", channel: "direct", epistemic: "observed", basis: "Smaller transfer", when: "2026-09-14 18:13:59 UTC", txHash: "" },
  ],
  chapters: [
    {
      kicker: "The appeal",
      title: "A fundraiser for Babita Singh",
      body:
        "At 12:43:31 UTC on September 13, 2026 — 18:13:31 IST — a post went live on X from @Unfortunate_95 (Web3LORD): an appeal for Babita Singh, fighting Stage 4 colon cancer (recurrence). The family's appeal records ₹38,00,000+ already spent on prior treatment. This round asked for ₹10,00,000 — about $10,000.\n\nTwo crypto wallets were published with the appeal, and both verify on-chain: Solana HwJMgrHn…p1hsH and Ethereum 0x99Fd581d…902B2. Every figure in this dossier is filtered STRICTLY to on-chain activity after the post went live — the audit's one rule.",
      facts:
        "observed | Post live 2026-09-13 12:43:31 UTC (18:13:31 IST) · x.com/Unfortunate_95/status/2099116765523661090\nobserved | Patient: Babita Singh · Stage 4 colon cancer (recurrence) · ₹38,00,000+ spent on prior treatment\nobserved | Stated goal: ₹10,00,000 (~$10,000)\nobserved | Wallets verified: SOLANA HwJMgrHn…p1hsH · ETHEREUM 0x99Fd581d…902B2",
      focus: "POST, SOLW, ETHW",
    },
    {
      kicker: "First signal",
      title: "The first ₹200 arrives in fifty minutes",
      body:
        "The first donation landed at 13:33:59 UTC — fifty minutes after the post went live: 2.00 USDC (₹200) from 0x64b9fbeb…647741 on Ethereum. Two minutes later the Solana side opened with its single largest gift of the entire case: 49.8675 SOL (~$8,228 / ₹8,22,813) from EQbPkVih…qzExmW at 13:35:40 — likely the family's primary angel donor.\n\nBy evening the stream was steady: 20.01 USDT at 13:49:47, the first ETH donation (0.0028, ₹700) at 18:15:47, and USDC + USDT + ETH arriving through the whole day. The pattern is textbook viral: one post, an immediate trickle, then a flood.",
      facts:
        "observed | First post-live donation 13:33:59 UTC · 2.00 USDC (₹200) · Ethereum\nobserved | First Solana donation 13:35:40 UTC · 49.8675 SOL (~$8,228) — likely the family's primary angel\nobserved | First ETH donation 18:15:47 UTC · 0.0028 ETH (₹700)\nobserved | Steady stream of USDC + USDT + ETH donations through Sept 13",
      focus: "POST, S01, E47, E32, E46",
    },
    {
      kicker: "The angel",
      title: "One wallet gave 98.5% of the Solana side",
      body:
        "The Solana wallet received $8,356.89 (₹8,35,689) post-live across 117 transactions — but only four donors were real (>$0.01), and one of them is nearly the whole story. EQbPkVih…qzExmW sent 49.8675 SOL ($8,228.13) in the case's opening minutes; the other three gave $90.84, $29.41 and $8.51. Token received: SOL only — no USDC/USDT post-live.\n\nThe wallet's last post-live donation came at 22:54:57 UTC on September 14. Its current balance is 10.4230 SOL (~$1,719.79) plus 5.00 USDC and 281.01 USDT — but those stablecoins are pre-post-live, parked during a year of earlier fundraising. Nothing was traced out of the Solana wallet in this window.",
      facts:
        "observed | Solana post-live total: $8,356.89 (₹8,35,689) · 50.65 SOL · 4 unique donors\nobserved | S01 EQbPkVih…qzExmW: 49.8675 SOL · $8,228.13 · 13:35:40 UTC Sep 13\nobserved | Last post-live Solana donation: 2026-09-14 22:54:57 UTC\nobserved | Current balance: 10.4230 SOL (~$1,719.79) + 5.00 USDC + 281.01 USDT (pre-live) · ~$0 outgoing traced",
      focus: "SOLW, S01, S02, S03, S04",
    },
    {
      kicker: "The crowd",
      title: "Forty-eight donors, ninety-four percent stablecoins",
      body:
        "Ethereum carried the crowd: 48 unique post-live donors sent $15,354.82 (₹15,35,481.98) across 28 incoming transactions — 0.3665 ETH (~$916.25), 6,982.09 USDC and 7,456.49 USDT. Stablecoins were the vehicle of choice: $14,438.58, or 94% of the Ethereum total. Donors preserving value against volatility, exactly as the report reads it.\n\nOne gift was not a gift at all: 5.00 SEED from 0xae5497c7…390b5d — a spam token worth ~$0, ignored in the totals. It is kept in the ledger below because the ledger is complete: all forty-eight, ranked by dollar value, each one its own bubble in the trace.",
      facts:
        "observed | Ethereum post-live total: $15,354.82 (₹15,35,481.98) · 48 unique donors\nobserved | Tokens: 0.3665 ETH (~$916.25) + 6,982.09 USDC + 7,456.49 USDT\nobserved | Stablecoins = $14,438.58 = 94% of the Ethereum total\nobserved | 5.00 SEED (0xae5497c7…390b5d) — spam, ~$0, excluded from totals",
      focus: "ETHW, E01, E47",
    },
    {
      kicker: "The whales",
      title: "Three wallets carried 85.3% of everything",
      body:
        "Strip out the top three and this is a small intimate fundraiser; add them back and it went viral. EQbPkVih…qzExmW (49.87 SOL, $8,228.13), 0x64cdaa89…109a53 (6,000.00 USDT, $6,000.00, Sept 14 18:25) and 0xf70da978…a3dbef (5,994.16 USDC, $5,994.16, Sept 14 20:14) together gave $20,222.29 — 85.3% of everything raised post-live.\n\nThe remaining 49 donors contributed $3,489.42 (14.7%). The report's reading: donations of this size suggest close family members, angels, or VCs — people with a personal stake, arriving within hours of the post. One footnote the chain adds on its own: the third whale's address is the same on-chain address that funded SLINK's deployer in case R-0905.",
      facts:
        "observed | Top 3 combined: $20,222.29 = 85.3% of total raised post-live\nobserved | #1 EQbPkVih…qzExmW (Solana) · 49.87 SOL · $8,228.13 · Sept 13 13:35 UTC\nobserved | #2 0x64cdaa89…109a53 · 6,000.00 USDT · $6,000.00 · Sept 14 18:25 UTC\nobserved | #3 0xf70da978…a3dbef · 5,994.16 USDC · $5,994.16 · Sept 14 20:14 UTC · same address as the SLINK funding root (case R-0905)\nassessed | Close family members / angels / VCs — report's reading of the top-3 concentration",
      focus: "S01, E01, E02",
    },
    {
      kicker: "The ledger",
      title: "$571 an hour, and the chains flipped",
      body:
        "$23,711.71 in 41.5 hours is ~$571 per hour — sustained, not spiky, which is what a genuinely viral post looks like on-chain. The chain split itself is the interesting part: 64.7% of post-live value arrived on Ethereum ($15,354.82) against 35.3% on Solana ($8,356.89).\n\nThat is the reverse of the year before the post, when Solana dominated the slow trickle of donations — lower fees. The flip says the viral post reached an Ethereum-native audience. And within Ethereum, the stablecoin share (94%) says those donors wanted the rupee value locked at the moment of giving, not exposed to ETH's next candle.",
      facts:
        "observed | $23,711.71 raised in ~41.5 hours ≈ $571/hour average\nobserved | Ethereum 64.7% ($15,354.82) vs Solana 35.3% ($8,356.89) post-live\nobserved | Pre-post-live pattern was REVERSED — Solana dominated over the prior year (lower fees)\nassessed | Post-live shift suggests the viral X post reached an Ethereum-native audience",
      focus: "SOLW, ETHW",
    },
    {
      kicker: "The outflow",
      title: "83.3% swept to exchanges in forty-one hours",
      body:
        "The Ethereum wallet did not sit on the money. $19,744.36 (₹19,74,436.13) — 83.3% of all funds raised — was forwarded to likely exchange deposit addresses within the window: 0.3094 ETH (~$773.54), 6,109.91 USDC and 12,860.91 USDT. The behaviour has a signature: a 1.00 USDT test transfer at 14:48:35, then 750.00 USDT eighty-four seconds later; the 6,000.00 USDT whale gift (arrived 18:25:59) forwarded as TWO paired 6,000.00 USDT deposits at 19:04:23 and 19:04:35 to two different addresses; 500.00 and 2,500.00 USDC pairs repeated at 06:26–06:27 on Sept 15.\n\nDeposit A (0x5ad9f4d8…3991af) took ≈$9,960+; deposit B (0x5ada439b…df91af) ≈$8,500+ — both matching the Indian VDA exchange pattern (CoinDCX / WazirX / Giottus / Bitbns) for INR conversion. Two more transfers — 109.91 USDT and 109.91 USDC — went to smaller addresses, and 0.1694 ETH ($423.54) to a third address marked \u201cdeposit\u201d. Also observed: dumps of 6,000 \u201c5DT\u201d and 500 \u201c5DC\u201d — fake stablecoin clones worth ~$0, excluded from the spend total.",
      facts:
        "observed | Total post-live spend: $19,744.36 (₹19,74,436.13) = 83.3% of funds raised\nobserved | ETH sent 0.3094 (~$773.54) · USDC sent 6,109.91 · USDT sent 12,860.91\nobserved | Test-then-send: 1.00 USDT at 14:48:35 → 750.00 USDT at 14:49:59\nobserved | Whale forward: 6,000 USDT in → paired 6,000 + 6,000 USDT out at 19:04:23 / 19:04:35\nassessed | Deposits A + B match Indian VDA exchange hot-wallet pattern (CoinDCX/WazirX/Giottus/Bitbns)\nobserved | 6,000 5DT + 500 5DC fake tokens dumped — ~$0, excluded from totals",
      focus: "ETHW, EX1, EX2, EX3, OUT1, OUT2",
    },
    {
      kicker: "Forty-one hours",
      title: "2.37× the goal, and no red flags",
      body:
        "The final ledger, strictly post-live: $23,711.71 raised (₹23,71,171.45) — 2.37× the stated goal — from 52 unique donors across two chains. $19,744.36 already swept toward INR conversion. ≈$3,967.35 (₹3,96,735.32) still held across the wallets in post-live donations. The speed of the sweep is itself the strongest legitimacy signal: money moving to exchanges within hours, in deposit-sized pieces, matches urgent medical bills — not laundering, which parks and layers.\n\nThe audit's negative findings are the point: no mixer interactions, no suspicious bulk consolidations to unknown addresses, deposits going to consistent exchange-like addresses, donor wallets with varied normal histories. The report's conclusion, and this dossier's: a pattern highly consistent with a legitimate medical fundraiser being used as intended.",
      facts:
        "observed | Received: $23,711.71 (₹23,71,171.45) · 52 unique donors · 2.37× the stated goal\nobserved | Spent/withdrawn: $19,744.36 (₹19,74,436.13) to likely exchange deposits\nobserved | Currently held (post-live): ≈$3,967.35 (₹3,96,735.32)\nobserved | No mixers · no bulk consolidations · consistent exchange deposits · normal donor wallets\nunknown | Whether deposits A/B completed INR conversion — outside the on-chain window",
      focus: "POST, SOLW, ETHW",
    },
  ],
  findings: [
    {
      title: "$23,711.71 raised in 41.5 hours — 2.37× the stated goal",
      epistemic: "observed",
      confidence: "",
      body:
        "52 unique donors (4 Solana + 48 Ethereum) sent $23,711.71 (₹23,71,171.45) to the two verified wallets after the X post went live at 2026-09-13 12:43:31 UTC — roughly $571/hour. Solana: $8,356.89 in 50.65 SOL from 4 donors. Ethereum: $15,354.82 in 0.3665 ETH + 6,982.09 USDC + 7,456.49 USDT from 48 donors. The ₹10,00,000 (~$10,000) goal was passed in well under a day.",
    },
    {
      title: "Three wallets carried 85.3% of everything raised",
      epistemic: "observed",
      confidence: "",
      body:
        "The top three donations — 49.87 SOL ($8,228.13), 6,000.00 USDT ($6,000.00) and 5,994.16 USDC ($5,994.16) — total $20,222.29, or 85.3% of the post-live total. The remaining 49 donors gave $3,489.42 (14.7%). The report reads the concentration as close family members, angels, or VCs. The third whale's address (0xf70da978…a3dbef) is the same on-chain address as the SLINK funding root in case R-0905.",
    },
    {
      title: "Ethereum dominance post-live — the year-long pattern flipped",
      epistemic: "observed",
      confidence: "",
      body:
        "64.7% of post-live donations arrived on Ethereum ($15,354.82) versus 35.3% on Solana ($8,356.89). Before the post, a full year of prior fundraising showed the reverse — Solana dominated on lower fees. The flip is consistent with a viral X post reaching an Ethereum-native audience. Within Ethereum, stablecoins carried 94% of value ($14,438.58 of $15,354.82) — donors locking rupee value rather than donating volatile assets.",
    },
    {
      title: "$19,744.36 (83.3%) swept to likely Indian VDA exchange deposits",
      epistemic: "observed",
      confidence: "",
      body:
        "Within ~41 hours the Ethereum wallet forwarded 0.3094 ETH + 6,109.91 USDC + 12,860.91 USDT — $19,744.36 (₹19,74,436.13) — to a consistent set of deposit addresses: ≈$9,960+ to deposit A (0x5ad9f4d8…3991af) and ≈$8,500+ to deposit B (0x5ada439b…df91af), plus 0.1694 ETH to a third address marked \u201cdeposit\u201d and two 109.91 stablecoin transfers. The behaviour shows the exchange-deposit signature: a 1.00 USDT test followed 84 seconds later by 750 USDT, and the 6,000 USDT whale gift forwarded as two paired 6,000 USDT deposits 39 minutes after arrival. Multiple deposits to the same addresses over 24 hours is the standard pattern for INR conversion on Indian VDA exchanges (CoinDCX / WazirX / Giottus / Bitbns) — consistent with paying hospital bills.",
    },
    {
      title: "No red flags — the pattern fits a legitimate medical fundraiser",
      epistemic: "assessed",
      confidence: "medium",
      body:
        "The audit's negative findings: no mixer (Tornado Cash) interactions; no suspicious bulk consolidations to unknown addresses; outgoing transfers go to consistent exchange-like deposit addresses (repeated deposits to the same 2–3 addresses); donor wallets show varied, normal activity histories; and spending velocity matches urgent medical fundraising — multiple smaller withdrawals plus a few large ones. Fake spam tokens (6,000 \u201c5DT\u201d, 500 \u201c5DC\u201d) were dumped for ~$0 and excluded. The report's conclusion: highly consistent with a legitimate medical fundraiser being used as intended.",
    },
  ],
  graph: GRAPH,
};

let cached: DossierFile | null = null;

/** compile once, reuse everywhere — deterministic */
export function buildBabitaDossier(): DossierFile {
  if (!cached) {
    const result = buildDossier(draft);
    if (!result.ok) throw new Error("BABITA draft failed validation: " + result.errors.join(" | "));
    cached = result.dossier;
  }
  return cached;
}
