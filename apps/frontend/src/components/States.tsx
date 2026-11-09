import type { ReactNode } from "react";
import { Button } from "./Button";
import styles from "./States.module.css";

export function LoadingState({ label = "Preparing your plate..." }: { label?: string }) {
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.state}>
      <p className={styles.title}>{title}</p>
      {children}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const status = (error as { status?: number } | null)?.status;
  const message =
    status === 404
      ? "We couldn't find that dish on the menu."
      : error instanceof Error
        ? error.message
        : "Something went wrong.";
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <p className={styles.title}>{status === 404 ? "Not found" : "Something burned in the kitchen"}</p>
      <p>{message}</p>
      {onRetry && status !== 404 && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
