import { QuestionId } from '../valueObjects/QuestionId';

export class QuestionReport {
  private constructor(
    private readonly _questionId: QuestionId,
    private _reportCount: number,
    private readonly _firstReportedAt: Date,
    private _lastReportedAt: Date
  ) {}

  static create(questionId: QuestionId): QuestionReport {
    const now = new Date();
    return new QuestionReport(questionId, 1, now, now);
  }

  static reconstruct(
    questionId: QuestionId,
    reportCount: number,
    firstReportedAt: Date,
    lastReportedAt: Date
  ): QuestionReport {
    if (reportCount < 1) {
      throw new Error('Report count must be at least 1');
    }
    return new QuestionReport(
      questionId,
      reportCount,
      firstReportedAt,
      lastReportedAt
    );
  }

  get questionId(): QuestionId {
    return this._questionId;
  }

  get reportCount(): number {
    return this._reportCount;
  }

  get firstReportedAt(): Date {
    return this._firstReportedAt;
  }

  get lastReportedAt(): Date {
    return this._lastReportedAt;
  }

  incrementReport(): void {
    this._reportCount++;
    this._lastReportedAt = new Date();
  }
}
