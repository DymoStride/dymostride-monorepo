/**
 * Deterministic heatmap + sparkline data.
 *
 * Ported verbatim from the original Dymostride mockup: a tiny seeded LCG
 * so every grid renders the exact same pattern on every load (no backend,
 * no flicker between server/client). Same seed → same field of green.
 */

/** The five contribution-grid intensity steps, from empty to full. */
export const HEATMAP_LEVELS = [
  "#23222e",
  "rgba(74,222,128,0.3)",
  "rgba(74,222,128,0.55)",
  "rgba(74,222,128,0.78)",
  "#4ade80",
] as const;

export interface HeatCell {
  key: number;
  bg: string;
}

export interface SparkBar {
  key: number;
  h: string;
  bg: string;
}

/** A seeded linear congruential generator matching the source mockup. */
function makeRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Build `n` heatmap cells for a given seed. A year of GitHub-style history
 * is 371 cells (7 rows × 53 weeks).
 */
export function buildGrid(seed: number, n = 371): HeatCell[] {
  const rnd = makeRng(seed);
  const cells: HeatCell[] = [];
  for (let i = 0; i < n; i++) {
    const r = rnd();
    const lvl = r < 0.34 ? 0 : r < 0.55 ? 1 : r < 0.73 ? 2 : r < 0.88 ? 3 : 4;
    cells.push({ key: i, bg: HEATMAP_LEVELS[lvl] });
  }
  return cells;
}

/** Build `n` sparkline bars for a given seed. */
export function buildSpark(seed: number, n: number): SparkBar[] {
  const rnd = makeRng(seed);
  const bars: SparkBar[] = [];
  for (let i = 0; i < n; i++) {
    const h = 20 + Math.round(rnd() * 80);
    bars.push({
      key: i,
      h: `${h}%`,
      bg: h > 65 ? "#4ade80" : "rgba(74,222,128,0.4)",
    });
  }
  return bars;
}
