import { Level } from './Level';

describe('Level Value Object', () => {
  describe('fromString', () => {
    it('should create a Level with "3級"', () => {
      const level = Level.fromString('3級');
      expect(level.value).toBe('3級');
    });

    it('should create a Level with "2級"', () => {
      const level = Level.fromString('2級');
      expect(level.value).toBe('2級');
    });

    it('should create a Level with "1級"', () => {
      const level = Level.fromString('1級');
      expect(level.value).toBe('1級');
    });

    it('should throw error for empty string', () => {
      expect(() => Level.fromString('')).toThrow('Invalid level');
    });

    it('should throw error for invalid format', () => {
      expect(() => Level.fromString('Level 3')).toThrow('Invalid level');
    });

    it('should throw error for invalid level "4級"', () => {
      expect(() => Level.fromString('4級')).toThrow(
        'Invalid level: 4級. Must be either \'1級\', \'2級\' or \'3級\''
      );
    });
  });

  describe('equals', () => {
    it('should return true for same level', () => {
      const level1 = Level.fromString('3級');
      const level2 = Level.fromString('3級');
      expect(level1.equals(level2)).toBe(true);
    });

    it('should return false for different levels', () => {
      const level1 = Level.fromString('3級');
      const level2 = Level.fromString('2級');
      expect(level1.equals(level2)).toBe(false);
    });
  });
});
