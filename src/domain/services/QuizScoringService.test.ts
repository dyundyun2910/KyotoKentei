import { QuizScoringService } from './QuizScoringService';
import { Quiz } from '../entities/Quiz';
import { Question } from '../entities/Question';
import { QuizId } from '../valueObjects/QuizId';
import { Level } from '../valueObjects/Level';

const createMockQuestion = (
  id: string,
  category: string,
  correctIndex: number = 0
): Question => {
  return Question.create({
    id,
    level: '3級',
    category,
    examYear: '2004/12/12',
    questionText: `テスト問題${id}`,
    options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
    correctAnswerIndex: correctIndex,
    explanation: '解説',
  });
};

describe('QuizScoringService', () => {
  let service: QuizScoringService;

  beforeEach(() => {
    service = new QuizScoringService();
  });

  describe('calculateCategoryStatistics', () => {
    it('should calculate statistics for single category', () => {
      const questions = [
        createMockQuestion('q001', '歴史', 0),
        createMockQuestion('q002', '歴史', 1),
        createMockQuestion('q003', '歴史', 2),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(0); // correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(1); // correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(0); // incorrect

      const stats = service.calculateCategoryStatistics(quiz);

      expect(stats.length).toBe(1);
      expect(stats[0].category.value).toBe('歴史');
      expect(stats[0].correctCount).toBe(2);
      expect(stats[0].totalCount).toBe(3);
      expect(stats[0].accuracy.value).toBe(67);
    });

    it('should calculate statistics for multiple categories', () => {
      const questions = [
        createMockQuestion('q001', '歴史', 0),
        createMockQuestion('q002', '歴史', 1),
        createMockQuestion('q003', '寺院', 0),
        createMockQuestion('q004', '寺院', 1),
        createMockQuestion('q005', '建築', 0),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(0); // 歴史: correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(0); // 歴史: incorrect
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(0); // 寺院: correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(1); // 寺院: correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(1); // 建築: incorrect

      const stats = service.calculateCategoryStatistics(quiz);

      expect(stats.length).toBe(3);

      const historyStats = stats.find((s) => s.category.value === '歴史');
      expect(historyStats?.correctCount).toBe(1);
      expect(historyStats?.totalCount).toBe(2);
      expect(historyStats?.accuracy.value).toBe(50);

      const templeStats = stats.find((s) => s.category.value === '寺院');
      expect(templeStats?.correctCount).toBe(2);
      expect(templeStats?.totalCount).toBe(2);
      expect(templeStats?.accuracy.value).toBe(100);

      const architectureStats = stats.find((s) => s.category.value === '建築');
      expect(architectureStats?.correctCount).toBe(0);
      expect(architectureStats?.totalCount).toBe(1);
      expect(architectureStats?.accuracy.value).toBe(0);
    });

    it('should handle quiz with no answers', () => {
      const questions = [
        createMockQuestion('q001', '歴史', 0),
        createMockQuestion('q002', '寺院', 1),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      const stats = service.calculateCategoryStatistics(quiz);

      expect(stats.length).toBe(2);
      stats.forEach((stat) => {
        expect(stat.correctCount).toBe(0);
      });
    });

    it('should handle all correct answers', () => {
      const questions = [
        createMockQuestion('q001', '歴史', 0),
        createMockQuestion('q002', '歴史', 1),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(0); // correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(1); // correct

      const stats = service.calculateCategoryStatistics(quiz);

      expect(stats.length).toBe(1);
      expect(stats[0].correctCount).toBe(2);
      expect(stats[0].totalCount).toBe(2);
      expect(stats[0].accuracy.value).toBe(100);
    });

    it('should handle all incorrect answers', () => {
      const questions = [
        createMockQuestion('q001', '歴史', 0),
        createMockQuestion('q002', '歴史', 1),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(1); // incorrect
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(0); // incorrect

      const stats = service.calculateCategoryStatistics(quiz);

      expect(stats.length).toBe(1);
      expect(stats[0].correctCount).toBe(0);
      expect(stats[0].totalCount).toBe(2);
      expect(stats[0].accuracy.value).toBe(0);
    });
  });
});
