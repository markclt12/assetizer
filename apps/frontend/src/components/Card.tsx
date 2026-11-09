import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Border color (CSS value). Defaults to ink. */
  accent?: string;
  /** Second, offset stroke in this color, like the double-outlined sketch cards. */
  echo?: string;
  variant?: "sketch" | "plain";
}

/** Outlined, slightly hand-drawn box used for frames and cards throughout the site. */
export function Card({ accent, echo, variant = "sketch", className, style, ...props }: CardProps) {
  const vars = {
    ...(accent ? { "--card-accent": accent } : {}),
    ...(echo ? { "--card-echo": echo } : {}),
  } as CSSProperties;
  const classes = [styles.card, styles[variant], echo ? styles.echo : "", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} style={{ ...vars, ...style }} {...props} />;
}
