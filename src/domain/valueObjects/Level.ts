export class Level {
  private static readonly VALID_LEVELS = ['2級', '3級'] as const;

  private constructor(private readonly _value: '2級' | '3級') {}

  static fromString(value: string): Level {
    if (!this.isValid(value)) {
      throw new Error(`Invalid level: ${value}. Must be either '2級' or '3級'`);
    }
    return new Level(value as '2級' | '3級');
  }

  private static isValid(value: string): value is '2級' | '3級' {
    return this.VALID_LEVELS.includes(value as any);
  }

  get value(): '2級' | '3級' {
    return this._value;
  }

  equals(other: Level): boolean {
    return this._value === other._value;
  }
}
