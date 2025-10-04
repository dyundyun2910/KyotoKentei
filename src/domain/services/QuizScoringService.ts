import { Quiz } from '../entities/Quiz';
import { CategoryStatistics } from '../entities/CategoryStatistics';
import { Category } from '../valueObjects/Category';

export class QuizScoringService {
  calculateCategoryStatistics(quiz: Quiz): CategoryStatistics[] {
    const categoryMap = new Map<string, { correct: number; total: number }>();

    for (const question of quiz.questions) {
      const categoryName = question.category.value;

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { correct: 0, total: 0 });
      }

      const stats = categoryMap.get(categoryName)!;
      stats.total++;

      const answer = quiz.getAnswer(question.id.value);
      if (answer !== undefined && question.isCorrectAnswer(answer)) {
        stats.correct++;
      }
    }

    const result: CategoryStatistics[] = [];
    for (const [categoryName, stats] of categoryMap.entries()) {
      result.push(
        CategoryStatistics.create(
          new Category(categoryName),
          stats.correct,
          stats.total
        )
      );
    }

    return result;
  }
}
