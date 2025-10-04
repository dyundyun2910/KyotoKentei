import { Quiz } from '../../domain/entities/Quiz';
import { QuizResult } from '../../domain/entities/QuizResult';
import { QuizScoringService } from '../../domain/services/QuizScoringService';

export class CalculateResultUseCase {
  constructor(private readonly scoringService: QuizScoringService) {}

  execute(quiz: Quiz): QuizResult {
    if (!quiz.isCompleted) {
      throw new Error('Quiz is not completed yet');
    }

    const categoryStatistics = this.scoringService.calculateCategoryStatistics(quiz);

    return QuizResult.fromQuiz(quiz, categoryStatistics);
  }
}
