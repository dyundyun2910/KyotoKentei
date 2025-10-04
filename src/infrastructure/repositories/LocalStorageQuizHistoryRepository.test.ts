import { LocalStorageQuizHistoryRepository } from './LocalStorageQuizHistoryRepository';
import { QuizResult } from '../../domain/entities/QuizResult';
import { Quiz } from '../../domain/entities/Quiz';
import { Question } from '../../domain/entities/Question';
import { QuizId } from '../../domain/valueObjects/QuizId';
import { Level } from '../../domain/valueObjects/Level';
import { CategoryStatistics } from '../../domain/entities/CategoryStatistics';
import { Category } from '../../domain/valueObjects/Category';

const createMockQuizResult = (): QuizResult => {
  const question = Question.create({
    id: 'q001',
    level: '3級',
    category: '歴史',
    examYear: '2004/12/12',
    questionText: 'テスト問題',
    options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
    correctAnswerIndex: 0,
    explanation: '解説',
  });

  const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), [question]);
  quiz.answerCurrentQuestion(0);
  quiz.moveToNextQuestion();

  const categoryStats = [CategoryStatistics.create(new Category('歴史'), 1, 1)];

  return QuizResult.fromQuiz(quiz, categoryStats);
};

describe('LocalStorageQuizHistoryRepository', () => {
  let repository: LocalStorageQuizHistoryRepository;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    repository = new LocalStorageQuizHistoryRepository();
    mockLocalStorage = {};

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });
  });

  describe('save', () => {
    it('should save quiz result to localStorage', async () => {
      // Arrange
      const result = createMockQuizResult();

      // Act
      await repository.save(result);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = mockLocalStorage['kyoto-quiz-history'];
      expect(savedData).toBeDefined();
    });

    it('should append to existing results', async () => {
      // Arrange
      const result1 = createMockQuizResult();
      const result2 = createMockQuizResult();

      // Act
      await repository.save(result1);
      await repository.save(result2);

      // Assert
      const results = await repository.findAll();
      expect(results.length).toBe(2);
    });

    it('should not throw error when localStorage fails', async () => {
      // Arrange
      const result = createMockQuizResult();
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      // Act & Assert
      await expect(repository.save(result)).resolves.not.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no history exists', async () => {
      // Act
      const results = await repository.findAll();

      // Assert
      expect(results).toEqual([]);
    });

    it('should return all saved results', async () => {
      // Arrange
      const result1 = createMockQuizResult();
      const result2 = createMockQuizResult();
      await repository.save(result1);
      await repository.save(result2);

      // Act
      const results = await repository.findAll();

      // Assert
      expect(results.length).toBe(2);
    });

    it('should return empty array when localStorage data is corrupted', async () => {
      // Arrange
      mockLocalStorage['kyoto-quiz-history'] = 'invalid json';

      // Act
      const results = await repository.findAll();

      // Assert
      expect(results).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should remove all history from localStorage', async () => {
      // Arrange
      const result = createMockQuizResult();
      await repository.save(result);

      // Act
      await repository.clear();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('kyoto-quiz-history');
    });
  });
});
