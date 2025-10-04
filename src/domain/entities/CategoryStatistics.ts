import { Category } from '../valueObjects/Category';
import { Accuracy } from '../valueObjects/Accuracy';

export class CategoryStatistics {
  private constructor(
    private readonly _category: Category,
    private readonly _correctCount: number,
    private readonly _totalCount: number,
    private readonly _accuracy: Accuracy
  ) {}

  static create(
    category: Category,
    correctCount: number,
    totalCount: number
  ): CategoryStatistics {
    const accuracy = Accuracy.calculate(correctCount, totalCount);
    return new CategoryStatistics(category, correctCount, totalCount, accuracy);
  }

  get category(): Category {
    return this._category;
  }

  get correctCount(): number {
    return this._correctCount;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  get accuracy(): Accuracy {
    return this._accuracy;
  }
}
