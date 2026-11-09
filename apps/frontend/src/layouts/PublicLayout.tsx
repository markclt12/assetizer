import { Outlet, useMatch } from "react-router-dom";
import { Disclaimer } from "../components/Disclaimer";
import { SiteHeader } from "../components/SiteHeader";
import styles from "./PublicLayout.module.css";

export function PublicLayout() {
  const isLanding = useMatch("/") !== null;

  return (
    <div className={`${styles.shell} ${isLanding ? styles.landing : ""}`}>
      <SiteHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={`container ${styles.footer}`}>
        <Disclaimer />
      </footer>
    </div>
  );
}
