import { cn } from "../utils/tailwindUtils";

export type ButtonVariant =
  | "primary"
  | "outlineBrand"
  | "outline"
  | "soft"
  | "surface";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[11px] font-semibold " +
  "cursor-pointer transition-[background-color,border-color,filter,box-shadow] duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-brand-ink font-bold shadow-[0_8px_24px_-6px_rgba(74,222,128,0.5)] hover:brightness-105 active:brightness-95",
  outlineBrand:
    "border border-brand/50 bg-transparent text-brand hover:bg-brand/10",
  outline:
    "border border-line bg-transparent text-body hover:border-line-strong hover:bg-surface",
  soft: "border border-brand/30 bg-brand/10 text-brand-soft hover:bg-brand/20",
  surface:
    "border border-line bg-surface text-body hover:border-line-strong hover:bg-surface-hover",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-4 py-3 text-[14.5px]",
  lg: "px-6 py-3.5 text-[15.5px]",
};

/** Shared class resolver so `Button` and `ButtonLink` stay pixel-identical. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}
