import { CELL_OPACITY } from "../../constants/style";
import { cn } from "../../lib/utils/tailwindUtils";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** Just the green grid square, no wordmark. Purely decorative. */
export function LogoMark({ size = 30, className }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid flex-none grid-cols-3 rounded-lg bg-brand",
        className,
      )}
      style={{
        width: size,
        height: size,
        gap: size * 0.067,
        padding: size * 0.167,
      }}
    >
      {CELL_OPACITY.map((opacity, i) => (
        <span
          key={i}
          className="rounded-[1px] bg-brand-ink"
          style={{ opacity }}
        />
      ))}
    </span>
  );
}

export interface LogoProps {
  size?: number;
  /** Font size of the "Dymostride" wordmark; omit to hide the wordmark. */
  wordmarkSize?: number | null;
  /** If set, the whole logo becomes an in-page anchor (e.g. "#top"). */
  href?: string;
  className?: string;
}

/** The full Dymostride lockup: grid mark + wordmark. */
export function Logo({
  size = 30,
  wordmarkSize = 19,
  href,
  className,
}: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} />
      {wordmarkSize != null && (
        <span
          className="font-display font-extrabold tracking-[-0.02em] text-heading"
          style={{ fontSize: wordmarkSize }}
        >
          Dymostride
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return <span className={classes}>{content}</span>;
}
