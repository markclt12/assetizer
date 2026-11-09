import { AreaLabel } from "../components/AreaLabel";
import { Caption } from "../components/Caption";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { CategoryCard } from "../features/courses/CategoryCard";
import { useCategories } from "../features/courses/hooks";
import { PageFrame } from "../layouts/PageFrame";
import { AREAS, paths, type AreaKey } from "../lib/catalog";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import styles from "./pages.module.css";

/** Main Course / Practice Bites / Specials landing: the Current and Non-current cards. */
export function AreaHubPage({ areaKey }: { areaKey: AreaKey }) {
  const area = AREAS[areaKey];
  const categories = useCategories();
  useDocumentTitle(area.label);

  return (
    <PageFrame>
      <div className={styles.headerRow}>
        <h1 className="visually-hidden">{area.label}</h1>
        <AreaLabel label={area.label} accent={area.accent} accentText={area.accentText} />
      </div>

      {categories.isPending ? (
        <LoadingState />
      ) : categories.isError ? (
        <ErrorState error={categories.error} onRetry={() => categories.refetch()} />
      ) : categories.data.length === 0 ? (
        <EmptyState title="The kitchen is still prepping">
          <p>No categories have been published yet. Check back soon.</p>
        </EmptyState>
      ) : (
        <div className={styles.cards}>
          {categories.data.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              to={paths.category(area.key, category.slug)}
              echo={areaKey === "main-course" ? "var(--color-ink)" : undefined}
            />
          ))}
        </div>
      )}

      {area.hubCaption && <Caption>{area.hubCaption}</Caption>}
    </PageFrame>
  );
}
