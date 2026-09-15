/* ── the BABITA investigation — compiled from the real on-chain report ──
   every entity, address, figure, timestamp and claim below comes verbatim
   from FINAL INVESTIGATION REPORT v4.0 (Babita Singh Cancer Fundraiser —
   "On-Chain Audit — Post-Live Window", FINAL — corrected Solana token
   transfers, report generated 2026-09-15 UTC, investigation window
   2026-09-13 12:43:31 UTC → 2026-09-15 ~06:30 UTC, ~41.5 hours).
   v4.0 SUPERSEDES the v3.0 compilation this file previously carried:
   the Solana side was re-audited at the SPL token-account level —
   $8,356.89 / 4 donors → $14,719.52 / 48 donors (+$6,362.63). NOTHING
   outside the pasted report is used or fabricated; the one derived
   figure (donors 21–48 aggregate, $218.38) is marked as derived.
   Verification stack per the report: Alchemy Solana + Ethereum mainnet
   RPCs, Blockscout REST API (native ETH transfer history), X post
   metadata for the post-live timestamp — ~400+ calls, reproducible.

   FIRST dual-chain case: figures are DOLLARIZED (report prices: SOL $165,
   ETH $2,500, USDC/USDT $1; exchange rate 1 USD = 100 INR per request),
   so the case unit is USD. 77 entities · 76 links · 8 chapters. */

import { buildDossier, type DraftCase } from "./dossier";
import type { CaseEdge, CaseNode, DossierFile, DossierGraph, Epistemic } from "./types";

const SOL = "SOLANA";
const ETH = "ETHEREUM";

const pad2 = (n: number) => String(n).padStart(2, "0");
const ethId = (i: number) => `E${pad2(i + 1)}`;
const solId = (i: number) => `S${pad2(i + 1)}`;
const inr = (n: number) => n.toLocaleString("en-US");

/* ── the TOP 20 Solana post-live donors — report §SOLANA (CORRECTED),
   verbatim from the v4.0 table. Donors 21–48 (28 wallets, $218.38
   combined) are omitted from the printed table — full list in the
   report's JSON ledger — so they compile as ONE cluster bubble (S21).
   The v3.0 pass saw only 4 SOL donors and zero stablecoins; v4.0's
   token-account re-index recovered 6,154.598 USDC + 231.014 USDT. ── */
const SOL_DONORS: {
  addr: string; usd: number; usdText: string; inrText: string; tok: string; remark?: string;
}[] = [
  { addr: "EQbPkVih…qzExmW", usd: 8228.13, usdText: "$8,228.13", inrText: "₹8,22,813", tok: "49.8675 SOL", remark: "FIRST POST-LIVE DONATION · 2026-09-13 13:35:40 UTC · VERIFIED SIMPLE SYSTEM PROGRAM TRANSFER — NOT A SWAP, ZERO INNER INSTRUCTIONS · DONOR SENT ALMOST THEIR ENTIRE WALLET BALANCE (49.87 → 0.0015 SOL) · LIKELY THE FAMILY'S PRIMARY ANGEL DONOR" },
  { addr: "EPUHjseX…3j8Uni", usd: 4562.06, usdText: "$4,562.06", inrText: "₹4,56,206", tok: "4,562.06 USDC" },
  { addr: "71X9ZGAb…yHJhs4", usd: 251.03, usdText: "$251.03", inrText: "₹25,103", tok: "251.03 USDC" },
  { addr: "J5UbB21h…EW8Dkf", usd: 250.00, usdText: "$250.00", inrText: "₹25,000", tok: "250.00 USDC" },
  { addr: "FTZBSywx…wvQRjJ", usd: 200.00, usdText: "$200.00", inrText: "₹20,000", tok: "200.00 USDT" },
  { addr: "9ZmnXr7W…QErXZr", usd: 151.27, usdText: "$151.27", inrText: "₹15,127", tok: "151.27 USDC" },
  { addr: "5YvEqqtH…Tgh3Ck", usd: 107.92, usdText: "$107.92", inrText: "₹10,792", tok: "107.92 USDC" },
  { addr: "7ctH88hX…nVBWRQ", usd: 100.00, usdText: "$100.00", inrText: "₹10,000", tok: "100.00 USDC" },
  { addr: "DqE4ck7Z…TFp13R", usd: 100.00, usdText: "$100.00", inrText: "₹10,000", tok: "100.00 USDC" },
  { addr: "B48kNVXs…DeKAAn", usd: 90.84, usdText: "$90.84", inrText: "₹9,084", tok: "0.5506 SOL" },
  { addr: "2Y7HATmn…bhj4cU", usd: 83.49, usdText: "$83.49", inrText: "₹8,349", tok: "83.49 USDC" },
  { addr: "DydDjGCZ…mPBabq", usd: 64.19, usdText: "$64.19", inrText: "₹6,419", tok: "64.19 USDC" },
  { addr: "EcDXntzh…dRPhVu", usd: 60.26, usdText: "$60.26", inrText: "₹6,026", tok: "60.26 USDC" },
  { addr: "EU8ZSYKJ…x59guN", usd: 56.30, usdText: "$56.30", inrText: "₹5,630", tok: "56.30 USDC" },
  { addr: "8UQYz2Eh…GHU6Rh", usd: 50.64, usdText: "$50.64", inrText: "₹5,064", tok: "50.64 USDC" },
  { addr: "AKQzwEMN…8h8E7q", usd: 50.00, usdText: "$50.00", inrText: "₹5,000", tok: "50.00 USDC" },
  { addr: "A27MoEzn…v3WJux", usd: 30.01, usdText: "$30.01", inrText: "₹3,001", tok: "30.01 USDT" },
  { addr: "5p82eqcM…ps3ErL", usd: 25.00, usdText: "$25.00", inrText: "₹2,500", tok: "25.00 USDC" },
  { addr: "7uqvjuKj…Mc8vpL", usd: 20.00, usdText: "$20.00", inrText: "₹2,000", tok: "20.00 USDC" },
  { addr: "EoPfcv1E…qbvN8P", usd: 20.00, usdText: "$20.00", inrText: "₹2,000", tok: "20.00 USDC" },
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
/* the Solana arc — mirror of the ETH stage: whales face the board's
   center (S01 nearest it), tails run outward; center bows toward the
   camera, ends lift. 21 slots: 20 named donors + the S21 cluster. */
function solDonorPos(i: number): [number, number, number] {
  const t = (i - 10) / 10;
  return [-10 - i * 1.4, -4 + 2.2 * t * t, 10.5 - 4.0 * t * t];
}

/* ── structural entities — the post, the two subject wallets, the outflow ── */
const STRUCTURAL: CaseNode[] = [
  { id: "POST", label: "The X post — @Unfortunate_95 (Web3LORD)", short: "POST", kind: "protocol", address: "x.com/Unfortunate_95/status/2099116765523661090", chain: "X", firstSeen: "SEP 13 2026", lastSeen: "SEP 13 2026", received: 0, sent: 0, balance: 0, risk: 0, tags: ["POST LIVE 2026-09-13 12:43:31 UTC", "18:13:31 IST", "VIRAL"], note: "The fundraiser post went live on X at 2026-09-13 12:43:31 UTC (18:13:31 IST), posted by @Unfortunate_95 (Web3LORD). Verified via X post metadata (publishedTime: 2026-09-13T12:43:31.000Z). Everything in this case is filtered STRICTLY to on-chain activity after this timestamp.", pos: [-2, 9.5, -2], size: 1.15 },
  { id: "SOLW", label: "Babita Singh — Solana donation wallet", short: "SOLW", kind: "wallet", address: "HwJMgrHnGnDLvWhD8wVPMh6FVCmsHiGJrVRywrLp1hsH", chain: SOL, firstSeen: "SEP 13 2026", lastSeen: "SEP 14 2026", received: 14719.52, sent: 13540.1, balance: 1229, risk: 0, tags: [SOL, "SUBJECT WALLET", "VERIFIED", "177 POST-LIVE TXS", "48 DONORS (CORRECTED)"], note: "Received $14,719.52 (₹14,71,952) post-live across 177 unique signatures traced on the main wallet + all 8 SPL token accounts — 50.508527 SOL (native 50.489058 + wrapped 0.019469, ~$8,333.91) + 6,154.598 USDC ($6,154.60) + 231.014 USDT ($231.01) + 10,000 of an unknown pump.fun-style token (≈$0) from 48 unique donors. v4.0 CORRECTION: the first pass ($8,356.89 / 4 donors) watched only the main wallet's SOL balance — USDC/USDT land in the token accounts (5QsEtjUZ8a3P2cEZ… USDC · ABgvySNQuVWvZggKXdUV… USDT), so the main balance never moves; per-account fetching recovered the missing $6,362.63. Withdrawn post-live: 44.80 SOL (88.6%) + 6,148.10 USDC (99.9%) ≈ $13,540 at report prices (derived; destinations not named in the report) — 0 USDT moved out. Current balance: 5.642458 SOL (~$930.01) + 0.071027 wSOL (~$11.72) + 6.50 USDC + 281.01 USDT ≈ $1,229 held (includes pre-live funds; traced USDT receipts are 231.01 vs 281.01 held).", pos: [-16, 2.5, 2], size: 1.5 },
  { id: "ETHW", label: "Babita Singh — Ethereum donation wallet", short: "ETHW", kind: "wallet", address: "0x99Fd581d47213b00b035b95b32deD0cE241902B2", chain: ETH, firstSeen: "SEP 13 2026", lastSeen: "SEP 15 2026", received: 15354.82, sent: 19744.36, balance: 141, risk: 0, tags: [ETH, "SUBJECT WALLET", "VERIFIED", "51% OF FUNDS"], note: "Received $15,354.82 (₹15,35,481.98) post-live — 0.3665 ETH (~$916.25) + 6,982.09 USDC + 7,456.49 USDT across 28 incoming transactions and 48 unique donors (43 ERC-20 transfers total). Forwarded $19,744.36 (₹19,74,436.13) — 65.6% of everything raised post-live — to likely exchange deposit addresses for INR conversion. Current balance 0.0563 ETH (~$141, mixed pre/post).", pos: [14, 1.5, 2], size: 1.7 },
  { id: "EX1", label: "Likely exchange deposit A — Indian VDA pattern", short: "EX1", kind: "exchange", address: "0x5ad9f4d8211a…3991af", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 15 2026", received: 9960, sent: 0, balance: 0, risk: 0, tags: [ETH, "≈$9,960+ RECEIVED", "LIKELY COINDCX/WAZIRX/BITBNS"], note: "Received $9,960+ in USDT+USDC+ETH — the largest outflow target. Deposits: 0.14 ETH ($350) at 11:09:47, a 1.00 USDT test at 14:48:35 followed by 750.00 USDT 84 seconds later, 6,000.00 USDT at 19:04:23, then 500.00 and 2,500.00 USDC on Sep 15 06:26–06:27. Multiple deposits to the same address over 24 hours is the standard Indian VDA exchange (CoinDCX/WazirX/Giottus/Bitbns) pattern for INR conversion.", pos: [26, 7, -4], size: 1.25 },
  { id: "EX2", label: "Likely exchange deposit B — second venue or account", short: "EX2", kind: "exchange", address: "0x5ada439b9a45…df91af", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 15 2026", received: 8500, sent: 0, balance: 0, risk: 0, tags: [ETH, "≈$8,500+ RECEIVED", "SECOND EXCHANGE OR ACCOUNT"], note: "Received $8,500+ in USDT+USDC. The 6,000.00 USDT whale donation arrived at the Ethereum wallet at 18:25:59 and was forwarded here as a paired deposit at 19:04:35 — 12 seconds after deposit A received its own 6,000.00 USDT. Also received 500.00 and 2,500.00 USDC on Sep 15 06:26:23 / 06:27:59.", pos: [30.5, 4.5, -6], size: 1.15 },
  { id: "EX3", label: "Likely exchange deposit C — marked \u201cdeposit\u201d", short: "EX3", kind: "exchange", address: "0x4fef9d741011…dd47df", chain: ETH, firstSeen: "SEP 15 2026", lastSeen: "SEP 15 2026", received: 423.54, sent: 0, balance: 0, risk: 0, tags: [ETH, "0.1694 ETH"], note: "Received 0.1694 ETH ($423.54 / ₹42,354) at 2026-09-15 05:08:47 UTC, marked as \u201cdeposit\u201d — likely another exchange deposit address.", pos: [23, 10.5, -6], size: 0.85 },
  { id: "OUT1", label: "Outflow — smaller transfer (USDT)", short: "OUT1", kind: "wallet", address: "0x6f75b4de6bc9…35be61", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 14 2026", received: 109.91, sent: 0, balance: 0, risk: 0, tags: [ETH, "109.91 USDT"], note: "Received 109.91 USDT from the Ethereum wallet at 2026-09-14 18:08:23 UTC — one of the two smaller transfers alongside the exchange deposits.", pos: [19, 12, -7], size: 0.75 },
  { id: "OUT2", label: "Outflow — smaller transfer (USDC)", short: "OUT2", kind: "wallet", address: "0xcd7b56d001f5…082eb1", chain: ETH, firstSeen: "SEP 14 2026", lastSeen: "SEP 14 2026", received: 109.91, sent: 0, balance: 0, risk: 0, tags: [ETH, "109.91 USDC"], note: "Received 109.91 USDC from the Ethereum wallet at 2026-09-14 18:13:59 UTC — one of the two smaller transfers alongside the exchange deposits.", pos: [27.5, 12.5, -7], size: 0.75 },
];

/* ── donor nodes — each wallet its own bubble, ranked by USD ── */
const solDonorNodes: CaseNode[] = [
  ...SOL_DONORS.map((d, i): CaseNode => ({
    id: solId(i),
    label: `Solana donor ${solId(i)} — ${d.usdText} (${d.tok})`,
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
    note: `Donated ${d.tok} (${d.usdText} / ${d.inrText}) post-live, ranked #${i + 1} of 48 by USD value — the report prints its top 20.${d.remark ? ` · ${d.remark}` : ""}`,
    pos: solDonorPos(i),
    size: i === 0 ? 2.05 : donorSize(d.usd),
    key: i === 0,
  })),
  { id: "S21", label: "Solana donors 21–48 — 28 wallets, $218.38 combined", short: "S21", kind: "cluster" as const, address: "full list in the report's JSON ledger", chain: SOL, firstSeen: "SEP 13 2026", lastSeen: "SEP 14 2026", received: 0, sent: 218.38, balance: 0, risk: 0 as const, tags: [SOL, "28 WALLETS", "$218.38 COMBINED"], note: "The report prints only its top 20 Solana donors — donors 21–48 (28 wallets) are omitted for brevity, full list in its JSON ledger. Combined $218.38 (derived: $14,719.52 corrected total − $14,501.14 top-20 sum), compiled here as one cluster bubble so the figure reconciles. Average gift ≈ $7.80.", pos: solDonorPos(20), size: 0.9 },
];

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
    basis: `${d.tok} · ${d.usdText} / ${d.inrText}${d.remark ? ` · ${d.remark}` : ""}`,
    channel: "direct" as const, txs: [],
    valueLabel: `${d.tok} · ${d.usdText}`,
  })),
  { id: "e-S21", source: "S21", target: "SOLW", value: 218.38, epistemic: "assessed" as Epistemic, basis: "Donors 21–48 omitted from the printed top-20 (full list in the report's JSON ledger) · combined $218.38 = $14,719.52 − $14,501.14 · derived", channel: "direct" as const, txs: [], valueLabel: "28 WALLETS · $218.38 COMBINED" },
  ...ETH_DONORS.map((d, i) => ({
    id: `e-${ethId(i)}`, source: ethId(i), target: "ETHW",
    value: d.usd, epistemic: "observed" as Epistemic,
    basis: `${d.tok} · ${d.usdText}${d.remark ? ` · ${d.remark}` : ""}`,
    channel: "direct" as const, txs: [],
    valueLabel: i === 47 ? `${d.tok} · SPAM ~$0` : `${d.tok} · ${d.usdText}`,
  })),
];

const infraEdges: CaseEdge[] = [
  { id: "e-POST-S", source: "POST", target: "SOLW", value: 14719.52, epistemic: "assessed", basis: "The viral X post drove the fundraising spike — assessed, not a transfer", channel: "direct", txs: [], valueLabel: "POST LIVE 12:43:31 UTC" },
  { id: "e-POST-E", source: "POST", target: "ETHW", value: 15354.82, epistemic: "assessed", basis: "The viral X post drove the fundraising spike — assessed, not a transfer", channel: "direct", txs: [], valueLabel: "POST LIVE 12:43:31 UTC" },
  { id: "e-EX1", source: "ETHW", target: "EX1", value: 9960, epistemic: "observed", basis: "≈$9,960+ across 6 deposits: 0.14 ETH ($350) · 1.00 USDT test · 750 USDT · 6,000 USDT · 500 USDC · 2,500 USDC", channel: "direct", txs: [], valueLabel: "≈$9,960+ IN" },
  { id: "e-EX2", source: "ETHW", target: "EX2", value: 8500, epistemic: "observed", basis: "≈$8,500+ across 3 deposits: 6,000 USDT (whale forward, 39 min after arrival) · 500 USDC · 2,500 USDC", channel: "direct", txs: [], valueLabel: "≈$8,500+ IN" },
  { id: "e-EX3", source: "ETHW", target: "EX3", value: 423.54, epistemic: "observed", basis: "0.1694 ETH ($423.54) marked \u201cdeposit\u201d · 2026-09-15 05:08:47 UTC", channel: "direct", txs: [], valueLabel: "0.1694 ETH · $423.54" },
  { id: "e-OUT1", source: "ETHW", target: "OUT1", value: 109.91, epistemic: "observed", basis: "109.91 USDT · 2026-09-14 18:08:23 UTC · smaller transfer", channel: "direct", txs: [], valueLabel: "109.91 USDT" },
  { id: "e-OUT2", source: "ETHW", target: "OUT2", value: 109.91, epistemic: "observed", basis: "109.91 USDC · 2026-09-14 18:13:59 UTC · smaller transfer", channel: "direct", txs: [], valueLabel: "109.91 USDC" },
];

/* active story edges per chapter — everything else renders faint */
const topDonors = ["e-S01", "e-S02", "e-E01", "e-E02"];
const GRAPH: DossierGraph = {
  nodes: [...STRUCTURAL, ...solDonorNodes, ...ethDonorNodes],
  edges: [...infraEdges, ...donorEdges],
  chapterEdges: [
    /* 01 the appeal */ ["e-POST-S", "e-POST-E"],
    /* 02 first signal */ ["e-E47", "e-S01", "e-E32", "e-E46"],
    /* 03 the solana side, corrected */ [...SOL_DONORS.map((_, i) => `e-${solId(i)}`), "e-S21"],
    /* 04 the crowd */ ETH_DONORS.map((_, i) => `e-${ethId(i)}`),
    /* 05 the whales */ topDonors,
    /* 06 the ledger */ ["e-S01", "e-S02", ...ETH_DONORS.slice(0, 10).map((_, i) => `e-${ethId(i)}`)],
    /* 07 the outflow */ ["e-EX1", "e-EX2", "e-EX3", "e-OUT1", "e-OUT2"],
    /* 08 forty-one hours */ ["e-POST-S", "e-POST-E", "e-S01", "e-S02", "e-E01", "e-E02", "e-EX1", "e-EX2"],
  ],
  chapterCams: [
    { target: [3, 2, 2], radius: 46, theta: 1.45, phi: 1.08 },
    { target: [0, 3, 3], radius: 40, theta: 1.38, phi: 1.1 },
    { target: [-24, -2, 8], radius: 30, theta: 1.42, phi: 1.1 },
    { target: [13, -1.5, 6], radius: 32, theta: 1.5, phi: 1.15 },
    { target: [-7, -1, 7], radius: 22, theta: 1.4, phi: 1.08 },
    { target: [0, 0, 5], radius: 40, theta: 1.5, phi: 1.06 },
    { target: [23, 7, -3], radius: 24, theta: 1.52, phi: 1.05 },
    { target: [0, 2, 2], radius: 50, theta: 1.55, phi: 1.05 },
  ],
};

const draft: DraftCase = {
  id: "B-0913",
  codename: "BABITA",
  status: "MONITORING",
  victim: "Babita Singh — Stage 4 colon cancer (patient)",
  chains: "SOLANA, ETHEREUM",
  amountText: "≈$30,074.34 RAISED IN 41.5 HOURS",
  amountUsd: "$30,074.34",
  span: "SEP 13 — SEP 15 2026",
  updated: "2026-09-15",
  progress: "100",
  unit: "USD",
  summary:
    "A cancer fundraiser for Babita Singh went live on X at 12:43:31 UTC on September 13, 2026 — asking for ₹10,00,000 (~$10,000) toward Stage 4 colon cancer treatment after ₹38,00,000+ already spent on prior care. In ~41.5 hours, 96 unique donor wallets sent $30,074.34 (₹30,07,433.90) to two verified wallets — $14,719.52 on Solana, $15,354.82 on Ethereum — 3.0× the stated goal. Four wallets carried 82.4% of the total, 69% of all value arrived in stablecoins, and $19,744.36 (65.6%) was swept to likely Indian VDA exchange deposit addresses for INR conversion — consistent with urgent hospital bills. The strict post-live audit finds no red flags: no mixers, no suspicious consolidations, and spending that matches the appeal. This file compiles report v4.0, which corrects v3.0's Solana ledger (+$6,362.63, 4 → 48 donors) after re-indexing the wallet's SPL token accounts.",
  method:
    "All data collected via Alchemy RPCs (Solana mainnet + Ethereum mainnet) and the Blockscout REST API for native ETH transfer history — no paid indexers, no keys beyond Alchemy free tier. Solana: getBalance, getTokenAccountsByOwner (Token + Token-2022 programs), getSignaturesForAddress (limit 1000) on the main wallet AND each of its 8 SPL token accounts, getTransaction (maxSupportedTransactionVersion=1) with pre/post token balance parsing; senders identified by same-mint decreases. Ethereum: eth_getBalance, eth_getTransactionCount, eth_blockNumber. Blockscout: GET /addresses/{addr}/transactions and /token-transfers — the workaround for native ETH transfers, which eth_getLogs cannot see. Post-live timestamp verified via X post metadata (publishedTime 2026-09-13T12:43:31.000Z); 177 unique post-live Solana signatures and all 43 Ethereum ERC-20 transfers + 28 incoming txs fetched and aggregated into per-sender donor ledgers. Prices: SOL $165, ETH $2,500, USDC/USDT $1; exchange rate 1 USD = 100 INR (user-specified). ~400+ calls; every figure reproducible from the documented endpoints.",
  limitations:
    "Solana getSignaturesForAddress returns the last 1,000 transactions per address — 124 on the main wallet plus 113 across the 8 token accounts = 177 unique post-live signatures, well within limit. ~50 USDT of inner-instruction transfers remain untraced: the token account holds 281.01 USDT against 231.01 traced, so the real Solana total is slightly higher than printed. Donor wallet histories — where donors' funds came from before sending — were NOT traced and would require additional queries. Current balances include BOTH pre- and post-live funds: the Solana wallet's 281.01 USDT partly predates the post, and the Ethereum wallet's 0.0563 ETH is mixed — post-live donations still held are ≈$1,369 (₹1,36,900).",
  nextSteps:
    "Watch exchange deposit A (0x5ad9f4d8…) and B (0x5ada439b…) for completed INR off-ramp\nTrace the Solana withdrawal destinations (44.80 SOL + 6,148.10 USDC left the wallet)\nReconcile the ~50 USDT inner-instruction gap (traced 231.01 vs 281.01 held)",
  sourceNote:
    "Compiled by taraonchain from FINAL INVESTIGATION REPORT v4.0 — FINAL, corrected Solana token transfers (Babita Singh Cancer Fundraiser — post-live window). v4.0 supersedes the v3.0 compilation previously published on this file: the Solana side was re-audited at the SPL token-account level, revising it from $8,356.89 / 4 donors to $14,719.52 / 48 donors. Post-live window 2026-09-13 12:43:31 UTC → 2026-09-15 ~06:30 UTC (~41.5 hours). All addresses, balances and transfer events verifiable on-chain via the documented Alchemy RPCs + Blockscout REST API. Report generated 2026-09-15 (UTC). Exchange rate 1 USD = 100 INR.",
  assetRows: [
    { loc: "SOLANA WALLET", amt: "5.642458 SOL + 0.071027 wSOL + 6.50 USDC + 281.01 USDT (≈$1,229)", state: "CURRENT BALANCE · INCLUDES PRE-LIVE FUNDS", tone: "fact" },
    { loc: "ETHEREUM WALLET", amt: "0.0563 ETH (≈$141)", state: "CURRENT BALANCE · MIXED PRE/POST", tone: "fact" },
    { loc: "EXCHANGE DEPOSIT A", amt: "≈$9,960+ (USDT+USDC+ETH)", state: "LIKELY INDIAN VDA EXCHANGE PATTERN", tone: "assess" },
    { loc: "EXCHANGE DEPOSIT B", amt: "≈$8,500+ (USDT+USDC)", state: "LIKELY SECOND EXCHANGE OR ACCOUNT", tone: "assess" },
    { loc: "STILL HELD (POST-LIVE)", amt: "≈$1,369 (₹1,36,900)", state: "POST-LIVE DONATIONS NOT YET SWEPT", tone: "fact" },
    { loc: "SPAM TOKENS IN", amt: "5.00 SEED (ETH) + 10,000 PUMP.FUN-STYLE (SOL)", state: "≈$0 · EXCLUDED FROM TOTALS", tone: "unknown" },
  ],
  entities: [
    ...STRUCTURAL.map((n) => ({ label: n.label, short: n.short, kind: n.kind, chain: n.chain, note: n.note ?? "" })),
    ...SOL_DONORS.map((d, i) => ({
      label: `Solana donor ${solId(i)} — ${d.usdText} (${d.tok})`,
      short: solId(i),
      kind: "wallet" as const,
      chain: SOL,
      note: `Donated ${d.tok} (${d.usdText} / ${d.inrText}) post-live, ranked #${i + 1} of 48 by USD value — the report prints its top 20.${d.remark ? ` · ${d.remark}` : ""}`,
    })),
    { label: "Solana donors 21–48 — 28 wallets, $218.38 combined", short: "S21", kind: "cluster" as const, chain: SOL, note: "28 wallets omitted from the report's printed top-20 (full list in its JSON ledger); combined $218.38 = $14,719.52 − $14,501.14, derived. Average gift ≈ $7.80." },
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
    ...SOL_DONORS.map((d, i) => ({ from: solId(i), to: "SOLW", value: `${d.tok} (${d.usdText})`, channel: "direct" as const, epistemic: "observed" as Epistemic, basis: d.remark ?? "", when: i === 0 ? "2026-09-13 13:35:40 UTC" : "", txHash: "" })),
    { from: "S21", to: "SOLW", value: "28 wallets · $218.38 combined", channel: "direct" as const, epistemic: "assessed" as Epistemic, basis: "Donors 21–48 omitted from the printed top-20 — combined derived from the corrected total", when: "", txHash: "" },
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
      kicker: "The Solana side — corrected",
      title: "Forty-eight donors, first read as four",
      body:
        "The first pass misread this chain, and the correction is part of the record. v3.0 of the report watched only the main wallet's SOL balance — but USDC and USDT don't land there. They land in the wallet's SPL token accounts, different addresses entirely (5QsEtjUZ8a3P2cEZ… for USDC, ABgvySNQuVWvZggKXdUV… for USDT), and the main balance never moves. v4.0 re-fetched every account: getTokenAccountsByOwner, then getSignaturesForAddress on the main wallet AND each of its 8 token accounts — 177 unique post-live signatures instead of 124.\n\nThe corrected ledger: $14,719.52 (₹14,71,952) from 48 unique donors — 50.508527 SOL (native 50.489058 + wrapped 0.019469, ~$8,333.91), 6,154.598 USDC ($6,154.60) and 231.014 USDT ($231.01), plus 10,000 of an unknown pump.fun-style token worth ≈$0. The angel still leads — EQbPkVih…qzExmW, 49.8675 SOL ($8,228.13) at 13:35:40 on Sept 13 — but that is now 55.9% of the Solana side, not 98.5%. Behind it: EPUHjseX…3j8Uni with 4,562.06 USDC ($4,562.06), then a long stablecoin tail. And the wallet is already emptying: 44.80 SOL (88.6%) and 6,148.10 USDC (99.9%) withdrawn post-live; zero USDT moved out.\n\nOne gap the report refuses to hide: traced USDT receipts are 231.01, but the account holds 281.01 — about 50 USDT arrived inside inner instructions the parser still can't fully see. The real Solana total is slightly higher than printed.",
      facts:
        "observed | Solana post-live total (corrected): $14,719.52 (₹14,71,952) · 48 unique donors · 177 sigs across main wallet + 8 token accounts\nobserved | Tokens: 50.508527 SOL (~$8,333.91) + 6,154.598 USDC + 231.014 USDT + 10,000 junk tokens (≈$0)\nobserved | #1 EQbPkVih…qzExmW · 49.8675 SOL · $8,228.13 · 13:35:40 UTC Sept 13 · now 55.9% of the Solana side\nobserved | #2 EPUHjseX…3j8Uni · 4,562.06 USDC · $4,562.06\nobserved | Withdrawn post-live: 44.80 SOL (88.6%) + 6,148.10 USDC (99.9%) · USDT 0 withdrawn\nassessed | ~50 USDT untraced in inner instructions — traced 231.01 vs 281.01 held; real total slightly higher",
      focus: "SOLW, S01, S02, S21",
    },
    {
      kicker: "The crowd",
      title: "Forty-eight donors, ninety-four percent stablecoins",
      body:
        "Ethereum carried the crowd: 48 unique post-live donors sent $15,354.82 (₹15,35,481.98) across 28 incoming transactions — 0.3665 ETH (~$916.25), 6,982.09 USDC and 7,456.49 USDT. Stablecoins were the vehicle of choice: $14,438.58, or 94% of the Ethereum total. Donors preserving value against volatility, exactly as the report reads it. The corrected Solana ledger now mirrors this count — 48 donors on each chain, 96 across the case.\n\nOne gift was not a gift at all: 5.00 SEED from 0xae5497c7…390b5d — a spam token worth ~$0, ignored in the totals. It is kept in the ledger below because the ledger is complete: all forty-eight, ranked by dollar value, each one its own bubble in the trace.",
      facts:
        "observed | Ethereum post-live total: $15,354.82 (₹15,35,481.98) · 48 unique donors\nobserved | Tokens: 0.3665 ETH (~$916.25) + 6,982.09 USDC + 7,456.49 USDT\nobserved | Stablecoins = $14,438.58 = 94% of the Ethereum total\nobserved | 48 Solana + 48 Ethereum = 96 unique donor wallets post-live\nobserved | 5.00 SEED (0xae5497c7…390b5d) — spam, ~$0, excluded from totals",
      focus: "ETHW, E01, E47",
    },
    {
      kicker: "The whales",
      title: "Four wallets carried 82.4% of everything",
      body:
        "Strip out the top four and this is a small intimate fundraiser; add them back and it went viral. EQbPkVih…qzExmW (49.87 SOL, $8,228.13), 0x64cdaa89…109a53 (6,000.00 USDT, $6,000.00, Sept 14 18:25), 0xf70da978…a3dbef (5,994.16 USDC, $5,994.16, Sept 14 20:14) and EPUHjseX…3j8Uni (4,562.06 USDC, $4,562.06) together gave $24,784.35 — 82.4% of everything raised post-live.\n\nThe remaining 92 donors contributed $5,290 (17.6%). The report's reading: donations of this size suggest close family members, angels, or VCs — people with a personal stake, arriving within hours of the post. One cross-reference this archive carries from the prior pass: the third whale's address is the same on-chain address that funded SLINK's deployer in case R-0905 — unchanged, and outside this report's scope.",
      facts:
        "observed | Top 4 combined: $24,784.35 = 82.4% of total raised post-live\nobserved | #1 EQbPkVih…qzExmW (Solana) · 49.87 SOL · $8,228.13 · Sept 13 13:35 UTC\nobserved | #2 0x64cdaa89…109a53 · 6,000.00 USDT · $6,000.00 · Sept 14 18:25 UTC\nobserved | #3 0xf70da978…a3dbef · 5,994.16 USDC · $5,994.16 · Sept 14 20:14 UTC · same address as the SLINK funding root (case R-0905)\nobserved | #4 EPUHjseX…3j8Uni (Solana) · 4,562.06 USDC · $4,562.06\nassessed | Close family members / angels / VCs — report's reading of the top-4 concentration",
      focus: "S01, S02, E01, E02",
    },
    {
      kicker: "The ledger",
      title: "$725 an hour, and the chains evened out",
      body:
        "$30,074.34 in 41.5 hours is ~$725 per hour — sustained, not spiky, which is what a genuinely viral post looks like on-chain. The chain split is nearly even: 51% of post-live value arrived on Ethereum ($15,354.82) against 49% on Solana ($14,719.52). The year before the post, Solana dominated the slow trickle — lower fees. The viral post reached both audiences at once.\n\nAcross both chains, donors reached for stablecoins: $20,824.19 of the total (69%) arrived as USDC or USDT, against $9,250.16 (31%) in native SOL and ETH — donors locking the rupee value of their gift at the moment of giving rather than exposing it to the next candle. Within Ethereum alone the stablecoin share is 94%.",
      facts:
        "observed | $30,074.34 raised in ~41.5 hours ≈ $725/hour average\nobserved | Ethereum 51% ($15,354.82) vs Solana 49% ($14,719.52) post-live\nobserved | Stablecoins $20,824.19 = 69% of all donations · native SOL+ETH $9,250.16 = 31%\nobserved | Pre-post-live pattern was different — Solana dominated over the prior year (lower fees)\nassessed | Post-live balance suggests the viral X post reached both chains' audiences at once",
      focus: "SOLW, ETHW",
    },
    {
      kicker: "The outflow",
      title: "$19,744 swept to exchanges in forty-one hours",
      body:
        "The Ethereum wallet did not sit on the money. $19,744.36 (₹19,74,436.13) — 65.6% of all funds raised — was forwarded to likely exchange deposit addresses within the window: 0.3094 ETH (~$773.54), 6,109.91 USDC and 12,860.91 USDT. The behaviour has a signature: a 1.00 USDT test transfer at 14:48:35, then 750.00 USDT eighty-four seconds later; the 6,000.00 USDT whale gift (arrived 18:25:59) forwarded as TWO paired 6,000.00 USDT deposits at 19:04:23 and 19:04:35 to two different addresses; 500.00 and 2,500.00 USDC pairs repeated at 06:26–06:27 on Sept 15.\n\nDeposit A (0x5ad9f4d8…3991af) took ≈$9,960+; deposit B (0x5ada439b…df91af) ≈$8,500+ — both matching the Indian VDA exchange pattern (CoinDCX / WazirX / Giottus / Bitbns) for INR conversion. Two more transfers — 109.91 USDT and 109.91 USDC — went to smaller addresses, and 0.1694 ETH ($423.54) to a third address marked \u201cdeposit\u201d.\n\nSolana was emptying too: 44.80 SOL (88.6%) and 6,148.10 USDC (99.9%) left the wallet post-live, though the report does not name their destinations — so the verifiable withdrawal total on this file stays Ethereum-only. (The report drafts a combined ~$31,551 figure and rejects it in the same breath: Solana's outflows mix pre-live funds.)",
      facts:
        "observed | Total post-live spend (Ethereum, verifiable): $19,744.36 (₹19,74,436.13) = 65.6% of funds raised\nobserved | ETH sent 0.3094 (~$773.54) · USDC sent 6,109.91 · USDT sent 12,860.91\nobserved | Test-then-send: 1.00 USDT at 14:48:35 → 750.00 USDT at 14:49:59\nobserved | Whale forward: 6,000 USDT in → paired 6,000 + 6,000 USDT out at 19:04:23 / 19:04:35\nobserved | Solana also withdrew: 44.80 SOL (88.6%) + 6,148.10 USDC (99.9%) — destinations not named in the report\nassessed | Deposits A + B match Indian VDA exchange hot-wallet pattern (CoinDCX/WazirX/Giottus/Bitbns)",
      focus: "ETHW, EX1, EX2, EX3, OUT1, OUT2",
    },
    {
      kicker: "Forty-one hours",
      title: "3.0× the goal, and no red flags",
      body:
        "The final ledger, strictly post-live: $30,074.34 raised (₹30,07,433.90) — 3.0× the stated goal — from 96 unique donor wallets across two chains. $19,744.36 already swept toward INR conversion on Ethereum; the Solana wallet has withdrawn 88.6% of its SOL and 99.9% of its USDC. ≈$1,369 in post-live donations is still held across the wallets. The speed of the sweep is itself the strongest legitimacy signal: money moving to exchanges within hours, in deposit-sized pieces, matches urgent medical bills — not laundering, which parks and layers.\n\nThe audit's negative findings are the point: no mixer interactions, no suspicious bulk consolidations to unknown addresses, deposits going to consistent exchange-like addresses, donor wallets with varied normal histories. And the audit corrected itself on the record: v3.0's parser missed every Solana stablecoin donation by watching only the main wallet; v4.0 re-indexed all 8 token accounts and revised the Solana side from $8,356.89 (4 donors) to $14,719.52 (48) — +$6,362.63, all verifiable on-chain. A report that publishes its own erratum is doing the job.",
      facts:
        "observed | Received: $30,074.34 (₹30,07,433.90) · 96 unique donor wallets · 3.0× the stated goal\nobserved | Withdrawn (Ethereum, verifiable): $19,744.36 (₹19,74,436.13) to likely exchange deposits\nobserved | Solana withdrawn: 44.80 SOL (88.6%) + 6,148.10 USDC (99.9%)\nobserved | Currently held (post-live donations): ≈$1,369 across both wallets\nobserved | Correction: v4.0 supersedes v3.0 — Solana side $8,356.89 → $14,719.52 (+$6,362.63) after token-account re-index\nobserved | No mixers · no bulk consolidations · consistent exchange deposits · normal donor wallets\nunknown | Whether deposits A/B completed INR conversion — outside the on-chain window",
      focus: "POST, SOLW, ETHW",
    },
  ],
  findings: [
    {
      title: "$30,074.34 raised in 41.5 hours — 3.0× the stated goal",
      epistemic: "observed",
      confidence: "",
      body:
        "96 unique donor wallets (48 Solana + 48 Ethereum) sent $30,074.34 (₹30,07,433.90) to the two verified wallets after the X post went live at 2026-09-13 12:43:31 UTC — roughly $725/hour. Solana: $14,719.52 in 50.508527 SOL + 6,154.598 USDC + 231.014 USDT from 48 donors (corrected in v4.0; the first pass saw only $8,356.89). Ethereum: $15,354.82 in 0.3665 ETH + 6,982.09 USDC + 7,456.49 USDT from 48 donors. The ₹10,00,000 (~$10,000) goal was passed in well under a day.",
    },
    {
      title: "Four wallets carried 82.4% of everything raised",
      epistemic: "observed",
      confidence: "",
      body:
        "The top four donations — 49.87 SOL ($8,228.13), 6,000.00 USDT ($6,000.00), 5,994.16 USDC ($5,994.16) and 4,562.06 USDC ($4,562.06) — total $24,784.35, or 82.4% of the post-live total. The remaining 92 donors gave $5,290 (17.6%). The report reads the concentration as close family members, angels, or VCs. This archive cross-references the third whale's address (0xf70da978…a3dbef) as the same on-chain address as the SLINK funding root in case R-0905.",
    },
    {
      title: "Near-even split — Ethereum 51%, Solana 49% — and 69% arrived in stablecoins",
      epistemic: "observed",
      confidence: "",
      body:
        "Ethereum carried 51% of post-live value ($15,354.82) against Solana's 49% ($14,719.52) — nearly even, where the pre-post year was Solana-dominated on lower fees. Stablecoins dominated the preferences: $20,824.19 (69%) arrived as USDC/USDT — Solana $6,385.61, Ethereum $14,438.58 — against $9,250.16 (31%) in native SOL and ETH. Donors preserving value against volatility: they wanted the rupee amount locked at the moment of giving. Within Ethereum alone, stablecoins are 94% of value.",
    },
    {
      title: "$19,744.36 (65.6%) swept to likely Indian VDA exchange deposits",
      epistemic: "observed",
      confidence: "",
      body:
        "Within ~41 hours the Ethereum wallet forwarded 0.3094 ETH + 6,109.91 USDC + 12,860.91 USDT — $19,744.36 (₹19,74,436.13), 65.6% of everything raised — to a consistent set of deposit addresses: ≈$9,960+ to deposit A (0x5ad9f4d8…3991af) and ≈$8,500+ to deposit B (0x5ada439b…df91af), plus 0.1694 ETH to a third address marked \u201cdeposit\u201d and two 109.91 stablecoin transfers. The behaviour shows the exchange-deposit signature: a 1.00 USDT test followed 84 seconds later by 750 USDT, and the 6,000 USDT whale gift forwarded as two paired 6,000 USDT deposits 39 minutes after arrival. Multiple deposits to the same addresses over 24 hours is the standard pattern for INR conversion on Indian VDA exchanges (CoinDCX / WazirX / Giottus / Bitbns). The Solana wallet withdrew in parallel — 44.80 SOL (88.6%) and 6,148.10 USDC (99.9%) — with destinations the report does not name.",
    },
    {
      title: "No red flags — the pattern fits a legitimate medical fundraiser",
      epistemic: "assessed",
      confidence: "medium",
      body:
        "The audit's negative findings: no mixer (Tornado Cash) interactions; no suspicious bulk consolidations to unknown addresses; outgoing transfers go to consistent exchange-like deposit addresses (repeated deposits to the same 2–3 addresses); donor wallets show varied, normal activity histories; and spending velocity matches urgent medical fundraising — multiple smaller withdrawals plus a few large ones. Spam tokens (5.00 SEED on Ethereum, 10,000 of an unknown pump.fun-style token on Solana) were received and excluded at ~$0. The 49.87 SOL anchor donation verified as a simple System Program transfer — not a swap, zero inner instructions. The report's conclusion: highly consistent with a legitimate medical fundraiser being used as intended.",
    },
    {
      title: "The correction on the record — v4.0 supersedes v3.0 (+$6,362.63)",
      epistemic: "observed",
      confidence: "",
      body:
        "v3.0 of this report undercounted Solana by $6,362.63: its parser watched only the main wallet's SOL balance, while USDC/USDT land in the wallet's SPL token accounts — separate addresses whose balances never touch the main wallet. v4.0 re-fetched every account: getTokenAccountsByOwner (Token + Token-2022), getSignaturesForAddress on the main wallet and each of 8 token accounts, pre/post token balance parsing per transaction, and sender identification by same-mint decreases. Result: 177 unique post-live signatures (was 124), 48 Solana donors (was 4), $14,719.52 (was $8,356.89). Residual: traced USDT 231.01 vs 281.01 held — ~50 USDT in inner instructions still untraced, so the true total is slightly higher than printed.",
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
