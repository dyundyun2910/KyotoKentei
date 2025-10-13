import { IQuestionReportRepository } from '../../domain/repositories/IQuestionReportRepository';
import { GetQuestionReportsResponse } from '../dto/GetQuestionReportsResponse';

export class GetQuestionReportsUseCase {
  constructor(
    private readonly questionReportRepository: IQuestionReportRepository
  ) {}

  async execute(): Promise<GetQuestionReportsResponse> {
    const reports = await this.questionReportRepository.findAll();

    // 報告回数の多い順にソート
    const sortedReports = reports
      .sort((a, b) => b.reportCount - a.reportCount);

    return GetQuestionReportsResponse.fromReports(sortedReports);
  }
}
