/**
 * Tuning for the animated <HeatmapBackground> (GitHub-style grid + Matrix rain).
 * Kept out of the component so the whole effect can be re-dialled in one place.
 */

/** Cell edge, gap, and resulting repeat pitch in CSS px. */
export const CELL = 15;
export const GAP = 4;
export const PITCH = CELL + GAP;
/** Corner radius of each cell, matching the original DOM grid. */
export const CELL_RADIUS = 2;
/** Seed for the deterministic base speckle — same field of green every load. */
export const SEED = 7;
/** Base grid dimness (the static layer under the rain). */
export const BASE_OPACITY = 0.45;

/** Fraction of columns that carry a falling drop at any time. */
export const COLUMN_DROP_FRACTION = 0.36;
/** Drop fall speed range, in grid-rows per second. */
export const SPEED_ROWS_PER_SEC: readonly [number, number] = [9, 17];
/** Trail length range, in cells, behind each bright head. */
export const TRAIL_LEN: readonly [number, number] = [10, 18];
/** Peak alpha of a drop's leading cell before the center-calm falloff. */
export const HEAD_ALPHA = 1;

/** Bright leading-cell colour and the mid-trail colour (brand green ramp). */
export const RAIN_HEAD_COLOR = "134, 239, 172"; /* #86efac */
export const RAIN_TRAIL_COLOR = "74, 222, 128"; /* #4ade80 */

/**
 * Focal point (as viewport fractions) the rain calms around, matching the
 * hero scrim so text stays readable. `RADIUS` is the fraction of the viewport
 * half-diagonal over which the rain fades back in toward the edges.
 */
export const CALM_FOCAL_X = 0.5;
export const CALM_FOCAL_Y = 0.22;
export const CALM_RADIUS = 0.5;
/** How strongly the focal centre is suppressed (0 = none, 1 = fully dark). */
export const CALM_STRENGTH = 0.55;

/** Cap the backing-store scale so hi-dpi screens don't over-allocate. */
export const MAX_DPR = 2;
