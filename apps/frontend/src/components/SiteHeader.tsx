import type { CSSProperties } from "react";
import { NavLink, useMatch } from "react-router-dom";
import { AREA_LIST, paths } from "../lib/catalog";
import { Logo } from "./Logo";
import styles from "./SiteHeader.module.css";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M3 11.5 12 4l9 7.5M5.5 9.5V20h5v-5.5h3V20h5V9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  const isLanding = useMatch("/") !== null;

  return (
    <header className={`container ${styles.header}`}>
      <div className={styles.left}>{isLanding && <Logo />}</div>
      <nav aria-label="Main" className={styles.nav}>
        {!isLanding && (
          <NavLink to={paths.home()} className={styles.home} aria-label="Home" end>
            <HomeIcon />
          </NavLink>
        )}
        {AREA_LIST.map((area) => (
          <NavLink
            key={area.key}
            to={paths.area(area.key)}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
            style={{ "--link-accent": area.accent } as CSSProperties}
          >
            {area.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
