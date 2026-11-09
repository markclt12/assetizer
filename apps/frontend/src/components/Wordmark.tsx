import styles from "./Wordmark.module.css";

const LETTERS = "ASSETizers".split("");
const COLORS = [
  "var(--color-sage)",
  "var(--color-yellow)",
  "var(--color-salmon)",
  "var(--color-red)",
  "var(--color-yellow)",
  "var(--color-cream)",
  "var(--color-sage)",
  "var(--color-yellow)",
  "var(--color-orange)",
  "var(--color-sage)",
];

/**
 * Placeholder for the landing-page wordmark. The final typography is supplied
 * later; replace the contents of this component only.
 */
export function Wordmark() {
  return (
    <h1 className={styles.wordmark} aria-label="ASSETizers">
      {LETTERS.map((letter, index) => (
        <span key={index} aria-hidden style={{ color: COLORS[index % COLORS.length] }}>
          {letter}
        </span>
      ))}
    </h1>
  );
}
