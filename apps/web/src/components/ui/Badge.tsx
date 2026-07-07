import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils/tailwindUtils";

export type BadgeVariant = "soft" | "solid";

const variants: Record<BadgeVariant, string> = {
  soft: "bg-brand/10 border border-brand/25 text-brand-soft",
  solid: "bg-brand text-brand-ink",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Show a glowing status dot before the label. */
  dot?: boolean;
}

/** A rounded pill for statuses, ribbons and announcement chips. */
export function Badge({
  variant = "soft",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
      )}
      {children}
    </span>
  );
}
