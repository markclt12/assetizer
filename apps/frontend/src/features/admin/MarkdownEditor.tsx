import { Markdown } from "../../components/Markdown";
import { TextAreaField, adminStyles as styles } from "./ui";

export function MarkdownEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.editorGrid}>
      <TextAreaField
        label={label}
        hint="Markdown: ## heading, ### subheading, - bullet, **bold**, | tables |"
        value={value}
        rows={18}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className={styles.field}>
        <span className={styles.label}>Preview</span>
        <div className={styles.previewPane}>
          {value.trim() ? <Markdown>{value}</Markdown> : <p className={styles.empty}>Nothing yet.</p>}
        </div>
      </div>
    </div>
  );
}
