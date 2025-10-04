export class QuizId {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('QuizId cannot be empty');
    }
  }

  static generate(): QuizId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return new QuizId(`quiz-${timestamp}-${random}`);
  }

  static fromString(value: string): QuizId {
    return new QuizId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: QuizId): boolean {
    return this._value === other._value;
  }
}
