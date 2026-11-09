import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AdminCategoryDetailDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { EmptyState, ErrorState, LoadingState } from "../../components/States";
import { useAdminCategories, useAdminMutation } from "../../features/admin/api";
import {
  AdminHeader,
  CheckboxField,
  FormError,
  Panel,
  ReorderButtons,
  TextField,
  adminStyles as styles,
  moveId,
  slugify,
} from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../lib/api";

export function DashboardPage() {
  useDocumentTitle("Admin");
  const categories = useAdminCategories();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const create = useAdminMutation(() =>
    api.post<AdminCategoryDetailDto>("/api/admin/courses", { title, slug, description, isPublished }),
  );
  const reorder = useAdminMutation((ids: string[]) => api.patch("/api/admin/courses/reorder", { ids }));
  const togglePublish = useAdminMutation((vars: { id: string; isPublished: boolean }) =>
    api.patch(`/api/admin/courses/${vars.id}`, { isPublished: vars.isPublished }),
  );

  return (
    <div className={styles.page}>
      <AdminHeader title="Menu categories" />

      <Panel title="Categories">
        {categories.isPending ? (
          <LoadingState />
        ) : categories.isError ? (
          <ErrorState error={categories.error} onRetry={() => categories.refetch()} />
        ) : categories.data.length === 0 ? (
          <EmptyState title="No categories yet">
            <p>Create Current and Non-current ASSETizers below, or run the seed script.</p>
          </EmptyState>
        ) : (
          <ul className={styles.list}>
            {categories.data.map((category, index) => (
              <li key={category.id} className={styles.listItem}>
                <div className={styles.listMain}>
                  <Link to={`/admin/categories/${category.id}`} className={styles.listTitle}>
                    {category.title}
                  </Link>
                  <span className={styles.meta}>
                    /{category.slug} · {category.topicCount} topic{category.topicCount === 1 ? "" : "s"}{" "}
                    <span className={`${styles.badge} ${category.isPublished ? styles.published : styles.draft}`}>
                      {category.isPublished ? "Published" : "Draft"}
                    </span>
                  </span>
                </div>
                <div className={styles.actions}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={togglePublish.isPending}
                    onClick={() =>
                      togglePublish.mutate({ id: category.id, isPublished: !category.isPublished })
                    }
                  >
                    {category.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <ReorderButtons
                    index={index}
                    count={categories.data.length}
                    disabled={reorder.isPending}
                    onMove={(from, to) =>
                      reorder.mutate(moveId(categories.data.map((c) => c.id), from, to))
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <FormError error={reorder.error ?? togglePublish.error} />
      </Panel>

      <Panel title="Add a category">
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            create.mutate(undefined, {
              onSuccess: (created) => navigate(`/admin/categories/${created.id}`),
            });
          }}
        >
          <div className={styles.row}>
            <TextField
              label="Title"
              value={title}
              placeholder="Current ASSETizers"
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              required
            />
            <TextField
              label="Slug"
              value={slug}
              hint="Used in URLs. Category colors are keyed to 'current' and 'non-current'."
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              required
            />
          </div>
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <CheckboxField label="Published" checked={isPublished} onChange={setIsPublished} />
          <FormError error={create.error} />
          <div className={styles.formFooter}>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating..." : "Create category"}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
