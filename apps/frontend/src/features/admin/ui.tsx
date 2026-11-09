import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import styles from "./admin.module.css";

export { styles as adminStyles };

export function AdminHeader({
  crumbs = [],
  title,
  actions,
}: {
  crumbs?: { label: string; to: string }[];
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.header}>
      <div>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            {crumbs.map((crumb) => (
              <span key={crumb.to}>
                <Link to={crumb.to}>{crumb.label}</Link> /
              </span>
            ))}
          </nav>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={styles.panel}>
      {title && <h2 className={styles.panelTitle}>{title}</h2>}
      {children}
    </section>
  );
}

export function TextField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} className={styles.input} {...props} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

export function TextAreaField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea id={id} className={styles.textarea} {...props} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

export function FormError({ error }: { error: unknown }) {
  if (!error) return null;
  const details = (error as { details?: { fieldErrors?: Record<string, string[]> } }).details;
  const fieldMessages = details?.fieldErrors
    ? Object.entries(details.fieldErrors).map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    : [];
  return (
    <p className={styles.error} role="alert">
      {error instanceof Error ? error.message : "Something went wrong"}
      {fieldMessages.length > 0 && ` (${fieldMessages.join("; ")})`}
    </p>
  );
}

export function ReorderButtons({
  index,
  count,
  onMove,
  disabled,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  disabled?: boolean;
}) {
  return (
    <span className={styles.reorder}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Move up"
        disabled={disabled || index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        ↑
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Move down"
        disabled={disabled || index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        ↓
      </button>
    </span>
  );
}

/** Returns ids in their new order after moving one item. */
export function moveId(ids: string[], from: number, to: number): string[] {
  const next = [...ids];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Treats an empty input as "clear this value". */
export const emptyToNull = (value: string) => (value.trim() === "" ? null : value.trim());
