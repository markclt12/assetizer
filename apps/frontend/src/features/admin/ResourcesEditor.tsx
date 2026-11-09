import { useState } from "react";
import type { ResourceDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";
import { useAdminMutation } from "./api";
import { FileUploadField } from "./FileUploadField";
import { FormError, Panel, TextField, adminStyles as styles } from "./ui";

/** Downloadable files attached to a lesson or a case study. */
export function ResourcesEditor({
  resources,
  parent,
}: {
  resources: ResourceDto[];
  parent: { lessonId: string } | { caseStudyId: string };
}) {
  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const create = useAdminMutation(() => api.post("/api/admin/resources", { name, fileUrl, ...parent }));
  const remove = useAdminMutation((id: string) => api.delete(`/api/admin/resources/${id}`));

  return (
    <Panel title="Downloadable resources">
      {resources.length === 0 ? (
        <p className={styles.empty}>No resources yet.</p>
      ) : (
        <ul className={styles.list}>
          {resources.map((resource) => (
            <li key={resource.id} className={styles.listItem}>
              <div className={styles.listMain}>
                <a href={resource.fileUrl} target="_blank" rel="noreferrer" className={styles.listTitle}>
                  {resource.name}
                </a>
                <span className={styles.meta}>{resource.fileUrl}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate(resource.id)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <FormError error={remove.error} />

      <form
        className={styles.form}
        style={{ marginTop: "1.25rem" }}
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate(undefined, {
            onSuccess: () => {
              setName("");
              setFileUrl("");
            },
          });
        }}
      >
        <TextField
          label="Resource name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Cash worksheet (PDF)"
          required
        />
        <FileUploadField label="File" kind="file" value={fileUrl} onChange={setFileUrl} />
        <FormError error={create.error} />
        <div className={styles.formFooter}>
          <Button type="submit" size="sm" disabled={create.isPending || !name.trim() || !fileUrl.trim()}>
            {create.isPending ? "Adding..." : "Add resource"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
