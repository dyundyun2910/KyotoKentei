export class QuestionId {
  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('QuestionId cannot be empty');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: QuestionId): boolean {
    return this._value === other._value;
  }
}
