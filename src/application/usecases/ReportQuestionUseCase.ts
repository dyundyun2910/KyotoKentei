import { IQuestionReportRepository } from '../../domain/repositories/IQuestionReportRepository';
import { QuestionReport } from '../../domain/entities/QuestionReport';
import { QuestionId } from '../../domain/valueObjects/QuestionId';
import { ReportQuestionRequest } from '../dto/ReportQuestionRequest';

export class ReportQuestionUseCase {
  constructor(
    private readonly questionReportRepository: IQuestionReportRepository
  ) {}

  async execute(request: ReportQuestionRequest): Promise<void> {
    const questionId = new QuestionId(request.questionId);

    // 既存の報告を探す
    const existingReport = await this.questionReportRepository.findByQuestionId(questionId);

    if (existingReport) {
      // 既存の報告がある場合は報告回数を増やす
      existingReport.incrementReport();
      await this.questionReportRepository.save(existingReport);
    } else {
      // 新しい報告を作成
      const newReport = QuestionReport.create(questionId);
      await this.questionReportRepository.save(newReport);
    }
  }
}
