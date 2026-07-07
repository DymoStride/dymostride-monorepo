import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils/tailwindUtils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a subtle hover border lift — handy for clickable cards. */
  interactive?: boolean;
}

/**
 * The surface primitive every panel in the app is built on:
 * `#15141d` fill, hairline border, rounded corners.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-line bg-surface",
        interactive && "transition-colors hover:border-line-strong",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
