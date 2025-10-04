import { JsonQuestionRepository } from './JsonQuestionRepository';
import { Level } from '../../domain/valueObjects/Level';
import { Question } from '../../domain/entities/Question';

const mockQuestionsData = {
  questions: [
    {
      id: 'q001',
      level: '3級',
      category: '歴史',
      'exam-year': '2004/12/12',
      question: 'テスト問題1',
      options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
      correctAnswer: 0,
      explanation: '解説1',
    },
    {
      id: 'q002',
      level: '3級',
      category: '寺院',
      'exam-year': '2004/12/12',
      question: 'テスト問題2',
      options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
      correctAnswer: 1,
      explanation: '解説2',
    },
    {
      id: 'q003',
      level: '2級',
      category: '歴史',
      'exam-year': '2005/01/15',
      question: 'テスト問題3',
      options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
      correctAnswer: 2,
      explanation: '解説3',
    },
  ],
};

describe('JsonQuestionRepository', () => {
  let repository: JsonQuestionRepository;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    repository = new JsonQuestionRepository();
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('findAll', () => {
    it('should load all questions from JSON file', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuestionsData,
      } as Response);

      // Act
      const questions = await repository.findAll();

      // Assert
      expect(questions.length).toBe(3);
      expect(questions[0]).toBeInstanceOf(Question);
      expect(questions[0].id.value).toBe('q001');
      expect(global.fetch).toHaveBeenCalledWith('/data/questions.json');
    });

    it('should cache questions after first load', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuestionsData,
      } as Response);

      // Act
      await repository.findAll();
      await repository.findAll();

      // Assert
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw error when fetch fails', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      // Act & Assert
      await expect(repository.findAll()).rejects.toThrow('Failed to load questions');
    });
  });

  describe('findByLevel', () => {
    it('should filter questions by level', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuestionsData,
      } as Response);
      const level = Level.fromString('3級');

      // Act
      const questions = await repository.findByLevel(level);

      // Assert
      expect(questions.length).toBe(2);
      questions.forEach((q) => {
        expect(q.level.equals(level)).toBe(true);
      });
    });

    it('should return empty array when no questions match level', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => { return { questions: [] }; },
      } as Response);
      const level = Level.fromString('3級');

      // Act
      const questions = await repository.findByLevel(level);

      // Assert
      expect(questions.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should find question by id', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuestionsData,
      } as Response);

      // Act
      const question = await repository.findById('q002');

      // Assert
      expect(question).not.toBeNull();
      expect(question?.id.value).toBe('q002');
      expect(question?.category.value).toBe('寺院');
    });

    it('should return null when question not found', async () => {
      // Arrange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuestionsData,
      } as Response);

      // Act
      const question = await repository.findById('q999');

      // Assert
      expect(question).toBeNull();
    });
  });
});
