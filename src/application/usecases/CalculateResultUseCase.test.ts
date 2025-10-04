import { CalculateResultUseCase } from './CalculateResultUseCase';
import { Quiz } from '../../domain/entities/Quiz';
import { Question } from '../../domain/entities/Question';
import { QuizId } from '../../domain/valueObjects/QuizId';
import { Level } from '../../domain/valueObjects/Level';
import { QuizScoringService } from '../../domain/services/QuizScoringService';

const createCompletedQuiz = (): Quiz => {
  const questions = [
    Question.create({
      id: 'q001',
      level: '3級',
      category: '歴史',
      examYear: '2004/12/12',
      questionText: 'テスト問題1',
      options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
      correctAnswerIndex: 0,
      explanation: '解説1',
    }),
    Question.create({
      id: 'q002',
      level: '3級',
      category: '歴史',
      examYear: '2004/12/12',
      questionText: 'テスト問題2',
      options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
      correctAnswerIndex: 1,
      explanation: '解説2',
    }),
    Question.create({
      id: 'q003',
      level: '3級',
      category: '寺院',
      examYear: '2004/12/12',
      questionText: 'テスト問題3',
      options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
      correctAnswerIndex: 2,
      explanation: '解説3',
    }),
  ];

  const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

  // Answer all questions
  quiz.answerCurrentQuestion(0); // correct
  quiz.moveToNextQuestion();
  quiz.answerCurrentQuestion(0); // incorrect
  quiz.moveToNextQuestion();
  quiz.answerCurrentQuestion(2); // correct
  quiz.moveToNextQuestion();

  return quiz;
};

describe('CalculateResultUseCase', () => {
  let useCase: CalculateResultUseCase;
  let scoringService: QuizScoringService;

  beforeEach(() => {
    scoringService = new QuizScoringService();
    useCase = new CalculateResultUseCase(scoringService);
  });

  it('should calculate result for completed quiz', () => {
    // Arrange
    const quiz = createCompletedQuiz();

    // Act
    const result = useCase.execute(quiz);

    // Assert
    expect(result.correctCount).toBe(2);
    expect(result.totalQuestions).toBe(3);
    expect(result.accuracy.value).toBe(67);
  });

  it('should throw error for incomplete quiz', () => {
    // Arrange
    const questions = [
      Question.create({
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
        correctAnswerIndex: 0,
        explanation: '解説',
      }),
    ];
    const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

    // Act & Assert
    expect(() => useCase.execute(quiz)).toThrow('Quiz is not completed yet');
  });

  it('should include category statistics', () => {
    // Arrange
    const quiz = createCompletedQuiz();

    // Act
    const result = useCase.execute(quiz);

    // Assert
    expect(result.categoryStatistics.length).toBe(2);

    const historyStats = result.categoryStatistics.find(
      (s) => s.category.value === '歴史'
    );
    expect(historyStats).toBeDefined();
    expect(historyStats?.correctCount).toBe(1);
    expect(historyStats?.totalCount).toBe(2);

    const templeStats = result.categoryStatistics.find(
      (s) => s.category.value === '寺院'
    );
    expect(templeStats).toBeDefined();
    expect(templeStats?.correctCount).toBe(1);
    expect(templeStats?.totalCount).toBe(1);
  });

  it('should have completion timestamp', () => {
    // Arrange
    const quiz = createCompletedQuiz();
    const beforeCalculate = new Date();

    // Act
    const result = useCase.execute(quiz);
    const afterCalculate = new Date();

    // Assert
    expect(result.completedAt.getTime()).toBeGreaterThanOrEqual(
      beforeCalculate.getTime()
    );
    expect(result.completedAt.getTime()).toBeLessThanOrEqual(afterCalculate.getTime());
  });
});
