import { CategoryStatistics } from './CategoryStatistics';
import { Category } from '../valueObjects/Category';

describe('CategoryStatistics Entity', () => {
  describe('create', () => {
    it('should create CategoryStatistics with valid data', () => {
      const category = new Category('歴史');

      const stats = CategoryStatistics.create(category, 8, 10);

      expect(stats.category.equals(category)).toBe(true);
      expect(stats.correctCount).toBe(8);
      expect(stats.totalCount).toBe(10);
      expect(stats.accuracy.value).toBe(80);
    });

    it('should handle perfect score', () => {
      const stats = CategoryStatistics.create(new Category('寺院'), 5, 5);

      expect(stats.correctCount).toBe(5);
      expect(stats.totalCount).toBe(5);
      expect(stats.accuracy.value).toBe(100);
    });

    it('should handle zero score', () => {
      const stats = CategoryStatistics.create(new Category('建築'), 0, 5);

      expect(stats.correctCount).toBe(0);
      expect(stats.totalCount).toBe(5);
      expect(stats.accuracy.value).toBe(0);
    });

    it('should throw error for invalid counts', () => {
      expect(() =>
        CategoryStatistics.create(new Category('歴史'), 11, 10)
      ).toThrow();
    });
  });
});
