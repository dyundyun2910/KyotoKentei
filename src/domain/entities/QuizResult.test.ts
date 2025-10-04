import { QuizResult } from './QuizResult';
import { Quiz } from './Quiz';
import { Question } from './Question';
import { CategoryStatistics } from './CategoryStatistics';
import { QuizId } from '../valueObjects/QuizId';
import { Level } from '../valueObjects/Level';
import { Category } from '../valueObjects/Category';

const createMockQuestion = (
  id: string,
  level: string = '3級',
  category: string = '歴史',
  correctIndex: number = 0
): Question => {
  return Question.create({
    id,
    level,
    category,
    examYear: '2004/12/12',
    questionText: `テスト問題${id}`,
    options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
    correctAnswerIndex: correctIndex,
    explanation: '解説',
  });
};

describe('QuizResult Entity', () => {
  describe('fromQuiz', () => {
    it('should create QuizResult from completed Quiz', () => {
      const questions = [
        createMockQuestion('q001', '3級', '歴史', 0),
        createMockQuestion('q002', '3級', '歴史', 1),
        createMockQuestion('q003', '3級', '寺院', 2),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      // Answer questions
      quiz.answerCurrentQuestion(0); // correct
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(0); // incorrect
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(2); // correct
      quiz.moveToNextQuestion();

      const categoryStats = [
        CategoryStatistics.create(new Category('歴史'), 1, 2),
        CategoryStatistics.create(new Category('寺院'), 1, 1),
      ];

      const result = QuizResult.fromQuiz(quiz, categoryStats);

      expect(result.correctCount).toBe(2);
      expect(result.totalQuestions).toBe(3);
      expect(result.accuracy.value).toBe(67);
      expect(result.categoryStatistics.length).toBe(2);
    });

    it('should have completion time', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(0);
      quiz.moveToNextQuestion();

      const categoryStats = [CategoryStatistics.create(new Category('歴史'), 1, 1)];
      const beforeComplete = new Date();
      const result = QuizResult.fromQuiz(quiz, categoryStats);
      const afterComplete = new Date();

      expect(result.completedAt.getTime()).toBeGreaterThanOrEqual(
        beforeComplete.getTime()
      );
      expect(result.completedAt.getTime()).toBeLessThanOrEqual(afterComplete.getTime());
    });
  });

  describe('getWeakCategories', () => {
    it('should return categories below threshold', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);
      quiz.answerCurrentQuestion(0);
      quiz.moveToNextQuestion();

      const categoryStats = [
        CategoryStatistics.create(new Category('歴史'), 9, 10), // 90%
        CategoryStatistics.create(new Category('寺院'), 6, 10), // 60%
        CategoryStatistics.create(new Category('建築'), 5, 10), // 50%
      ];

      const result = QuizResult.fromQuiz(quiz, categoryStats);
      const weakCategories = result.getWeakCategories(70);

      expect(weakCategories.length).toBe(2);
      expect(weakCategories[0].category.value).toBe('建築'); // lowest first
      expect(weakCategories[1].category.value).toBe('寺院');
    });

    it('should return empty array when all categories are above threshold', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);
      quiz.answerCurrentQuestion(0);
      quiz.moveToNextQuestion();

      const categoryStats = [
        CategoryStatistics.create(new Category('歴史'), 9, 10), // 90%
        CategoryStatistics.create(new Category('寺院'), 8, 10), // 80%
      ];

      const result = QuizResult.fromQuiz(quiz, categoryStats);
      const weakCategories = result.getWeakCategories(70);

      expect(weakCategories.length).toBe(0);
    });
  });
});
