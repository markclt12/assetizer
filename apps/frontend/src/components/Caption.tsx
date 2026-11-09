import styles from "./Caption.module.css";

/** Playful hand-written-feel caption, e.g. "Take a bite!". */
export function Caption({ children }: { children: string }) {
  return <p className={styles.caption}>{children}</p>;
}
