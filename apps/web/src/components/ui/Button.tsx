import { forwardRef, type ButtonHTMLAttributes } from "react";
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "../../lib/types/buttonVariants";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";
