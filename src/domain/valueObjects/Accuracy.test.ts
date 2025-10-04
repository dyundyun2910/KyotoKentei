import { Accuracy } from './Accuracy';

describe('Accuracy Value Object', () => {
  describe('calculate', () => {
    it('should calculate correct percentage', () => {
      const accuracy = Accuracy.calculate(7, 10);
      expect(accuracy.value).toBe(70);
    });

    it('should round to nearest integer', () => {
      const accuracy = Accuracy.calculate(2, 3);
      expect(accuracy.value).toBe(67); // 66.666... → 67
    });

    it('should return 100 for all correct', () => {
      const accuracy = Accuracy.calculate(10, 10);
      expect(accuracy.value).toBe(100);
    });

    it('should return 0 for all incorrect', () => {
      const accuracy = Accuracy.calculate(0, 10);
      expect(accuracy.value).toBe(0);
    });

    it('should throw error for zero total', () => {
      expect(() => Accuracy.calculate(0, 0)).toThrow('Total cannot be zero');
    });

    it('should throw error for negative correct count', () => {
      expect(() => Accuracy.calculate(-1, 10)).toThrow(
        'Correct count must be between 0 and total'
      );
    });

    it('should throw error when correct > total', () => {
      expect(() => Accuracy.calculate(11, 10)).toThrow(
        'Correct count must be between 0 and total'
      );
    });

    it('should throw error for negative total', () => {
      expect(() => Accuracy.calculate(0, -10)).toThrow('Total cannot be zero');
    });
  });

  describe('fromPercentage', () => {
    it('should create Accuracy from percentage', () => {
      const accuracy = Accuracy.fromPercentage(80);
      expect(accuracy.value).toBe(80);
    });

    it('should throw error for value < 0', () => {
      expect(() => Accuracy.fromPercentage(-1)).toThrow(
        'Accuracy must be between 0 and 100'
      );
    });

    it('should throw error for value > 100', () => {
      expect(() => Accuracy.fromPercentage(101)).toThrow(
        'Accuracy must be between 0 and 100'
      );
    });
  });

  describe('isAbove', () => {
    it('should return true when above threshold', () => {
      const accuracy = Accuracy.fromPercentage(80);
      expect(accuracy.isAbove(70)).toBe(true);
    });

    it('should return false when below threshold', () => {
      const accuracy = Accuracy.fromPercentage(60);
      expect(accuracy.isAbove(70)).toBe(false);
    });

    it('should return false when equal to threshold', () => {
      const accuracy = Accuracy.fromPercentage(70);
      expect(accuracy.isAbove(70)).toBe(false);
    });
  });

  describe('isBelow', () => {
    it('should return true when below threshold', () => {
      const accuracy = Accuracy.fromPercentage(60);
      expect(accuracy.isBelow(70)).toBe(true);
    });

    it('should return false when above threshold', () => {
      const accuracy = Accuracy.fromPercentage(80);
      expect(accuracy.isBelow(70)).toBe(false);
    });

    it('should return false when equal to threshold', () => {
      const accuracy = Accuracy.fromPercentage(70);
      expect(accuracy.isBelow(70)).toBe(false);
    });
  });
});
