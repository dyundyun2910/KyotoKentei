import { QuestionId } from '../valueObjects/QuestionId';
import { Level } from '../valueObjects/Level';
import { Category } from '../valueObjects/Category';

export class Question {
  private constructor(
    private readonly _id: QuestionId,
    private readonly _level: Level,
    private readonly _category: Category,
    private readonly _examYear: string,
    private readonly _questionText: string,
    private readonly _options: readonly [string, string, string, string],
    private readonly _correctAnswerIndex: 0 | 1 | 2 | 3,
    private readonly _explanation: string
  ) {}

  static create(params: {
    id: string;
    level: string;
    category: string;
    examYear: string;
    questionText: string;
    options: [string, string, string, string];
    correctAnswerIndex: number;
    explanation: string;
  }): Question {
    // Validation
    if (!params.questionText || params.questionText.trim().length === 0) {
      throw new Error('Question text cannot be empty');
    }

    if (params.options.length !== 4) {
      throw new Error('Options must have exactly 4 choices');
    }

    if (params.correctAnswerIndex < 0 || params.correctAnswerIndex > 3) {
      throw new Error('Correct answer index must be between 0 and 3');
    }

    return new Question(
      new QuestionId(params.id),
      Level.fromString(params.level),
      new Category(params.category),
      params.examYear,
      params.questionText,
      params.options,
      params.correctAnswerIndex as 0 | 1 | 2 | 3,
      params.explanation
    );
  }

  get id(): QuestionId {
    return this._id;
  }

  get level(): Level {
    return this._level;
  }

  get category(): Category {
    return this._category;
  }

  get examYear(): string {
    return this._examYear;
  }

  get questionText(): string {
    return this._questionText;
  }

  get options(): readonly [string, string, string, string] {
    return this._options;
  }

  get correctAnswerIndex(): 0 | 1 | 2 | 3 {
    return this._correctAnswerIndex;
  }

  get explanation(): string {
    return this._explanation;
  }

  isCorrectAnswer(answerIndex: number): boolean {
    return answerIndex === this._correctAnswerIndex;
  }
}
