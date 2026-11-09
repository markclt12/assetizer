import type { ReactNode } from "react";
import { Card } from "../components/Card";
import styles from "./PageFrame.module.css";

/** The large outlined frame every inner page sits in (from the sketches). */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <Card className={styles.frame}>{children}</Card>
    </div>
  );
}
