export class AnswerQuestionResponse {
  private constructor(
    public readonly isCorrect: boolean,
    public readonly correctAnswerIndex: number,
    public readonly explanation: string | null
  ) {}

  static create(
    isCorrect: boolean,
    correctAnswerIndex: number,
    explanation: string | null
  ): AnswerQuestionResponse {
    return new AnswerQuestionResponse(isCorrect, correctAnswerIndex, explanation);
  }
}
