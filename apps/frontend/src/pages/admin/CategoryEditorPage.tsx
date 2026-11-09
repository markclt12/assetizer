import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AdminCategoryDetailDto, AdminTopicDetailDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/Modal";
import { ErrorState, LoadingState } from "../../components/States";
import { useAdminCategory, useAdminMutation } from "../../features/admin/api";
import { FileUploadField } from "../../features/admin/FileUploadField";
import {
  AdminHeader,
  CheckboxField,
  FormError,
  Panel,
  ReorderButtons,
  TextField,
  adminStyles as styles,
  emptyToNull,
  moveId,
  slugify,
} from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../lib/api";

export function CategoryEditorPage() {
  const { id = "" } = useParams();
  const category = useAdminCategory(id);
  useDocumentTitle(category.data ? `Edit ${category.data.title}` : "Edit category");

  if (category.isPending) return <LoadingState />;
  if (category.isError) return <ErrorState error={category.error} onRetry={() => category.refetch()} />;
  return <CategoryEditor key={category.data.id} category={category.data} />;
}

function CategoryEditor({ category }: { category: AdminCategoryDetailDto }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: category.title,
    slug: category.slug,
    description: category.description,
    thumbnail: category.thumbnail ?? "",
    isPublished: category.isPublished,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicSlug, setTopicSlug] = useState("");

  const save = useAdminMutation(() =>
    api.patch(`/api/admin/courses/${category.id}`, { ...form, thumbnail: emptyToNull(form.thumbnail) }),
  );
  const remove = useAdminMutation(() => api.delete(`/api/admin/courses/${category.id}`));
  const reorder = useAdminMutation((ids: string[]) => api.patch("/api/admin/sections/reorder", { ids }));
  const addTopic = useAdminMutation(() =>
    api.post<AdminTopicDetailDto>("/api/admin/sections", {
      courseId: category.id,
      title: topicTitle,
      slug: topicSlug || slugify(topicTitle),
    }),
  );

  return (
    <div className={styles.page}>
      <AdminHeader
        crumbs={[{ label: "Menu", to: "/admin" }]}
        title={category.title}
        actions={
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Delete category
          </Button>
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
          <TextField
            label="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <FileUploadField
            label="Thumbnail (optional)"
            kind="image"
            value={form.thumbnail}
            onChange={(thumbnail) => setForm({ ...form, thumbnail })}
          />
          <CheckboxField
            label="Published (visible to learners)"
            checked={form.isPublished}
            onChange={(isPublished) => setForm({ ...form, isPublished })}
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

      <Panel title="Topics">
        {category.topics.length === 0 ? (
          <p className={styles.empty}>No topics yet.</p>
        ) : (
          <ul className={styles.list}>
            {category.topics.map((topic, index) => (
              <li key={topic.id} className={styles.listItem}>
                <div className={styles.listMain}>
                  <Link to={`/admin/topics/${topic.id}`} className={styles.listTitle}>
                    {topic.title}
                  </Link>
                  <span className={styles.meta}>
                    /{topic.slug} · {topic.lessonCount} lesson{topic.lessonCount === 1 ? "" : "s"} ·{" "}
                    {topic.activityId ? "Practice Bite ✓" : "no Practice Bite"} ·{" "}
                    {topic.caseStudyId ? "Special ✓" : "no Special"}
                  </span>
                </div>
                <ReorderButtons
                  index={index}
                  count={category.topics.length}
                  disabled={reorder.isPending}
                  onMove={(from, to) => reorder.mutate(moveId(category.topics.map((t) => t.id), from, to))}
                />
              </li>
            ))}
          </ul>
        )}
        <FormError error={reorder.error} />

        <form
          className={styles.inlineForm}
          onSubmit={(event) => {
            event.preventDefault();
            addTopic.mutate(undefined, {
              onSuccess: (created) => navigate(`/admin/topics/${created.id}`),
            });
          }}
        >
          <TextField
            label="New topic title"
            value={topicTitle}
            placeholder="CASHew"
            onChange={(event) => {
              setTopicTitle(event.target.value);
              setTopicSlug(slugify(event.target.value));
            }}
            required
          />
          <TextField
            label="Slug"
            value={topicSlug}
            onChange={(event) => setTopicSlug(event.target.value)}
            required
          />
          <Button type="submit" disabled={addTopic.isPending}>
            Add topic
          </Button>
        </form>
        <FormError error={addTopic.error} />
      </Panel>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${category.title}"?`}
        description="This permanently deletes the category and all of its topics, lessons, Practice Bites and Specials."
        pending={remove.isPending}
        onConfirm={() => remove.mutate(undefined, { onSuccess: () => navigate("/admin") })}
      />
    </div>
  );
}
