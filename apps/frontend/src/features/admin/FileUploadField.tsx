import { useId, useState } from "react";
import type { UploadKind } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { adminStyles as styles } from "./ui";
import { uploadFile } from "./upload";

const ACCEPT: Record<UploadKind, string> = {
  video: "video/mp4,video/webm,video/quicktime",
  image: "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  file: ".pdf,.csv,.txt,.xls,.xlsx,.doc,.docx,.ppt,.pptx",
};

/**
 * URL input plus "upload a file" button. Uploading sends the file straight to
 * storage and fills in the resulting URL; the URL is what gets saved.
 */
export function FileUploadField({
  label,
  kind,
  value,
  onChange,
  hint,
}: {
  label: string;
  kind: UploadKind;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const inputId = useId();
  const fileId = useId();
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      onChange(await uploadFile(file, kind, setProgress));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className={styles.upload}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        value={value}
        placeholder="https://... or /illustrations/..."
        onChange={(event) => onChange(event.target.value)}
      />
      <div className={styles.uploadRow}>
        <input
          id={fileId}
          type="file"
          accept={ACCEPT[kind]}
          className="visually-hidden"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor={fileId} style={{ cursor: "pointer" }}>
            {progress === null ? `Upload ${kind}` : "Uploading..."}
          </label>
        </Button>
        {progress !== null && <progress className={styles.progress} max={100} value={progress} />}
        {value && progress === null && (
          <Button variant="ghost" size="sm" onClick={() => onChange("")}>
            Clear
          </Button>
        )}
      </div>
      {hint && <span className={styles.hint}>{hint}</span>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {kind === "image" && value && <img src={value} alt="" className={styles.preview} />}
    </div>
  );
}
