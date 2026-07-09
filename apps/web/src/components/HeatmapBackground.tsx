import { useEffect, useRef } from "react";
import { buildGrid } from "../lib/utils/heatmap";
import { cn } from "../lib/utils/tailwindUtils";
import {
  BASE_OPACITY,
  CELL,
  CELL_RADIUS,
  HEAD_ALPHA,
  MAX_DPR,
  PITCH,
  RAIN_HEAD_COLOR,
  RAIN_TRAIL_COLOR,
  SEED,
} from "../constants/heatmapBackground";
import {
  centerCalm,
  createDrops,
  stepDrops,
  trailAlpha,
  type Drop,
} from "../lib/utils/matrixRain";

/** Draw one grid cell as a rounded square (falls back to a plain rect). */
function fillCell(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, CELL, CELL, CELL_RADIUS);
  else ctx.rect(x, y, CELL, CELL);
  ctx.fill();
}

/**
 * Decorative full-viewport background: the GitHub-style heatmap grid rendered
 * on a canvas, with a subtle Matrix "digital rain" of brighter green drops
 * cascading down over it. Purely visual — hidden from assistive tech and
 * non-interactive. Honours `prefers-reduced-motion` by falling back to the
 * static grid (the CSS motion reset can't stop a canvas loop, so we gate it
 * here in JS).
 */
const HeatmapBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Render state, rebuilt whenever the viewport changes size.
    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;
    let drops: Drop[] = [];
    let base: HTMLCanvasElement | null = null;
    let frame = 0;
    let last = 0;

    /** Pre-render the static, dimmed base grid to an offscreen canvas once. */
    const drawBase = (dpr: number) => {
      base = document.createElement("canvas");
      base.width = Math.floor(cssW * dpr);
      base.height = Math.floor(cssH * dpr);
      const bctx = base.getContext("2d");
      if (!bctx) return;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.globalAlpha = BASE_OPACITY;
      const cells = buildGrid(SEED, cols * rows);
      for (let i = 0; i < cells.length; i++) {
        bctx.fillStyle = cells[i].bg;
        fillCell(bctx, (i % cols) * PITCH, Math.floor(i / cols) * PITCH);
      }
    };

    /** Blit just the static base (used for the first paint and reduced-motion). */
    const renderStatic = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      if (base) ctx.drawImage(base, 0, 0, cssW, cssH);
    };

    const resize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cols = Math.ceil(cssW / PITCH) + 1;
      rows = Math.ceil(cssH / PITCH) + 1;

      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawBase(dpr);
      drops = createDrops(cols, rows);
      renderStatic();
    };

    const renderFrame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      ctx.clearRect(0, 0, cssW, cssH);
      if (base) ctx.drawImage(base, 0, 0, cssW, cssH);

      // Additive blend so drops brighten the grid beneath, Matrix-style.
      ctx.globalCompositeOperation = "lighter";
      for (const drop of drops) {
        const headRow = Math.floor(drop.head);
        const x = drop.col * PITCH;
        for (let d = 0; d <= drop.trail; d++) {
          const row = headRow - d;
          if (row < 0 || row >= rows) continue;
          const y = row * PITCH;
          const alpha =
            trailAlpha(d, drop.trail) *
            centerCalm(x + CELL / 2, y + CELL / 2, cssW, cssH) *
            HEAD_ALPHA;
          if (alpha <= 0.01) continue;
          ctx.fillStyle = `rgba(${d === 0 ? RAIN_HEAD_COLOR : RAIN_TRAIL_COLOR}, ${alpha})`;
          fillCell(ctx, x, y);
        }
      }
      ctx.globalCompositeOperation = "source-over";

      stepDrops(drops, cols, rows, dt);
      frame = requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(renderFrame);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    /** Animate unless the user asked for reduced motion or the tab is hidden. */
    const sync = () => {
      stop();
      if (reduceQuery.matches || document.hidden) renderStatic();
      else start();
    };

    resize();
    sync();

    // `resize` repaints the static grid; a running loop picks up new dims next
    // frame, so no extra restart is needed here.
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    reduceQuery.addEventListener("change", sync);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      reduceQuery.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg",
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Ambient glow + a soft scrim behind the hero to keep text legible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(820px 520px at 80% -12%, rgba(139,92,246,0.20), transparent 58%)," +
            "radial-gradient(680px 460px at 6% 2%, rgba(74,222,128,0.08), transparent 55%)," +
            "radial-gradient(120% 80% at 50% 20%, rgba(10,10,15,0.80), rgba(10,10,15,0.12) 58%, transparent 78%)",
        }}
      />
    </div>
  );
};

export default HeatmapBackground;
