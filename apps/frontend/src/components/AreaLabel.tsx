import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styles from "./AreaLabel.module.css";

/** Outlined pill label, e.g. "Main Course". */
export function AreaLabel({
  label,
  accent,
  accentText,
  to,
}: {
  label: string;
  accent: string;
  accentText: string;
  to?: string;
}) {
  const style = { "--pill-accent": accent, "--pill-text": accentText } as CSSProperties;
  return to ? (
    <Link to={to} className={styles.pill} style={style}>
      {label}
    </Link>
  ) : (
    <span className={styles.pill} style={style}>
      {label}
    </span>
  );
}
