import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AdminActivityDto, AdminQuestionDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/Modal";
import { ErrorState, LoadingState } from "../../components/States";
import { useAdminActivity, useAdminMutation } from "../../features/admin/api";
import {
  QuestionEditor,
  emptyQuestion,
  toDraft,
  type QuestionDraft,
} from "../../features/admin/QuestionEditor";
import {
  AdminHeader,
  FormError,
  Panel,
  ReorderButtons,
  TextField,
  adminStyles as styles,
  moveId,
} from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../lib/api";

const toBody = (draft: QuestionDraft) => ({
  ...draft,
  explanation: draft.explanation || null,
});

export function ActivityEditorPage() {
  const { id = "" } = useParams();
  const activity = useAdminActivity(id);
  useDocumentTitle(activity.data ? `Edit ${activity.data.title}` : "Edit Practice Bite");

  if (activity.isPending) return <LoadingState />;
  if (activity.isError) return <ErrorState error={activity.error} onRetry={() => activity.refetch()} />;
  return <ActivityEditor key={activity.data.id} activity={activity.data} />;
}

function ActivityEditor({ activity }: { activity: AdminActivityDto }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(activity.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newKey, setNewKey] = useState(0);

  const saveTitle = useAdminMutation(() => api.patch(`/api/admin/activities/${activity.id}`, { title }));
  const remove = useAdminMutation(() => api.delete(`/api/admin/activities/${activity.id}`));
  const reorder = useAdminMutation((ids: string[]) => api.patch("/api/admin/questions/reorder", { ids }));
  const create = useAdminMutation((draft: QuestionDraft) =>
    api.post<AdminQuestionDto>("/api/admin/questions", { activityId: activity.id, ...toBody(draft) }),
  );

  return (
    <div className={styles.page}>
      <AdminHeader
        crumbs={[
          { label: "Menu", to: "/admin" },
          { label: activity.category.title, to: `/admin/categories/${activity.category.id}` },
          { label: activity.topic.title, to: `/admin/topics/${activity.topic.id}` },
        ]}
        title={activity.title}
        actions={
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Delete Practice Bite
          </Button>
        }
      />

      <Panel title="Practice Bite">
        <form
          className={styles.inlineForm}
          style={{ marginTop: 0 }}
          onSubmit={(event) => {
            event.preventDefault();
            saveTitle.mutate();
          }}
        >
          <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <Button type="submit" disabled={saveTitle.isPending}>
            Save title
          </Button>
          {saveTitle.isSuccess && <span className={styles.success}>Saved</span>}
        </form>
        <FormError error={saveTitle.error} />
      </Panel>

      <Panel title={`Questions (${activity.questions.length})`}>
        <div className={styles.list}>
          {activity.questions.length === 0 && <p className={styles.empty}>No questions yet.</p>}
          {activity.questions.map((question, index) => (
            <ExistingQuestion
              key={`${question.id}-${question.position}`}
              question={question}
              index={index}
              count={activity.questions.length}
              reorderPending={reorder.isPending}
              onMove={(from, to) => reorder.mutate(moveId(activity.questions.map((q) => q.id), from, to))}
            />
          ))}
        </div>
        <FormError error={reorder.error} />
      </Panel>

      <Panel title="Add a question">
        <QuestionEditor
          key={newKey}
          heading={`Question ${activity.questions.length + 1}`}
          initial={emptyQuestion()}
          submitLabel="Add question"
          pending={create.isPending}
          error={create.error}
          onSubmit={(draft) => create.mutate(draft, { onSuccess: () => setNewKey((key) => key + 1) })}
        />
      </Panel>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${activity.title}"?`}
        description="This permanently deletes the Practice Bite and all of its questions."
        pending={remove.isPending}
        onConfirm={() =>
          remove.mutate(undefined, { onSuccess: () => navigate(`/admin/topics/${activity.topic.id}`) })
        }
      />
    </div>
  );
}

function ExistingQuestion({
  question,
  index,
  count,
  reorderPending,
  onMove,
}: {
  question: AdminQuestionDto;
  index: number;
  count: number;
  reorderPending: boolean;
  onMove: (from: number, to: number) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const update = useAdminMutation((draft: QuestionDraft) =>
    api.patch(`/api/admin/questions/${question.id}`, toBody(draft)),
  );
  const remove = useAdminMutation(() => api.delete(`/api/admin/questions/${question.id}`));

  return (
    <>
      <QuestionEditor
        heading={`Question ${index + 1}`}
        initial={toDraft(question)}
        submitLabel={update.isSuccess ? "Saved" : "Save question"}
        pending={update.isPending}
        error={update.error ?? remove.error}
        onSubmit={(draft) => update.mutate(draft)}
        extraActions={
          <span className={styles.actions}>
            <ReorderButtons index={index} count={count} onMove={onMove} disabled={reorderPending} />
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </span>
        }
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this question?"
        description={question.prompt}
        pending={remove.isPending}
        onConfirm={() => remove.mutate(undefined, { onSuccess: () => setConfirmDelete(false) })}
      />
    </>
  );
}
