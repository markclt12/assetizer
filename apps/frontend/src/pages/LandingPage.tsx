import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Wordmark } from "../components/Wordmark";
import { paths } from "../lib/catalog";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  return (
    <section className={`container ${styles.hero}`}>
      <div className={styles.plate}>
        <Wordmark />
        <p className={styles.tagline}>Making Assets Concept, easy to Digest</p>
        <Button asChild variant="outline" size="lg" accent="var(--color-sage)" className={styles.cta}>
          <Link to={paths.area("main-course")}>Continue Dining</Link>
        </Button>
      </div>
    </section>
  );
}
