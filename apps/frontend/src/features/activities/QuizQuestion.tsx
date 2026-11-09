import { RadioGroup } from "radix-ui";
import type { CheckResultItem, PublicQuestionDto } from "@assetizers/shared";
import styles from "./QuizQuestion.module.css";

const optionLetter = (index: number) => String.fromCharCode(97 + index);

export function QuizQuestion({
  number,
  question,
  value,
  onChange,
  result,
}: {
  number: number;
  question: PublicQuestionDto;
  value: number | null;
  onChange: (index: number) => void;
  result?: CheckResultItem;
}) {
  const promptId = `q-${question.id}`;
  const checked = Boolean(result);

  return (
    <fieldset
      className={`${styles.question} ${result ? (result.correct ? styles.right : styles.wrong) : ""}`}
    >
      <legend id={promptId} className={styles.prompt}>
        <span className={styles.number}>{number})</span>
        <span>{question.prompt}</span>
      </legend>

      <RadioGroup.Root
        className={styles.options}
        aria-labelledby={promptId}
        value={value === null ? "" : String(value)}
        onValueChange={(next) => onChange(Number(next))}
        disabled={checked}
      >
        {question.options.map((option, index) => {
          const isCorrect = result && index === result.correctIdx;
          const isPickedWrong = result && !result.correct && index === result.selectedIdx;
          return (
            <label
              key={index}
              className={[
                styles.option,
                isCorrect ? styles.optionCorrect : "",
                isPickedWrong ? styles.optionWrong : "",
              ].join(" ")}
            >
              <RadioGroup.Item value={String(index)} className={styles.radio}>
                <RadioGroup.Indicator className={styles.indicator} />
              </RadioGroup.Item>
              <span className={styles.letter}>{optionLetter(index)})</span>
              <span>{option}</span>
              {isCorrect && <span className="visually-hidden"> (correct answer)</span>}
              {isPickedWrong && <span className="visually-hidden"> (your answer, incorrect)</span>}
            </label>
          );
        })}
      </RadioGroup.Root>

      {result && (
        <div className={styles.feedback} role="status">
          <strong>
            {result.correct
              ? "Delicious! That's correct."
              : result.selectedIdx === null
                ? `Not answered. The answer is ${optionLetter(result.correctIdx)}).`
                : `Not quite. The answer is ${optionLetter(result.correctIdx)}).`}
          </strong>
          {result.explanation && <p>{result.explanation}</p>}
        </div>
      )}
    </fieldset>
  );
}
