import { IQuestionReportRepository } from '../../domain/repositories/IQuestionReportRepository';
import { QuestionReport } from '../../domain/entities/QuestionReport';
import { QuestionId } from '../../domain/valueObjects/QuestionId';

const STORAGE_KEY = 'kyoto-kentei-question-reports';

interface QuestionReportDTO {
  questionId: string;
  reportCount: number;
  firstReportedAt: string;
  lastReportedAt: string;
}

interface QuestionReportsData {
  reports: QuestionReportDTO[];
}

export class LocalStorageQuestionReportRepository implements IQuestionReportRepository {
  async findByQuestionId(questionId: QuestionId): Promise<QuestionReport | null> {
    try {
      const data = this.loadFromStorage();
      const reportDTO = data.reports.find(r => r.questionId === questionId.value);

      if (!reportDTO) {
        return null;
      }

      return this.toEntity(reportDTO);
    } catch (error) {
      console.warn('Failed to find question report', error);
      return null;
    }
  }

  async save(report: QuestionReport): Promise<void> {
    try {
      const data = this.loadFromStorage();
      const existingIndex = data.reports.findIndex(
        r => r.questionId === report.questionId.value
      );

      const reportDTO = this.toDTO(report);

      if (existingIndex >= 0) {
        // 既存の報告を更新
        data.reports[existingIndex] = reportDTO;
      } else {
        // 新しい報告を追加
        data.reports.push(reportDTO);
      }

      this.saveToStorage(data);
    } catch (error) {
      console.warn('Failed to save question report', error);
    }
  }

  async findAll(): Promise<QuestionReport[]> {
    try {
      const data = this.loadFromStorage();
      return data.reports.map(dto => this.toEntity(dto));
    } catch (error) {
      console.warn('Failed to load question reports', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear question reports', error);
    }
  }

  private loadFromStorage(): QuestionReportsData {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return { reports: [] };
    }

    try {
      return JSON.parse(serialized);
    } catch {
      return { reports: [] };
    }
  }

  private saveToStorage(data: QuestionReportsData): void {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  }

  private toDTO(report: QuestionReport): QuestionReportDTO {
    return {
      questionId: report.questionId.value,
      reportCount: report.reportCount,
      firstReportedAt: report.firstReportedAt.toISOString(),
      lastReportedAt: report.lastReportedAt.toISOString()
    };
  }

  private toEntity(dto: QuestionReportDTO): QuestionReport {
    return QuestionReport.reconstruct(
      new QuestionId(dto.questionId),
      dto.reportCount,
      new Date(dto.firstReportedAt),
      new Date(dto.lastReportedAt)
    );
  }
}
