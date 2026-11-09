import { Link } from "react-router-dom";
import type { CategorySummaryDto } from "@assetizers/shared";
import { Card } from "../../components/Card";
import { categoryAccent } from "../../lib/catalog";
import styles from "./CategoryCard.module.css";

export function CategoryCard({
  category,
  to,
  echo,
}: {
  category: CategorySummaryDto;
  to: string;
  /** Second outline color (the sketches double-stroke these cards). */
  echo?: string;
}) {
  const { accent } = categoryAccent(category.slug);
  return (
    <Link to={to} className={styles.link}>
      <Card accent={accent} echo={echo} className={styles.card}>
        <span className={styles.title}>{category.title}</span>
      </Card>
    </Link>
  );
}
