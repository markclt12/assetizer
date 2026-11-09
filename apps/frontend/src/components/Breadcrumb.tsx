import { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

export interface Crumb {
  label: string;
  to?: string;
}

/** "Main Course • Current ASSETizers" style trail. */
export function Breadcrumb({ items, color }: { items: Crumb[]; color: string }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.trail} style={{ color }}>
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && (
            <span className={styles.separator} aria-hidden>
              •
            </span>
          )}
          {item.to ? (
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
