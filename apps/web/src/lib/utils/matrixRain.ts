/**
 * Pure, DOM-free helpers driving the Matrix "digital rain" over the heatmap
 * grid. A drop is a bright head cell falling down one column, trailing a fading
 * tail. These functions own the simulation math; the component owns the canvas.
 */
import {
  CALM_FOCAL_X,
  CALM_FOCAL_Y,
  CALM_RADIUS,
  CALM_STRENGTH,
  COLUMN_DROP_FRACTION,
  SPEED_ROWS_PER_SEC,
  TRAIL_LEN,
} from "../../constants/heatmapBackground";

export interface Drop {
  /** Column index the drop falls down. */
  col: number;
  /** Head row position (float); may be negative while entering from the top. */
  head: number;
  /** Fall speed in grid-rows per second. */
  speed: number;
  /** Trail length in cells behind the head. */
  trail: number;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Create a single drop. `initial` scatters heads across the whole column so the
 * screen starts mid-storm; otherwise the drop re-enters from above the top with
 * a randomised gap so recycled drops don't fall in lockstep.
 */
function spawnDrop(cols: number, rows: number, initial: boolean): Drop {
  const trail = Math.round(randRange(TRAIL_LEN[0], TRAIL_LEN[1]));
  return {
    col: Math.floor(Math.random() * cols),
    speed: randRange(SPEED_ROWS_PER_SEC[0], SPEED_ROWS_PER_SEC[1]),
    trail,
    head: initial ? randRange(-trail, rows) : -randRange(trail, trail + rows * 0.5),
  };
}

/** Build the sparse initial set of drops for a grid of `cols × rows`. */
export function createDrops(cols: number, rows: number): Drop[] {
  const count = Math.max(1, Math.round(cols * COLUMN_DROP_FRACTION));
  const drops: Drop[] = [];
  for (let i = 0; i < count; i++) drops.push(spawnDrop(cols, rows, true));
  return drops;
}

/**
 * Advance every drop by `dt` seconds, recycling any whose trail has fully
 * cleared the bottom. Mutates `drops` in place.
 */
export function stepDrops(
  drops: Drop[],
  cols: number,
  rows: number,
  dt: number,
): void {
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    drop.head += drop.speed * dt;
    if (drop.head - drop.trail > rows) drops[i] = spawnDrop(cols, rows, false);
  }
}

/**
 * Alpha for a cell `distance` cells behind a drop's head: 1 at the head, eased
 * fade to 0 at the end of the trail, 0 outside the trail.
 */
export function trailAlpha(distance: number, trail: number): number {
  if (distance < 0 || distance > trail) return 0;
  const t = 1 - distance / trail;
  return t * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Multiplier (0..1) that calms the rain near the hero. ~`1 - CALM_STRENGTH` at
 * the focal centre, easing back to 1 toward the viewport edges.
 */
export function centerCalm(x: number, y: number, w: number, h: number): number {
  const fx = CALM_FOCAL_X * w;
  const fy = CALM_FOCAL_Y * h;
  const half = Math.hypot(w, h) / 2;
  const t = Math.min(1, Math.hypot(x - fx, y - fy) / (half * CALM_RADIUS));
  return 1 - CALM_STRENGTH + CALM_STRENGTH * smoothstep(t);
}
