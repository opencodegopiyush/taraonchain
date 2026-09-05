/* ── v7 TWO EDITIONS — one codebase, two tuned builds ────────
   The package.json scripts bake NEXT_PUBLIC_EDITION at build
   time:  web edition  → richer, longer trails, hover flourishes
          mobile edition → touch-first, brighter short trails,
                           fewer particles, lighter effects.
   Nothing is HARD-GATED: both editions run everywhere; the
   tuning just favours the target device. Same case file, same
   report, same colours. */

export type Edition = "web" | "mobile";

export const EDITION: Edition =
  process.env.NEXT_PUBLIC_EDITION === "mobile" ? "mobile" : "web";

export const TUNE = EDITION === "web"
  ? {
      edition: "web" as Edition,
      chip: "TEST BUILD · V7 · WEB EDITION",
      /* hero trail */
      heroBubbles: 20,
      heroTrailLen: 15,
      heroTrailAlpha: 0.38,
      heroConstellation: 132,
      heroPushRadius: 150,
      heroPushForce: 0.7,
      /* desk comet trails */
      deskTrailLen: 19,
      deskTrailAlpha: 0.52, // clearly visible on big screens
      deskTrailWidth: 0.72,
      /* motion */
      speed: 1.0,
      hoverFx: true,
    }
  : {
      edition: "mobile" as Edition,
      chip: "TEST BUILD · V7 · MOBILE EDITION",
      heroBubbles: 13,
      heroTrailLen: 11,
      heroTrailAlpha: 0.55, // brighter — small screens need it
      heroConstellation: 118,
      heroPushRadius: 140,
      heroPushForce: 0.85, // finger scatter feels stronger
      deskTrailLen: 13,
      deskTrailAlpha: 0.46, // full brightness — never faint on a phone
      deskTrailWidth: 0.66,
      speed: 0.85, // faster-feeling reveals on small screens
      hoverFx: false,
    };
