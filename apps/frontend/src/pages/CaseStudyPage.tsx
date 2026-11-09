import { Link, useParams } from "react-router-dom";
import { Card } from "../components/Card";
import { Markdown } from "../components/Markdown";
import { ResourceList } from "../components/ResourceList";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { useCaseStudy, useTopic } from "../features/courses/hooks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageFrame } from "../layouts/PageFrame";
import { AREAS, paths } from "../lib/catalog";
import styles from "./pages.module.css";

export function CaseStudyPage() {
  const { category: categorySlug = "", topic: topicSlug = "" } = useParams();
  const area = AREAS.specials;
  const topic = useTopic(categorySlug, topicSlug);
  const caseStudyId = topic.data?.caseStudy?.id;
  const caseStudy = useCaseStudy(caseStudyId);
  useDocumentTitle(caseStudy.data?.title ?? area.label);

  const areaLink = (
    <Link
      to={paths.category(area.key, categorySlug)}
      className={styles.areaLink}
      style={{ color: area.accentText }}
    >
      {area.label}
    </Link>
  );

  return (
    <PageFrame>
      {topic.isPending ? (
        <LoadingState />
      ) : topic.isError ? (
        <ErrorState error={topic.error} onRetry={() => topic.refetch()} />
      ) : !caseStudyId ? (
        <>
          {areaLink}
          <EmptyState title="No Special for this topic yet" />
        </>
      ) : caseStudy.isPending ? (
        <LoadingState />
      ) : caseStudy.isError ? (
        <ErrorState error={caseStudy.error} onRetry={() => caseStudy.refetch()} />
      ) : (
        <article>
          {areaLink}
          <h1 className={styles.plainTitle}>{caseStudy.data.title}</h1>
          <Card variant="plain" className={styles.contentFrame}>
            <Markdown>{caseStudy.data.content}</Markdown>
          </Card>
          <ResourceList resources={caseStudy.data.resources} />
        </article>
      )}
    </PageFrame>
  );
}
