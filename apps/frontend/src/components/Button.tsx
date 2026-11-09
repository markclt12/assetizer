import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { Slot } from "radix-ui";
import styles from "./Button.module.css";

type Variant = "solid" | "outline" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** CSS color for the accent (defaults to ink). */
  accent?: string;
  /** Render the child element (e.g. a router Link) with button styling. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "solid", size = "md", accent, asChild, className, style, type, ...props },
  ref,
) {
  const Component = asChild ? Slot.Slot : "button";
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
  const accentStyle = accent ? ({ "--accent": accent } as CSSProperties) : undefined;

  return (
    <Component
      ref={ref}
      className={classes}
      style={{ ...accentStyle, ...style }}
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    />
  );
});
