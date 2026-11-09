import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type {
  AdminActivityDto,
  AdminCaseStudyDto,
  AdminLessonDto,
  AdminTopicDetailDto,
} from "@assetizers/shared";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/Modal";
import { ErrorState, LoadingState } from "../../components/States";
import { useAdminMutation, useAdminTopic } from "../../features/admin/api";
import { FileUploadField } from "../../features/admin/FileUploadField";
import {
  AdminHeader,
  FormError,
  Panel,
  ReorderButtons,
  TextField,
  adminStyles as styles,
  emptyToNull,
  moveId,
} from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../lib/api";

export function TopicEditorPage() {
  const { id = "" } = useParams();
  const topic = useAdminTopic(id);
  useDocumentTitle(topic.data ? `Edit ${topic.data.title}` : "Edit topic");

  if (topic.isPending) return <LoadingState />;
  if (topic.isError) return <ErrorState error={topic.error} onRetry={() => topic.refetch()} />;
  return <TopicEditor key={topic.data.id} topic={topic.data} />;
}

function TopicEditor({ topic }: { topic: AdminTopicDetailDto }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: topic.title,
    slug: topic.slug,
    illustration: topic.illustration ?? "",
  });
  const [lessonTitle, setLessonTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = useAdminMutation(() =>
    api.patch(`/api/admin/sections/${topic.id}`, {
      ...form,
      illustration: emptyToNull(form.illustration),
    }),
  );
  const remove = useAdminMutation(() => api.delete(`/api/admin/sections/${topic.id}`));
  const reorderLessons = useAdminMutation((ids: string[]) =>
    api.patch("/api/admin/lessons/reorder", { ids }),
  );
  const addLesson = useAdminMutation(() =>
    api.post<AdminLessonDto>("/api/admin/lessons", { sectionId: topic.id, title: lessonTitle }),
  );
  const addActivity = useAdminMutation(() =>
    api.post<AdminActivityDto>("/api/admin/activities", {
      sectionId: topic.id,
      title: `${topic.title} Practice Bite`,
    }),
  );
  const addCaseStudy = useAdminMutation(() =>
    api.post<AdminCaseStudyDto>("/api/admin/case-studies", {
      sectionId: topic.id,
      title: `${topic.title} Case Study`,
    }),
  );

  return (
    <div className={styles.page}>
      <AdminHeader
        crumbs={[
          { label: "Menu", to: "/admin" },
          { label: topic.category.title, to: `/admin/categories/${topic.category.id}` },
        ]}
        title={topic.title}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <a href={`/main-course/${topic.category.slug}/${topic.slug}`} target="_blank" rel="noreferrer">
                Preview
              </a>
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              Delete topic
            </Button>
          </>
        }
      />

      <Panel title="Details">
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <div className={styles.row}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              required
            />
          </div>
          <FileUploadField
            label="Food illustration (the 'element' beside topic lists)"
            kind="image"
            value={form.illustration}
            onChange={(illustration) => setForm({ ...form, illustration })}
            hint="Decorative only: tacos, cashews, nachos... Built-in examples live under /illustrations/."
          />
          <FormError error={save.error} />
          <div className={styles.formFooter}>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save"}
            </Button>
            {save.isSuccess && <span className={styles.success}>Saved</span>}
          </div>
        </form>
      </Panel>

      <Panel title="Main Course: lessons">
        {topic.lessons.length === 0 ? (
          <p className={styles.empty}>No lessons yet.</p>
        ) : (
          <ul className={styles.list}>
            {topic.lessons.map((lesson, index) => (
              <li key={lesson.id} className={styles.listItem}>
                <div className={styles.listMain}>
                  <Link to={`/admin/lessons/${lesson.id}`} className={styles.listTitle}>
                    {lesson.title}
                  </Link>
                  <span className={styles.meta}>
                    {lesson.hasVideo ? "Video ✓" : "No video"} · {lesson.resourceCount} resource
                    {lesson.resourceCount === 1 ? "" : "s"}
                  </span>
                </div>
                <ReorderButtons
                  index={index}
                  count={topic.lessons.length}
                  disabled={reorderLessons.isPending}
                  onMove={(from, to) =>
                    reorderLessons.mutate(moveId(topic.lessons.map((l) => l.id), from, to))
                  }
                />
              </li>
            ))}
          </ul>
        )}
        <FormError error={reorderLessons.error} />
        <form
          className={styles.inlineForm}
          onSubmit={(event) => {
            event.preventDefault();
            addLesson.mutate(undefined, {
              onSuccess: (created) => navigate(`/admin/lessons/${created.id}`),
            });
          }}
        >
          <TextField
            label="New lesson title"
            value={lessonTitle}
            placeholder={`All about ${topic.title}`}
            onChange={(event) => setLessonTitle(event.target.value)}
            required
          />
          <Button type="submit" disabled={addLesson.isPending}>
            Add lesson
          </Button>
        </form>
        <FormError error={addLesson.error} />
      </Panel>

      <div className={styles.row}>
        <Panel title="Practice Bite (quiz)">
          {topic.activity ? (
            <div className={styles.listItem}>
              <div className={styles.listMain}>
                <Link to={`/admin/activities/${topic.activity.id}`} className={styles.listTitle}>
                  {topic.activity.title}
                </Link>
                <span className={styles.meta}>{topic.activity.questionCount} questions</span>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.empty}>No Practice Bite yet.</p>
              <Button
                size="sm"
                style={{ marginTop: "0.75rem" }}
                disabled={addActivity.isPending}
                onClick={() =>
                  addActivity.mutate(undefined, {
                    onSuccess: (created) => navigate(`/admin/activities/${created.id}`),
                  })
                }
              >
                Create Practice Bite
              </Button>
              <FormError error={addActivity.error} />
            </>
          )}
        </Panel>

        <Panel title="Special (case study)">
          {topic.caseStudy ? (
            <div className={styles.listItem}>
              <Link to={`/admin/case-studies/${topic.caseStudy.id}`} className={styles.listTitle}>
                {topic.caseStudy.title}
              </Link>
            </div>
          ) : (
            <>
              <p className={styles.empty}>No Special yet.</p>
              <Button
                size="sm"
                style={{ marginTop: "0.75rem" }}
                disabled={addCaseStudy.isPending}
                onClick={() =>
                  addCaseStudy.mutate(undefined, {
                    onSuccess: (created) => navigate(`/admin/case-studies/${created.id}`),
                  })
                }
              >
                Create Special
              </Button>
              <FormError error={addCaseStudy.error} />
            </>
          )}
        </Panel>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${topic.title}"?`}
        description="This permanently deletes the topic with its lessons, Practice Bite and Special."
        pending={remove.isPending}
        onConfirm={() =>
          remove.mutate(undefined, {
            onSuccess: () => navigate(`/admin/categories/${topic.category.id}`),
          })
        }
      />
    </div>
  );
}
