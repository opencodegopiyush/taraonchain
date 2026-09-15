import type { CaseFile } from "./types";
import { buildSharavDossier } from "./sharav-draft";
import { buildSlinkDossier } from "./slink-draft";
import { buildBabitaDossier } from "./babita-draft";
import { dossierToCaseFile } from "./case-from-dossier";

/* ── the live case files ───────────────────────────────────────
   the archive carries MULTIPLE published investigations.
   CASES[0] is the newest (BABITA), then SLINK, then SHARAV. CASE remains the live singleton read
   through module live bindings by three/* — the desk subtree
   remounts per case via the store (page.tsx keys CaseDesk by
   case id), so swapping caseFile is always a clean mount.

   every case here is a real, published investigation compiled
   from its on-chain report. no fictional entries. */

export const CASES: CaseFile[] = [
  dossierToCaseFile(buildBabitaDossier()), // B-0913 · BABITA — latest
  dossierToCaseFile(buildSlinkDossier()), // R-0905 · SLINK
  dossierToCaseFile(buildSharavDossier()), // S-0830 · SHARAV
];

export let CASE: CaseFile = CASES[0];

/* swap the live case singleton (kept for compatibility) */
export function setActiveCase(cf: CaseFile) {
  CASE = cf;
}

export function getCaseById(id: string): CaseFile | undefined {
  return CASES.find((c) => c.id === id.toUpperCase());
}
