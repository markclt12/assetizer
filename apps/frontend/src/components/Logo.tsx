import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

/**
 * Placeholder logo. The final logo artwork is supplied later; replace the
 * contents of this component only.
 */
export function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label="ASSETizers home">
      <span className={styles.mark} aria-hidden />
      <span className={styles.text}>Logo</span>
    </Link>
  );
}
