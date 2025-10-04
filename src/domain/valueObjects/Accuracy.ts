export class Accuracy {
  private constructor(private readonly _value: number) {
    if (_value < 0 || _value > 100) {
      throw new Error('Accuracy must be between 0 and 100');
    }
  }

  static calculate(correct: number, total: number): Accuracy {
    if (total === 0 || total < 0) {
      throw new Error('Total cannot be zero');
    }
    if (correct < 0 || correct > total) {
      throw new Error('Correct count must be between 0 and total');
    }
    const percentage = Math.round((correct / total) * 100);
    return new Accuracy(percentage);
  }

  static fromPercentage(percentage: number): Accuracy {
    return new Accuracy(percentage);
  }

  get value(): number {
    return this._value;
  }

  isAbove(threshold: number): boolean {
    return this._value > threshold;
  }

  isBelow(threshold: number): boolean {
    return this._value < threshold;
  }
}
