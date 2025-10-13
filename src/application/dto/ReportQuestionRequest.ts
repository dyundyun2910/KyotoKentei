export class ReportQuestionRequest {
  constructor(public readonly questionId: string) {
    if (!questionId || questionId.trim().length === 0) {
      throw new Error('Question ID cannot be empty');
    }
  }
}
