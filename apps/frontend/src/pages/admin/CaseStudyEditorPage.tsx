import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AdminCaseStudyDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/Modal";
import { ErrorState, LoadingState } from "../../components/States";
import { useAdminCaseStudy, useAdminMutation } from "../../features/admin/api";
import { MarkdownEditor } from "../../features/admin/MarkdownEditor";
import { ResourcesEditor } from "../../features/admin/ResourcesEditor";
import { AdminHeader, FormError, Panel, TextField, adminStyles as styles } from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../lib/api";

export function CaseStudyEditorPage() {
  const { id = "" } = useParams();
  const caseStudy = useAdminCaseStudy(id);
  useDocumentTitle(caseStudy.data ? `Edit ${caseStudy.data.title}` : "Edit Special");

  if (caseStudy.isPending) return <LoadingState />;
  if (caseStudy.isError) return <ErrorState error={caseStudy.error} onRetry={() => caseStudy.refetch()} />;
  return <CaseStudyEditor key={caseStudy.data.id} caseStudy={caseStudy.data} />;
}

function CaseStudyEditor({ caseStudy }: { caseStudy: AdminCaseStudyDto }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: caseStudy.title, content: caseStudy.content });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = useAdminMutation(() => api.patch(`/api/admin/case-studies/${caseStudy.id}`, form));
  const remove = useAdminMutation(() => api.delete(`/api/admin/case-studies/${caseStudy.id}`));

  return (
    <div className={styles.page}>
      <AdminHeader
        crumbs={[
          { label: "Menu", to: "/admin" },
          { label: caseStudy.category.title, to: `/admin/categories/${caseStudy.category.id}` },
          { label: caseStudy.topic.title, to: `/admin/topics/${caseStudy.topic.id}` },
        ]}
        title={caseStudy.title}
        actions={
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Delete Special
          </Button>
        }
      />

      <Panel title="Special (case study)">
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
          <MarkdownEditor
            label="Content"
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
          />
          <FormError error={save.error} />
          <div className={styles.formFooter}>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save Special"}
            </Button>
            {save.isSuccess && <span className={styles.success}>Saved</span>}
          </div>
        </form>
      </Panel>

      <ResourcesEditor resources={caseStudy.resources} parent={{ caseStudyId: caseStudy.id }} />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${caseStudy.title}"?`}
        description="This permanently deletes the case study and its resource links."
        pending={remove.isPending}
        onConfirm={() =>
          remove.mutate(undefined, { onSuccess: () => navigate(`/admin/topics/${caseStudy.topic.id}`) })
        }
      />
    </div>
  );
}
