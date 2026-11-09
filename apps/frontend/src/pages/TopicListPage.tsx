import { useParams } from "react-router-dom";
import { AreaLabel } from "../components/AreaLabel";
import { Breadcrumb } from "../components/Breadcrumb";
import { Caption } from "../components/Caption";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { useCategory } from "../features/courses/hooks";
import { TopicMenu } from "../features/courses/TopicMenu";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageFrame } from "../layouts/PageFrame";
import { AREAS, categoryAccent, paths, type AreaKey } from "../lib/catalog";
import styles from "./pages.module.css";

export function TopicListPage({ areaKey }: { areaKey: AreaKey }) {
  const area = AREAS[areaKey];
  const { category: categorySlug = "" } = useParams();
  const category = useCategory(categorySlug);
  const colors = categoryAccent(categorySlug);
  useDocumentTitle(category.data ? `${area.label}: ${category.data.title}` : area.label);

  const topics = category.data?.topics.filter(area.includes) ?? [];

  return (
    <PageFrame>
      {category.isPending ? (
        <LoadingState />
      ) : category.isError ? (
        <ErrorState error={category.error} onRetry={() => category.refetch()} />
      ) : (
        <>
          {area.listHeading === "pill" ? (
            <>
              <AreaLabel
                label={area.label}
                accent={area.accent}
                accentText={area.accentText}
                to={paths.area(area.key)}
              />
              <h1 className={styles.categoryTitle} style={{ color: colors.accentText }}>
                {category.data.title}
              </h1>
            </>
          ) : (
            <div className={styles.headerRow}>
              <h1 className="visually-hidden">
                {area.label}: {category.data.title}
              </h1>
              <Breadcrumb
                color={area.accentText}
                items={[{ label: area.label, to: paths.area(area.key) }, { label: category.data.title }]}
              />
            </div>
          )}

          {topics.length === 0 ? (
            <EmptyState title="Nothing on this menu yet">
              <p>Topics will appear here once they are published.</p>
            </EmptyState>
          ) : (
            <TopicMenu
              topics={topics}
              accent={areaKey === "main-course" ? colors.accent : area.accent}
              accentText={areaKey === "main-course" ? colors.accentText : area.accentText}
              hrefFor={(topic) => paths.topic(area.key, categorySlug, topic.slug)}
            />
          )}

          {area.listCaption && <Caption>{area.listCaption}</Caption>}
        </>
      )}
    </PageFrame>
  );
}
