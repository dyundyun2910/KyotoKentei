import { Quiz } from './Quiz';
import { Accuracy } from '../valueObjects/Accuracy';
import { CategoryStatistics } from './CategoryStatistics';

export class QuizResult {
  private constructor(
    private readonly _quiz: Quiz,
    private readonly _correctCount: number,
    private readonly _accuracy: Accuracy,
    private readonly _categoryStatistics: readonly CategoryStatistics[],
    private readonly _completedAt: Date
  ) {}

  static fromQuiz(quiz: Quiz, categoryStatistics: CategoryStatistics[]): QuizResult {
    const correctCount = this.calculateCorrectCount(quiz);
    const accuracy = Accuracy.calculate(correctCount, quiz.totalQuestions);

    return new QuizResult(quiz, correctCount, accuracy, categoryStatistics, new Date());
  }

  private static calculateCorrectCount(quiz: Quiz): number {
    let correct = 0;
    for (const question of quiz.questions) {
      const answer = quiz.getAnswer(question.id.value);
      if (answer !== undefined && question.isCorrectAnswer(answer)) {
        correct++;
      }
    }
    return correct;
  }

  get quiz(): Quiz {
    return this._quiz;
  }

  get correctCount(): number {
    return this._correctCount;
  }

  get totalQuestions(): number {
    return this._quiz.totalQuestions;
  }

  get accuracy(): Accuracy {
    return this._accuracy;
  }

  get categoryStatistics(): readonly CategoryStatistics[] {
    return this._categoryStatistics;
  }

  get completedAt(): Date {
    return this._completedAt;
  }

  getWeakCategories(threshold: number = 70): CategoryStatistics[] {
    return this._categoryStatistics
      .filter((stat) => stat.accuracy.value < threshold)
      .sort((a, b) => a.accuracy.value - b.accuracy.value);
  }
}
