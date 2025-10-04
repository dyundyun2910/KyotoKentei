import { QuestionId } from './QuestionId';

describe('QuestionId Value Object', () => {
  describe('constructor', () => {
    it('should create a QuestionId with valid id', () => {
      const id = new QuestionId('q001');
      expect(id.value).toBe('q001');
    });

    it('should throw error for empty string', () => {
      expect(() => new QuestionId('')).toThrow('QuestionId cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => new QuestionId('   ')).toThrow('QuestionId cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for same id', () => {
      const id1 = new QuestionId('q001');
      const id2 = new QuestionId('q001');
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different ids', () => {
      const id1 = new QuestionId('q001');
      const id2 = new QuestionId('q002');
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
