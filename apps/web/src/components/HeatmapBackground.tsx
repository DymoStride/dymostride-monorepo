import { useEffect, useMemo, useState } from "react";
import { buildGrid } from "../lib/utils/heatmap";

/** Cell edge + gap in px → the grid's repeat pitch. */
const CELL = 15;
const GAP = 4;
const PITCH = CELL + GAP;
/** Fixed seed keeps the speckle pattern stable across renders. */
const SEED = 7;

function computeCounts() {
  return {
    cols: Math.ceil(window.innerWidth / PITCH) + 1,
    rows: Math.ceil(window.innerHeight / PITCH) + 1,
  };
}

/**
 * Decorative full-viewport heatmap that sits behind the entire page. Purely
 * visual, so it's hidden from assistive tech and ignores pointer events. The
 * page content is transparent (with frosted-glass panels), letting the grid
 * glow through everywhere.
 */
const HeatmapBackground = () => {
  const [{ cols, rows }, setCounts] = useState(computeCounts);

  useEffect(() => {
    const onResize = () => {
      const next = computeCounts();
      // Only re-render when the cell count actually changes.
      setCounts((prev) =>
        prev.cols === next.cols && prev.rows === next.rows ? prev : next,
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cells = useMemo(() => buildGrid(SEED, cols * rows), [cols, rows]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      <div
        className="opacity-[0.45]"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
          gridAutoRows: `${CELL}px`,
          gap: GAP,
        }}
      >
        {cells.map((cell) => (
          <div key={cell.key} style={{ background: cell.bg, borderRadius: 2 }} />
        ))}
      </div>

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
