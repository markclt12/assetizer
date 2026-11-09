import { useState } from "react";
import type { PublicActivityDto } from "@assetizers/shared";
import { Button } from "../../components/Button";
import { useCheckAnswers } from "./hooks";
import { QuizQuestion } from "./QuizQuestion";
import styles from "./QuizRunner.module.css";

/** Answers live only in component state; retaking simply resets it. */
export function QuizRunner({ activity }: { activity: PublicActivityDto }) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const check = useCheckAnswers(activity.id);
  const result = check.data;
  const resultsById = new Map(result?.results.map((item) => [item.questionId, item]));
  const answeredCount = activity.questions.filter((q) => answers[q.id] != null).length;

  const submit = () => {
    check.mutate({
      answers: activity.questions.map((q) => ({ questionId: q.id, selectedIdx: answers[q.id] ?? null })),
    });
  };

  const retake = () => {
    setAnswers({});
    check.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {result && (
        <div className={styles.score} role="status">
          <span className={styles.scoreValue}>
            {result.score} / {result.total}
          </span>
          <span>
            {result.score === result.total
              ? "Chef's kiss! A perfect plate."
              : result.score >= result.total / 2
                ? "Tasty work. Review the feedback below."
                : "Still simmering. Check the explanations and try again."}
          </span>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {activity.questions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            number={index + 1}
            question={question}
            value={answers[question.id] ?? null}
            onChange={(selected) => setAnswers((prev) => ({ ...prev, [question.id]: selected }))}
            result={resultsById.get(question.id)}
          />
        ))}

        {check.isError && (
          <p className={styles.error} role="alert">
            {check.error instanceof Error ? check.error.message : "Could not check your answers."}
          </p>
        )}

        <div className={styles.actions}>
          {result ? (
            <Button type="button" accent="var(--area-practice-bites)" size="lg" onClick={retake}>
              Retake this bite
            </Button>
          ) : (
            <>
              <span className={styles.progress}>
                {answeredCount} of {activity.questions.length} answered
              </span>
              <Button
                type="submit"
                accent="var(--area-practice-bites)"
                size="lg"
                disabled={check.isPending || answeredCount === 0}
              >
                {check.isPending ? "Checking..." : "Check my answers"}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
