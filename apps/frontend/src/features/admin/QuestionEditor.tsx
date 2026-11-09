import { useId, useState, type ReactNode } from "react";
import type { AdminQuestionDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { FormError, TextAreaField, adminStyles as styles } from "./ui";

export interface QuestionDraft {
  prompt: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export const emptyQuestion = (): QuestionDraft => ({
  prompt: "",
  options: ["", "", "", ""],
  correctIdx: 0,
  explanation: "",
});

export const toDraft = (question: AdminQuestionDto): QuestionDraft => ({
  prompt: question.prompt,
  options: question.options,
  correctIdx: question.correctIdx,
  explanation: question.explanation ?? "",
});

const letter = (index: number) => String.fromCharCode(97 + index);

export function QuestionEditor({
  heading,
  initial,
  submitLabel,
  pending,
  error,
  onSubmit,
  extraActions,
}: {
  heading: ReactNode;
  initial: QuestionDraft;
  submitLabel: string;
  pending: boolean;
  error: unknown;
  onSubmit: (draft: QuestionDraft) => void;
  extraActions?: ReactNode;
}) {
  const groupName = useId();
  const [draft, setDraft] = useState(initial);

  const setOption = (index: number, value: string) =>
    setDraft({ ...draft, options: draft.options.map((option, i) => (i === index ? value : option)) });

  const removeOption = (index: number) => {
    const options = draft.options.filter((_, i) => i !== index);
    const correctIdx =
      draft.correctIdx === index ? 0 : draft.correctIdx > index ? draft.correctIdx - 1 : draft.correctIdx;
    setDraft({ ...draft, options, correctIdx });
  };

  const valid = draft.prompt.trim() && draft.options.length >= 2 && draft.options.every((o) => o.trim());

  return (
    <form
      className={styles.question}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...draft,
          prompt: draft.prompt.trim(),
          options: draft.options.map((option) => option.trim()),
          explanation: draft.explanation.trim(),
        });
      }}
    >
      <div className={styles.questionHeader}>
        <strong>{heading}</strong>
        {extraActions}
      </div>

      <TextAreaField
        label="Question"
        rows={2}
        value={draft.prompt}
        onChange={(event) => setDraft({ ...draft, prompt: event.target.value })}
        style={{ minHeight: "3.5rem", fontFamily: "inherit" }}
        required
      />

      <fieldset className={styles.field} style={{ border: "none", padding: 0, margin: 0 }}>
        <legend className={styles.label}>Options (select the correct answer)</legend>
        {draft.options.map((option, index) => (
          <div key={index} className={styles.optionRow}>
            <input
              type="radio"
              name={groupName}
              aria-label={`Option ${letter(index)} is correct`}
              checked={draft.correctIdx === index}
              onChange={() => setDraft({ ...draft, correctIdx: index })}
            />
            <span>{letter(index)})</span>
            <input
              className={styles.input}
              value={option}
              aria-label={`Option ${letter(index)}`}
              onChange={(event) => setOption(index, event.target.value)}
              required
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Remove option ${letter(index)}`}
              disabled={draft.options.length <= 2}
              onClick={() => removeOption(index)}
            >
              ×
            </button>
          </div>
        ))}
        {draft.options.length < 8 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDraft({ ...draft, options: [...draft.options, ""] })}
            >
              + Add option
            </Button>
          </div>
        )}
      </fieldset>

      <TextAreaField
        label="Explanation (shown after checking)"
        rows={2}
        value={draft.explanation}
        onChange={(event) => setDraft({ ...draft, explanation: event.target.value })}
        style={{ minHeight: "3.5rem", fontFamily: "inherit" }}
      />

      <FormError error={error} />
      <div className={styles.formFooter}>
        <Button type="submit" size="sm" disabled={pending || !valid}>
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
