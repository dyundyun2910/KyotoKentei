import { QuizId } from './QuizId';

describe('QuizId Value Object', () => {
  describe('generate', () => {
    it('should generate a unique id', () => {
      const id1 = QuizId.generate();
      const id2 = QuizId.generate();
      expect(id1.value).not.toBe(id2.value);
    });

    it('should generate non-empty id', () => {
      const id = QuizId.generate();
      expect(id.value.length).toBeGreaterThan(0);
    });
  });

  describe('fromString', () => {
    it('should create a QuizId from string', () => {
      const id = QuizId.fromString('quiz-123');
      expect(id.value).toBe('quiz-123');
    });

    it('should throw error for empty string', () => {
      expect(() => QuizId.fromString('')).toThrow('QuizId cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for same id', () => {
      const id1 = QuizId.fromString('quiz-123');
      const id2 = QuizId.fromString('quiz-123');
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different ids', () => {
      const id1 = QuizId.fromString('quiz-123');
      const id2 = QuizId.fromString('quiz-456');
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
