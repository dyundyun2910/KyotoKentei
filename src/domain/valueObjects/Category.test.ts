import { Category } from './Category';

describe('Category Value Object', () => {
  describe('constructor', () => {
    it('should create a Category with valid name', () => {
      const category = new Category('歴史');
      expect(category.value).toBe('歴史');
    });

    it('should throw error for empty string', () => {
      expect(() => new Category('')).toThrow('Category cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => new Category('   ')).toThrow('Category cannot be empty');
    });

    it('should accept various category names', () => {
      const categories = ['歴史', '寺院', '神社', '建築', '祭と行事'];
      categories.forEach((name) => {
        const category = new Category(name);
        expect(category.value).toBe(name);
      });
    });
  });

  describe('equals', () => {
    it('should return true for same category', () => {
      const category1 = new Category('歴史');
      const category2 = new Category('歴史');
      expect(category1.equals(category2)).toBe(true);
    });

    it('should return false for different categories', () => {
      const category1 = new Category('歴史');
      const category2 = new Category('寺院');
      expect(category1.equals(category2)).toBe(false);
    });
  });
});
