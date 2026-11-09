import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/Button";
import { Markdown } from "../components/Markdown";
import { ResourceList } from "../components/ResourceList";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { VideoPlayer } from "../components/VideoPlayer";
import { useTopic } from "../features/courses/hooks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageFrame } from "../layouts/PageFrame";
import { AREAS, paths } from "../lib/catalog";
import styles from "./pages.module.css";

export function LessonPage() {
  const { category: categorySlug = "", topic: topicSlug = "" } = useParams();
  const query = useTopic(categorySlug, topicSlug);
  const area = AREAS["main-course"];
  const data = query.data;
  const single = data?.lessons.length === 1;
  const title = data ? (single ? data.lessons[0].title : `All about ${data.topic.title}`) : undefined;
  useDocumentTitle(title);

  return (
    <PageFrame>
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : (
        <article>
          <Breadcrumb
            color={area.accentText}
            items={[
              { label: area.label, to: paths.area(area.key) },
              { label: query.data.category.title, to: paths.category(area.key, categorySlug) },
            ]}
          />
          <h1 className={styles.lessonTitle}>{title}</h1>

          {query.data.lessons.length === 0 ? (
            <EmptyState title="This dish is still in the oven">
              <p>Lessons for this topic are coming soon.</p>
            </EmptyState>
          ) : (
            query.data.lessons.map((lesson) => (
              <section key={lesson.id} className={styles.lessonBlock} aria-label={lesson.title}>
                {!single && <h2 className={styles.lessonSubtitle}>{lesson.title}</h2>}
                {lesson.videoUrl && (
                  <div className={styles.video}>
                    <VideoPlayer src={lesson.videoUrl} title={lesson.title} />
                  </div>
                )}
                <Markdown columns>{lesson.content}</Markdown>
                <ResourceList resources={lesson.resources} />
              </section>
            ))
          )}

          {(query.data.activity || query.data.caseStudy) && (
            <div className={styles.nextCourses}>
              <p className={styles.nextLabel}>Still hungry?</p>
              {query.data.activity && (
                <Button asChild variant="outline" accent="var(--area-practice-bites)">
                  <Link to={paths.topic("practice-bites", categorySlug, topicSlug)}>
                    Try the Practice Bite
                  </Link>
                </Button>
              )}
              {query.data.caseStudy && (
                <Button asChild variant="outline" accent="var(--area-specials)">
                  <Link to={paths.topic("specials", categorySlug, topicSlug)}>See today's Special</Link>
                </Button>
              )}
            </div>
          )}
        </article>
      )}
    </PageFrame>
  );
}
