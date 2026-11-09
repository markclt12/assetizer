import { useParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { useActivity } from "../features/activities/hooks";
import { QuizRunner } from "../features/activities/QuizRunner";
import { useTopic } from "../features/courses/hooks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageFrame } from "../layouts/PageFrame";
import { AREAS, paths } from "../lib/catalog";
import styles from "./pages.module.css";

export function QuizPage() {
  const { category: categorySlug = "", topic: topicSlug = "" } = useParams();
  const area = AREAS["practice-bites"];
  const topic = useTopic(categorySlug, topicSlug);
  const activityId = topic.data?.activity?.id;
  const activity = useActivity(activityId);
  useDocumentTitle(topic.data ? `${area.label}: ${topic.data.topic.title}` : area.label);

  const header = topic.data && (
    <div className={styles.headerRow}>
      <h1 className="visually-hidden">
        {area.label}: {topic.data.topic.title}
      </h1>
      <Breadcrumb
        color={area.accentText}
        items={[
          { label: area.label, to: paths.category(area.key, categorySlug) },
          { label: topic.data.topic.title },
        ]}
      />
    </div>
  );

  return (
    <PageFrame>
      {topic.isPending ? (
        <LoadingState />
      ) : topic.isError ? (
        <ErrorState error={topic.error} onRetry={() => topic.refetch()} />
      ) : !activityId ? (
        <>
          {header}
          <EmptyState title="No Practice Bite for this topic yet" />
        </>
      ) : activity.isPending ? (
        <>
          {header}
          <LoadingState label="Plating your questions..." />
        </>
      ) : activity.isError ? (
        <>
          {header}
          <ErrorState error={activity.error} onRetry={() => activity.refetch()} />
        </>
      ) : (
        <>
          {header}
          {activity.data.questions.length === 0 ? (
            <EmptyState title="No questions yet" />
          ) : (
            <QuizRunner key={activity.data.id} activity={activity.data} />
          )}
        </>
      )}
    </PageFrame>
  );
}
