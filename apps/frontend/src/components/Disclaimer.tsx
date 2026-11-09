import styles from "./Disclaimer.module.css";

export function Disclaimer() {
  return (
    <p className={styles.disclaimer}>
      ASSETizers is a free educational course. Content is for learning only and is not professional
      accounting, tax, or financial advice.
    </p>
  );
}
