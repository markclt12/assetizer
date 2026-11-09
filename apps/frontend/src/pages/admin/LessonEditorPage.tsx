import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AdminLessonDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/Modal";
import { ErrorState, LoadingState } from "../../components/States";
import { useAdminLesson, useAdminMutation } from "../../features/admin/api";
import { FileUploadField } from "../../features/admin/FileUploadField";
import { MarkdownEditor } from "../../features/admin/MarkdownEditor";
import { ResourcesEditor } from "../../features/admin/ResourcesEditor";
import {
  AdminHeader,
  FormError,
  Panel,
  TextField,
  adminStyles as styles,
  emptyToNull,
} from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../lib/api";

export function LessonEditorPage() {
  const { id = "" } = useParams();
  const lesson = useAdminLesson(id);
  useDocumentTitle(lesson.data ? `Edit ${lesson.data.title}` : "Edit lesson");

  if (lesson.isPending) return <LoadingState />;
  if (lesson.isError) return <ErrorState error={lesson.error} onRetry={() => lesson.refetch()} />;
  return <LessonEditor key={lesson.data.id} lesson={lesson.data} />;
}

function LessonEditor({ lesson }: { lesson: AdminLessonDto }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl ?? "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = useAdminMutation(() =>
    api.patch(`/api/admin/lessons/${lesson.id}`, { ...form, videoUrl: emptyToNull(form.videoUrl) }),
  );
  const remove = useAdminMutation(() => api.delete(`/api/admin/lessons/${lesson.id}`));

  return (
    <div className={styles.page}>
      <AdminHeader
        crumbs={[
          { label: "Menu", to: "/admin" },
          { label: lesson.category.title, to: `/admin/categories/${lesson.category.id}` },
          { label: lesson.topic.title, to: `/admin/topics/${lesson.topic.id}` },
        ]}
        title={lesson.title}
        actions={
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Delete lesson
          </Button>
        }
      />

      <Panel title="Lesson">
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <TextField
            label="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <FileUploadField
            label="Video (optional)"
            kind="video"
            value={form.videoUrl}
            onChange={(videoUrl) => setForm({ ...form, videoUrl })}
            hint="Upload an MP4/WebM, or paste a YouTube/Vimeo link."
          />
          <MarkdownEditor
            label="Content"
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
          />
          <FormError error={save.error} />
          <div className={styles.formFooter}>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save lesson"}
            </Button>
            {save.isSuccess && <span className={styles.success}>Saved</span>}
          </div>
        </form>
      </Panel>

      <ResourcesEditor resources={lesson.resources} parent={{ lessonId: lesson.id }} />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${lesson.title}"?`}
        description="This permanently deletes the lesson and its resource links."
        pending={remove.isPending}
        onConfirm={() =>
          remove.mutate(undefined, { onSuccess: () => navigate(`/admin/topics/${lesson.topic.id}`) })
        }
      />
    </div>
  );
}
