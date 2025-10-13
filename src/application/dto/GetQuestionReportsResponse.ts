import { QuestionReport } from '../../domain/entities/QuestionReport';

export interface QuestionReportDTO {
  questionId: string;
  reportCount: number;
  firstReportedAt: string;
  lastReportedAt: string;
}

export class GetQuestionReportsResponse {
  constructor(public readonly reports: QuestionReportDTO[]) {}

  static fromReports(reports: QuestionReport[]): GetQuestionReportsResponse {
    const dtos = reports.map(report => ({
      questionId: report.questionId.value,
      reportCount: report.reportCount,
      firstReportedAt: report.firstReportedAt.toISOString(),
      lastReportedAt: report.lastReportedAt.toISOString()
    }));

    return new GetQuestionReportsResponse(dtos);
  }
}
