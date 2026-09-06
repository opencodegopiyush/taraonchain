/* ── the SLINK investigation — compiled from the real on-chain report ──
   every entity, address, figure, timestamp and claim below comes verbatim
   from the user's FINAL INVESTIGATION REPORT v6.0 (SLINK / Shivolink,
   Robinhood Chain — complete deployment trail, report generated 2026-09-06,
   investigation window Jul 25 — Sep 5 2026). NOTHING outside the pasted
   report is used or fabricated. Verification stack per the report: Alchemy
   RPC (alchemy_getAssetTransfers), free public Robinhood Chain RPC
   (chain ID 0x1237), DexScreener API, 4byte.directory — ~300+ calls.
   Used by the seed script AND as the bundled fallback when the case
   archive database is unavailable. */

import { buildDossier, type DraftCase } from "./dossier";
import type { DossierFile } from "./types";

const RHC = "ROBINHOOD CHAIN";

const draft: DraftCase = {
  id: "R-0905",
  codename: "SLINK",
  status: "CLOSED",
  victim: "SLINK buyers (retail FOMO)",
  chains: RHC,
  amountText: "≈$4.83M EXTRACTED",
  amountUsd: "$82M PEAK MCAP",
  span: "JUL 25 — SEP 05 2026",
  updated: "2026-09-06",
  progress: "100",
  summary:
    "A hijacked @shivon account pushed a fake Neuralink-nonprofit story and quote-tweeted the $SLINK contract — Elon Musk replied \u201c💯\u201d — and the token hit an $82,000,000 market cap 75 minutes after launch. The on-chain record shows a deployer funded through five layers of chain-hopping over 42 days, 28 pre-positioned insider wallets extracting ≈$4,832,500 and fully exiting, and a factory-owner proxy quietly holding 186.86 ETH. Price collapsed 99.3% from the peak.",
  method:
    "All data collected via Alchemy RPC (alchemy_getAssetTransfers for the funding trail — THE KEY METHOD), the free public Robinhood Chain RPC (chain ID 0x1237), DexScreener API (market data, pairs) and 4byte.directory (selector decoding). ~300+ JSON-RPC calls: eth_getCode, eth_getBalance, eth_getTransactionCount, eth_call (name, symbol, decimals, totalSupply, balanceOf, owner, deployer, curve, factory), eth_getStorageAt (slots 0–2), eth_getLogs (9,028 Transfer events), eth_getBlockByNumber, eth_getTransactionByHash, eth_getTransactionReceipt, eth_blockNumber, eth_chainId. Deployer identity verified via the SLINK contract\u2019s deployer() selector 0xd5f39488, confirmed on 4byte.directory. Wallets #1–2 P&L computed from individual Transfer events.",
  limitations:
    "Whether the operator withdrew ETH from a CEX (Binance, OKX, Coinbase) or used a bridge (across from Ethereum mainnet or another L2) cannot be determined from Robinhood Chain alone — it would require cross-chain analysis. The real-world identity of the account hijackers is not established in this report. All tweets have since been deleted and @shillink has been frozen, so the social-engineering leg can no longer be independently re-verified.",
  nextSteps:
    "Cross-chain analysis of root 0xf70da978…dbef to identify the CEX or bridge behind the funding\nWatch the 11 insider wallets still sitting on ~580 ETH (≈$1.45M) on Robinhood Chain\nTrace factory-owner proxy 0x263ed295…19dd (186.86 ETH) for exit moves",
  sourceNote:
    "Compiled by taraonchain from the FINAL INVESTIGATION REPORT v6.0 (SLINK / Shivolink — complete deployment trail). All addresses, balances, transfer events and timestamps verifiable on-chain via Alchemy RPC + free public Robinhood Chain RPC + DexScreener API + 4byte.directory. Report generated 2026-09-06 (UTC).",
  assetRows: [
    { loc: "MAIN LIQUIDITY POOL", amt: "13,760.87 ETH (≈$34.4M)", state: "REMAINS IN POOL · ~$20.6M EXTRACTED BY SELLERS", tone: "fact" },
    { loc: "DEX FEE COLLECTOR", amt: "443.92 ETH (≈$1.11M)", state: "FEES FROM ~$93M VOLUME", tone: "fact" },
    { loc: "FACTORY-OWNER PROXY", amt: "186.86 ETH (≈$467K)", state: "LIKELY REAL OPERATOR PROFITS", tone: "assess" },
    { loc: "11 INSIDER WALLETS", amt: "~580 ETH (≈$1.45M)", state: "STILL ON ROBINHOOD CHAIN", tone: "risk" },
    { loc: "DEPLOYER EOA", amt: "0.187 ETH", state: "PUPPET BALANCE · NOT THE PRIZE", tone: "assess" },
    { loc: "28 INSIDER WALLETS", amt: "≈$4,832,500 COMBINED", state: "FULLY EXITED · 0 SLINK EACH", tone: "fact" },
  ],
  entities: [
    { label: "Root funding wallet (CEX/bridge?)", short: "ROOT", kind: "wallet", chain: RHC, note: "0xf70da97812cb96acdf810712aa562db8dfa3dbef — EOA, 1,625,315 txs, 12.13 ETH, first activity May 8 2026; profile consistent with a CEX hot wallet or bridge withdrawal address" },
    { label: "Layer 1 — high-volume intermediary", short: "L1", kind: "wallet", chain: RHC, note: "0x331d9a049d496385998067abf6cbb6371c8d2466 — EOA, 566,539 txs over 2 months, 3.998 ETH; likely CEX hot wallet or bridge relayer" },
    { label: "Layer 2 — intermediary", short: "L2", kind: "wallet", chain: RHC, note: "0xba39cb790834d441e625f5e361d0366fa7c1603e — EOA, 7 txs, 0.10 ETH; also funded the DEX router with 12 + 5.95 ETH" },
    { label: "Layer 3 — pass-through", short: "L3", kind: "wallet", chain: RHC, note: "0xf79f8e2f9d387dc40e57d7ac4b3144e66aec84e6 — EOA, 3 txs, 0.0003 ETH; single-purpose pass-through wallet" },
    { label: "Layer 4 — trading bot / relayer", short: "L4", kind: "wallet", chain: RHC, note: "0x88d25c861938a91af4ad57ad964a8fcc6c6351d3 — EOA, 20,931 txs, 392.18 ETH; high-frequency trading bot profile" },
    { label: "SLINK deployer", short: "DEPLOY", kind: "wallet", chain: RHC, note: "0x79ba699eb35550cff96d205cfad7a22d975695e3 — EOA, 15 txs, 0.187 ETH; verified via deployer() selector 0xd5f39488; NOT one of the 28 insider wallets" },
    { label: "Token factory", short: "FACTORY", kind: "contract", chain: RHC, note: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e — 48,356 chars of code, 2 txs, deployed SLINK via CREATE2; owner is the ERC-1967 proxy holding 186.86 ETH" },
    { label: "Factory owner (ERC-1967 proxy)", short: "PROXY", kind: "contract", chain: RHC, note: "0x263ed295dafae1d9aadd6e56c4b6f9f38ee019dd — 344 chars minimal proxy, 186.86 ETH (≈$467K); likely where the deployer\u2019s REAL profits sit" },
    { label: "SLINK token (ERC-20)", short: "TOKEN", kind: "contract", chain: RHC, note: "0xfa89ed9d12bf74add8253ddfaa426c4d8a0fa603 — 6,498 chars; supply 1,000,000,000 × 10^18 in slot 2; owner() reverts; immutable" },
    { label: "Initial vault (fully drained)", short: "VAULT", kind: "vault", chain: RHC, note: "0x154b9f869e8839195cabce575dcfb8afbd9f3117 — 48-char minimal proxy; received the full 1B supply from the constructor, distributed to the pool and early buyers; 0 ETH, 0 SLINK left" },
    { label: "Main liquidity pool (SLINK/ETH)", short: "POOL", kind: "contract", chain: RHC, note: "0x8366a39cc670b4001a1121b8f6a443a643e40951 — 13,760.87 ETH (≈$34.4M) + 116,464,855 SLINK; ~$55M ETH side at ATH; where ALL buyers\u2019 ETH went" },
    { label: "Secondary liquidity pool", short: "POOL2", kind: "contract", chain: RHC, note: "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044 — 53.11 ETH" },
    { label: "Bonding curve", short: "CURVE", kind: "contract", chain: RHC, note: "0xaa66c48225ede78b2c9c9b75381cd4f6b1bf16a3 — 20,460 chars; returned by SLINK\u2019s curve()" },
    { label: "DEX fee collector", short: "FEES", kind: "contract", chain: RHC, note: "0x4cd00e387622c35bddb9b4c962c136462338bc31 — 17,258 chars; 443.92 ETH (≈$1.11M) accumulated from the ~$93M trading volume" },
    { label: "Pool factory (Uniswap V2-style)", short: "PFAC", kind: "contract", chain: RHC, note: "0x6131b5fae19ea4f9d964eac0408e4408b66337b5 — 27,450 chars; createPair called on it 8 times (selector 0xb9303701); owner EOA 0x1874028262f1f4b2dd1f2700a72ee8b9b7c69090 (1 tx)" },
    { label: "Robinhood Chain DEX router", short: "RTR", kind: "contract", chain: RHC, note: "0x8876789976decbfcbbbe364623c6 (as printed in the report) — funded by Layer 2 with 12 + 5.95 ETH for trading" },
    { label: "MEV bot / searcher", short: "MEV", kind: "wallet", chain: RHC, note: "0x4337038429b76948ee97eb2d8115513277c3abf5 — EOA, 131,694 txs; professional MEV searcher that processed many SLINK trades" },
    { label: "28 insider wallets", short: "INSIDER", kind: "cluster", chain: RHC, note: "Bought $23–$927 each inside the first minutes (entry mc $8,312–$9,256); extracted ≈$4,832,500 combined; ALL fully exited (0 SLINK)" },
    { label: "Retail FOMO buyers (1,075+ wallets)", short: "BUYERS", kind: "cluster", chain: RHC, note: "80,620 buys + 68,243 sells on the main pair; 9,028 Transfer events total; left holding a −99.3% drawdown" },
    { label: "Compromised @shivon account + @shillink", short: "SOCIAL", kind: "protocol", chain: RHC, note: "X account hijacked Sep 4–5 2026; bio linked fake @shillink; fake nonprofit story; quote-tweet + Musk \u201c💯\u201d; all deleted after the dump; @shillink frozen" },
  ],
  connections: [
    { from: "ROOT", to: "L1", value: "5 ETH", channel: "direct", epistemic: "observed", basis: "Jul 25 03:00 IST", when: "JUL 25 03:00 IST", txHash: "" },
    { from: "ROOT", to: "L1", value: "2.53 ETH", channel: "direct", epistemic: "observed", basis: "Jul 25 03:17 IST", when: "JUL 25 03:17 IST", txHash: "" },
    { from: "ROOT", to: "L1", value: "2.91 ETH", channel: "direct", epistemic: "observed", basis: "Jul 25 03:41 IST", when: "JUL 25 03:41 IST", txHash: "" },
    { from: "ROOT", to: "L1", value: "2.56 ETH", channel: "direct", epistemic: "observed", basis: "Jul 25 04:07 IST", when: "JUL 25 04:07 IST", txHash: "" },
    { from: "ROOT", to: "L1", value: "2.59 ETH", channel: "direct", epistemic: "observed", basis: "Jul 25 04:34 IST · ~15.6 ETH total into Layer 1", when: "JUL 25 04:34 IST", txHash: "" },
    { from: "L1", to: "L2", value: "0.178 ETH", channel: "direct", epistemic: "observed", basis: "Aug 6 01:58 IST", when: "AUG 6 01:58 IST", txHash: "" },
    { from: "L2", to: "L3", value: "0.25 ETH", channel: "direct", epistemic: "observed", basis: "Aug 20 03:31 IST", when: "AUG 20 03:31 IST", txHash: "" },
    { from: "L2", to: "L3", value: "46.49 ETH", channel: "direct", epistemic: "observed", basis: "Aug 20 03:33 IST", when: "AUG 20 03:33 IST", txHash: "" },
    { from: "L2", to: "RTR", value: "12 ETH + 5.95 ETH", channel: "direct", epistemic: "observed", basis: "DEX router funding — for trading", when: "AUG 20", txHash: "" },
    { from: "L3", to: "L4", value: "46.49 ETH", channel: "direct", epistemic: "observed", basis: "Aug 20 03:33 IST — same minute pass-through", when: "AUG 20 03:33 IST", txHash: "" },
    { from: "L4", to: "DEPLOY", value: "0.198 ETH", channel: "direct", epistemic: "observed", basis: "block 0x33cc551 · tx 0x9edc6f938bcb2294b6d5fe3cc28cbdb1…", when: "SEP 5 00:51 IST", txHash: "0x9edc6f938bcb2294b6d5fe3cc28cbdb1…" },
    { from: "DEPLOY", to: "FACTORY", value: "GAS ~0.0005 ETH", channel: "direct", epistemic: "observed", basis: "nonce 0 — token factory deployed first", when: "SEP 5 02:05 IST", txHash: "" },
    { from: "DEPLOY", to: "PFAC", value: "8 × createPair", channel: "direct", epistemic: "observed", basis: "selector 0xb9303701 (Uniswap V2 createPair) called 8× on 0xef4fb24ad09162…; pools at nonces 1–7 (11:34–11:38 IST), final setup nonce 8 (12:25 IST)", when: "SEP 5 11:34–12:25 IST", txHash: "" },
    { from: "FACTORY", to: "TOKEN", value: "CREATE2 deploy", channel: "direct", epistemic: "observed", basis: "factory deployment pattern — full 1B supply minted in constructor", when: "SEP 5 12:25 IST", txHash: "" },
    { from: "TOKEN", to: "VAULT", value: "1,000,000,000 SLINK", channel: "direct", epistemic: "observed", basis: "constructor sent the full supply to the initial vault", when: "SEP 5 (CONSTRUCTOR)", txHash: "" },
    { from: "VAULT", to: "POOL", value: "SLINK (initial distribution)", channel: "direct", epistemic: "observed", basis: "vault distributed SLINK to the liquidity pool and early buyers; fully drained", when: "SEP 5", txHash: "" },
    { from: "VAULT", to: "INSIDER", value: "EARLY BUYS $23–$927", channel: "direct", epistemic: "observed", basis: "insider entry market caps $8,312–$9,256 — matching the Instagram \u201c$8k mc\u201d / \u201c$9k mc\u201d claims", when: "SEP 5 (FIRST MINUTES)", txHash: "" },
    { from: "SOCIAL", to: "BUYERS", value: "FOMO TRIGGER", channel: "direct", epistemic: "observed", basis: "hijacked @shivon quote-tweeted the contract; Elon Musk replied 💯; promotional post deleted after the dump", when: "SEP 4–5", txHash: "" },
    { from: "BUYERS", to: "POOL", value: "≈$93M VOLUME", channel: "direct", epistemic: "observed", basis: "80,620 buys + 68,243 sells on the main pair; $81,188,280 24h volume on SLINK/USDG alone; all buyers\u2019 ETH went here", when: "SEP 5", txHash: "" },
    { from: "INSIDER", to: "POOL", value: "≈$4,832,500 EXTRACTED", channel: "direct", epistemic: "observed", basis: "28 wallets sold into the pool (e.g. top wallet: 50 sell txs); P&L verified from Transfer events", when: "SEP 5 15:28–17:00 IST", txHash: "" },
    { from: "POOL", to: "FEES", value: "443.92 ETH FEES", channel: "direct", epistemic: "observed", basis: "DEX trading fee collector accumulated ≈$1.1M from the $93M volume", when: "SEP 5", txHash: "" },
  ],
  chapters: [
    {
      kicker: "The setup",
      title: "A hijacked account, a fake nonprofit, a Musk reply",
      body:
        "Shivon Zilis — Yale graduate, Bloomberg Beta founding partner, Tesla Autopilot alum, Director of Operations at Neuralink — was not a participant in any of this. On September 4–5, 2026, her X account (@shivon) was compromised by hackers who executed a prepared social-engineering script. The bio was updated to link @neuralink and a fake account, @shillink.\n\n@shillink posted the story: a nonprofit \u201cMIT student experiment\u201d connecting five paralyzed Neuralink patients via brain implants, funded by $SLINK transaction taxes. Then @shivon quote-tweeted the contract address — \u201cI rarely post about crypto besides DOGE, but what these young folks are doing really impresses me\u201d — and Elon Musk replied with a single emoji: 💯. That was the trigger. When the dump came, the promotional post was deleted. All tweets have since been deleted and @shillink has been frozen.",
      facts:
        "observed | @shivon bio updated to link @neuralink + fake @shillink\nobserved | @shillink story: 5 paralyzed Neuralink patients, funded by $SLINK transaction taxes\nobserved | Quote-tweet of the contract address · Elon Musk replied 💯\nobserved | Post deleted after the dump · @shillink frozen",
      focus: "SOCIAL, TOKEN, BUYERS",
    },
    {
      kicker: "Seventy-five minutes",
      title: "Launch to $82,000,000 before lunch was over",
      body:
        "The token went live at 08:42:58 UTC on September 5, 2026 — 14:12:58 IST — with the first transfer at block 55,061,075. From a market cap of roughly $8K, the pump ran seventy-five minutes without pause. At 09:58:13 UTC (15:28:13 IST), block 55,108,875, SLINK printed its all-time high: $82,000,000 market cap, ~$0.082 per token.\n\nThe density at the top says everything about the mania: 83 transfers in a single block at peak. Across its whole life the token recorded 9,028 Transfer events across 1,075+ unique wallets, and the main pair alone processed 80,620 buys against 68,243 sells in 24 hours.",
      facts:
        "observed | First transfer Sep 5 14:12:58 IST · block 55,061,075\nobserved | ATH $82,000,000 · ~$0.082/SLINK · block 55,108,875 · 75 min after launch\nobserved | 83 transfers in a single block at peak\nobserved | 9,028 Transfer events · 1,075+ unique wallets",
      focus: "TOKEN, POOL, BUYERS",
    },
    {
      kicker: "The road in",
      title: "Five layers, forty-two days",
      body:
        "The money that built SLINK did not start anywhere near the deployer. The trail begins at a root wallet — 0xf70da978…dbef, 1,625,315 transactions, first activity May 8, 2026 — whose profile is consistent with a CEX hot wallet or bridge withdrawal address. On July 25, between 03:00 and 04:34 IST, it pushed five transfers totalling ~15.6 ETH into Layer 1, a 566,539-transaction intermediary.\n\nFrom there the obfuscation thickens: 0.178 ETH to Layer 2 on August 6, then 0.25 + 46.49 ETH to Layer 3 on August 20, forwarded to Layer 4 — a 20,931-transaction trading bot holding 392.18 ETH — in the same minute. Layer 4 finally sent 0.198 ETH to the deployer at 00:51 IST on launch day. Five layers, forty-two days of preparation, and barely enough ETH at the end to pay for gas and contract deployment.",
      facts:
        "observed | Root 0xf70da978…dbef · 1,625,315 txs · profile consistent with CEX/bridge hot wallet\nobserved | Five transfers Jul 25 03:00–04:34 IST · ~15.6 ETH into Layer 1\nobserved | 0.198 ETH reached the deployer Sep 5 00:51 IST · block 0x33cc551\nunknown | Whether the root is a CEX withdrawal or a bridge — requires cross-chain analysis",
      focus: "ROOT, L1, L2, L3, L4, DEPLOY",
    },
    {
      kicker: "The hand",
      title: "Fifteen transactions, seven figures of setup",
      body:
        "The deployer — 0x79ba699e…95e3, an EOA with just 15 transactions and 0.187 ETH — is verified through the SLINK contract\u2019s own deployer() function (selector 0xd5f39488, confirmed on 4byte.directory). Its activity is a study in economy: at 02:05 IST on launch day it deployed the token factory (nonce 0). Between 11:34 and 11:38 IST it called createPair seven times (nonces 1–7), and at 12:25 IST the final setup transaction (nonce 8) deployed SLINK itself through the factory via CREATE2. Total gas: ~0.01 ETH.\n\nTwo details matter. First, the deployer is NOT one of the 28 insider wallets — separate wallets handled the insider trading, keeping the creation hand clean. Second, the factory owns the deploy: the factory-owner is an ERC-1967 minimal proxy sitting on 186.86 ETH — while the visible deployer holds pocket change.",
      facts:
        "observed | Deployer verified via deployer() · selector 0xd5f39488 · 4byte.directory\nobserved | Nonce 0 factory (02:05 IST) · nonces 1–7 createPair (11:34–11:38 IST) · nonce 8 SLINK deploy (12:25 IST)\nobserved | Deployer called 0xef4fb24ad09162… 8× with selector 0xb9303701 (Uniswap V2 createPair)\nobserved | Deployer is NOT one of the 28 insider wallets",
      focus: "DEPLOY, FACTORY, PFAC, TOKEN",
    },
    {
      kicker: "The machine",
      title: "An immutable token and a hungry periphery",
      body:
        "The SLINK token contract itself is clean — and deliberately so. It is a 6,498-character ERC-20 with no owner function (the call reverts), empty storage slots 0 and 1, and total supply 1,000,000,000 × 10^18 sitting in slot 2. The entire billion was minted in the constructor; across all 9,028 Transfer events there is not a single mint. Nobody can mint more, pause transfers, or withdraw from the contract. The token is immutable — a trust costume for the operation built around it.\n\nThat periphery is where the value pooled. The initial vault received the full supply and distributed it to the liquidity pool and early buyers before draining to zero. The main SLINK/ETH pool now holds 13,760.87 ETH (≈$34.4M). The DEX fee collector accumulated 443.92 ETH (≈$1.11M) from the ~$93M volume. A secondary pool holds 53.11 ETH, and a professional MEV bot with 131,694 transactions processed a large share of the trading. And the factory\u2019s owner — that 344-character proxy — holds 186.86 ETH.",
      facts:
        "observed | owner() reverts · slots 0–1 empty · slot 2 = 1,000,000,000 × 10^18\nobserved | Zero mint events across all 9,028 Transfer events — full supply minted in constructor\nobserved | Main pool 13,760.87 ETH (≈$34.4M) · fee collector 443.92 ETH (≈$1.11M)\nassessed | Factory-owner proxy (186.86 ETH ≈ $467K) — likely where the deployer\u2019s REAL profits sit",
      focus: "TOKEN, VAULT, POOL, FEES, PROXY",
    },
    {
      kicker: "The twenty-eight",
      title: "Every one of them fully exited",
      body:
        "Twenty-eight wallets bought inside the first minutes, when the market cap read $8,312–$9,256 — matching the \u201c$8k mc\u201d and \u201c$9k mc\u201d entries the operators later posted on Instagram. Entry tickets were tiny: $23 to $927 per wallet. The two largest are fully traced through their Transfer events. Wallet #1 bought 11,019,565.91 SLINK for ~$102 in a single transaction and sold in 50 sells for ~$367,700 — 3,605x, fully exited. Wallet #2 bought 17,804,969.83 SLINK for ~$148 across 3 buys and sold across 128 sells for ~$346,000 — 2,338x, fully exited.\n\nThe pattern holds across the roster: highest individual ROI 6,326x ($23 → $145,500), combined extraction ≈$4,832,500, and every single one of the 28 wallets at 0 SLINK. Roughly 631 ETH (≈$1.58M) still sits in these wallets on Robinhood Chain — eleven of them hold ~580 ETH (≈$1.45M) and have not yet withdrawn.",
      facts:
        "observed | All 28 insider wallets: 0 SLINK remaining — fully exited\nobserved | Top wallet: $102 → $367,700 (3,605x) · 1 buy, 50 sells\nobserved | Highest ROI: 6,326x ($23 → $145,500)\nobserved | 11 wallets still sit on ~580 ETH (≈$1.45M) on Robinhood Chain",
      focus: "INSIDER, POOL, VAULT",
    },
    {
      kicker: "Show the math",
      title: "Why $82,000,000 holds up",
      body:
        "The ATH claim survives arithmetic. At $0.082 per token, the pool\u2019s 111M SLINK was worth ~$9.1M, and the ETH side — swollen by the flood of buyers — is estimated at ~$55M at the peak. Total pool value of $64M–82M is consistent with an $82M market cap. After the dump, the verified state is 13,760.87 ETH (≈$34.4M) against 116,464,855 now near-worthless SLINK — meaning sellers extracted ~$20.6M of ETH from the pool on the way down.\n\nDexScreener corroborates the shape of the day: 30 trading pairs found, the main SLINK/USDG pair showing $81,188,280 of 24-hour volume and 80,620 buys against 68,243 sells, price down 98.15% in 24 hours. Current state: $0.000553 per token, $553,000 market cap — 99.3% below the peak. With 9,028 transfers at an average trade size of ~$10K, the ~$93M total volume figure is plausible.",
      facts:
        "observed | Pool at ATH: ~$55M ETH side · $64M–$82M total — consistent with the $82M claim\nobserved | Pool now: 13,760.87 ETH (≈$34.4M) · ~$20.6M extracted by sellers\nobserved | DexScreener: 30 pairs · main pair $81,188,280 24h volume · −98.15% price",
      focus: "POOL, FEES, BUYERS",
    },
    {
      kicker: "Three hours",
      title: "The whole arc, then the silence",
      body:
        "The pump took seventy-five minutes. The dump took roughly ninety. Between 15:28 and 17:00 IST, the promotional tweet was deleted, the 28 insider wallets pulled $4.7M+ out of the pool, and the ETH side drained from ~$55M to $34.4M. The last visible activity on-chain was around 17:00 IST at block 55,153,827. Total active window: about three hours.\n\nWhat remains is the residue this dossier is built from: a supply-side story that never existed, 9,028 transfers across 1,075+ wallets, ≈$4.83M moved to insider wallets — ~580 ETH of it still parked on Robinhood Chain — 186.86 ETH on the factory-owner proxy, and a funding root that only cross-chain analysis can name. The chain does not know the story. It never does.",
      facts:
        "observed | Pump: 75 minutes · dump: ~90 minutes · active window ~3 hours\nobserved | Last visible activity ~17:00 IST · block 55,153,827\nunknown | Real-world identity of the hijackers — not established in this report",
      focus: "TOKEN, INSIDER, ROOT",
    },
  ],
  findings: [
    {
      title: "28 pre-positioned wallets extracted ≈$4,832,500 and fully exited",
      epistemic: "observed",
      confidence: "",
      body:
        "Twenty-eight wallets bought $23–$927 of SLINK inside the first minutes at entry market caps of $8,312–$9,256, then sold into the pump for ≈$4,832,500 combined. All 28 wallets verified at 0 SLINK remaining via balanceOf(). Highest individual ROI: 6,326x ($23 → $145,500). Wallets #1–2 P&L fully traced from Transfer events: $102 → $367,700 (3,605x, 50 sells) and $148 → $346,000 (2,338x, 128 sells). Entry market caps match the operators\u2019 Instagram \u201c$8k mc\u201d / \u201c$9k mc\u201d claims.",
    },
    {
      title: "Launch to $82M in 75 minutes; total active life ~3 hours",
      epistemic: "observed",
      confidence: "",
      body:
        "First transfer 08:42:58 UTC Sep 5 2026 (block 55,061,075); ATH $82,000,000 at 09:58:13 UTC (block 55,108,875, ~$0.082/SLINK) — 75 minutes later, with 83 transfers in a single peak block. Dump phase 15:28–17:00 IST drained the pool from ~$55M to $34.4M; last visible activity ~17:00 IST at block 55,153,827. Price settled 99.3% below peak ($0.000553, $553K mc).",
    },
    {
      title: "The factory-owner proxy holds the operator\u2019s real profits",
      epistemic: "assessed",
      confidence: "medium",
      body:
        "The token factory (0x7ed598bc…ec7e) is owned by an ERC-1967 minimal proxy (0x263ed295…19dd) holding 186.86 ETH (≈$467K) — while the deployer EOA itself holds only 0.187 ETH. The deployer created the factory first and deployed SLINK through it via CREATE2, leaving the visible creation hand empty. This is the report\u2019s assessment of where the deployer\u2019s REAL profits sit.",
    },
    {
      title: "The token contract is immutable — no owner, no mint, no pause",
      epistemic: "observed",
      confidence: "",
      body:
        "owner() execution reverts; storage slots 0 and 1 are empty; slot 2 holds exactly 1,000,000,000 × 10^18. The full supply was minted in the constructor and forwarded to the initial vault — zero mint events exist in the entire 9,028-transfer history. No admin can mint more tokens, pause transfers, or withdraw from the contract.",
    },
    {
      title: "The funding root is consistent with a CEX hot wallet or bridge",
      epistemic: "assessed",
      confidence: "medium",
      body:
        "The 5-layer funding trail terminates at 0xf70da978…dbef, an EOA with 1,625,315 transactions and first activity on May 8, 2026. Whether the operator withdrew ETH from a CEX (Binance, OKX, Coinbase) or used a bridge from Ethereum mainnet or another L2 cannot be determined from Robinhood Chain alone — cross-chain analysis is required. The five-layer chain-hopping pattern (Jul 25 → Sep 5, 42 days) is deliberate obfuscation: each intermediary carries a different profile (high-volume bot, pass-through, trading bot).",
    },
  ],
};

let cached: DossierFile | null = null;

/** compile once, reuse everywhere — deterministic */
export function buildSlinkDossier(): DossierFile {
  if (!cached) {
    const result = buildDossier(draft);
    if (!result.ok) throw new Error("SLINK draft failed validation: " + result.errors.join(" | "));
    cached = result.dossier;
  }
  return cached;
}
