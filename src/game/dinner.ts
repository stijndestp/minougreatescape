/**
 * Logica van het familiediner (Oosterhout): zes vragen (één per familielid), strikt op volgorde.
 * Pure functies. Welke vragen er zijn staat in src/content/oosterhout.ts.
 */
export interface DinnerQuestion {
  answers: readonly string[];
  correctIndex: number;
}

export interface DinnerState {
  /** Index van de huidige vraag; gelijk aan het aantal goed beantwoorde vragen. */
  current: number;
  /** Aantal foute pogingen bij de huidige vraag. */
  wrongAttempts: number;
}

export type AnswerOutcome = "correct" | "wrong" | "invalid";

export const createDinnerState = (): DinnerState => ({ current: 0, wrongAttempts: 0 });

export const isDinnerComplete = (questions: readonly DinnerQuestion[], s: DinnerState) =>
  questions.length > 0 && s.current >= questions.length;

/** Aantal gangen dat inmiddels geserveerd is (= goed beantwoorde vragen). */
export const servedCourses = (s: DinnerState) => s.current;

/**
 * Beantwoord de huidige vraag. Fout: zelfde vraag blijft. Goed: volgende vraag.
 * Ongeldige keuzes (buiten bereik, of quiz al klaar) veranderen niets.
 */
export function answerQuestion(
  questions: readonly DinnerQuestion[],
  state: DinnerState,
  answerIndex: number,
): { state: DinnerState; outcome: AnswerOutcome } {
  const q = questions[state.current];
  if (!q || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= q.answers.length) {
    return { state, outcome: "invalid" };
  }
  if (answerIndex === q.correctIndex) {
    return { state: { current: state.current + 1, wrongAttempts: 0 }, outcome: "correct" };
  }
  return { state: { ...state, wrongAttempts: state.wrongAttempts + 1 }, outcome: "wrong" };
}
