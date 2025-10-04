import { Quiz } from '../../domain/entities/Quiz';

export class StartQuizResponse {
  constructor(
    public readonly quizId: string,
    public readonly level: string,
    public readonly totalQuestions: number
  ) {}

  static fromQuiz(quiz: Quiz): StartQuizResponse {
    return new StartQuizResponse(
      quiz.id.value,
      quiz.level.value,
      quiz.totalQuestions
    );
  }
}
