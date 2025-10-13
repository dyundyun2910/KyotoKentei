import { ReportQuestionUseCase } from './ReportQuestionUseCase';
import { ReportQuestionRequest } from '../dto/ReportQuestionRequest';
import { IQuestionReportRepository } from '../../domain/repositories/IQuestionReportRepository';
import { QuestionReport } from '../../domain/entities/QuestionReport';
import { QuestionId } from '../../domain/valueObjects/QuestionId';

// Mock Repository
class MockQuestionReportRepository implements IQuestionReportRepository {
  private reports: Map<string, QuestionReport> = new Map();

  async findByQuestionId(questionId: QuestionId): Promise<QuestionReport | null> {
    return this.reports.get(questionId.value) || null;
  }

  async save(report: QuestionReport): Promise<void> {
    this.reports.set(report.questionId.value, report);
  }

  async findAll(): Promise<QuestionReport[]> {
    return Array.from(this.reports.values());
  }

  async clear(): Promise<void> {
    this.reports.clear();
  }

  // Test helper
  setReports(reports: QuestionReport[]): void {
    this.reports.clear();
    reports.forEach(report => {
      this.reports.set(report.questionId.value, report);
    });
  }
}

describe('ReportQuestionUseCase', () => {
  let useCase: ReportQuestionUseCase;
  let mockRepository: MockQuestionReportRepository;

  beforeEach(() => {
    mockRepository = new MockQuestionReportRepository();
    useCase = new ReportQuestionUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create new report when question has not been reported', async () => {
      // Arrange
      const request = new ReportQuestionRequest('q001');

      // Act
      await useCase.execute(request);

      // Assert
      const reports = await mockRepository.findAll();
      expect(reports).toHaveLength(1);
      expect(reports[0].questionId.value).toBe('q001');
      expect(reports[0].reportCount).toBe(1);
    });

    it('should increment report count when question already reported', async () => {
      // Arrange
      const request = new ReportQuestionRequest('q001');
      const existingReport = QuestionReport.create(new QuestionId('q001'));
      mockRepository.setReports([existingReport]);

      // Act
      await useCase.execute(request);

      // Assert
      const report = await mockRepository.findByQuestionId(new QuestionId('q001'));
      expect(report).not.toBeNull();
      expect(report!.reportCount).toBe(2);
    });

    it('should handle multiple reports for the same question', async () => {
      // Arrange
      const request = new ReportQuestionRequest('q001');

      // Act
      await useCase.execute(request);
      await useCase.execute(request);
      await useCase.execute(request);

      // Assert
      const report = await mockRepository.findByQuestionId(new QuestionId('q001'));
      expect(report).not.toBeNull();
      expect(report!.reportCount).toBe(3);
    });

    it('should create separate reports for different questions', async () => {
      // Arrange
      const request1 = new ReportQuestionRequest('q001');
      const request2 = new ReportQuestionRequest('q002');

      // Act
      await useCase.execute(request1);
      await useCase.execute(request2);

      // Assert
      const reports = await mockRepository.findAll();
      expect(reports).toHaveLength(2);

      const report1 = await mockRepository.findByQuestionId(new QuestionId('q001'));
      const report2 = await mockRepository.findByQuestionId(new QuestionId('q002'));

      expect(report1).not.toBeNull();
      expect(report1!.reportCount).toBe(1);

      expect(report2).not.toBeNull();
      expect(report2!.reportCount).toBe(1);
    });

    it('should throw error when question ID is empty', async () => {
      // Arrange & Act & Assert
      expect(() => new ReportQuestionRequest('')).toThrow('Question ID cannot be empty');
    });

    it('should throw error when question ID is whitespace', async () => {
      // Arrange & Act & Assert
      expect(() => new ReportQuestionRequest('   ')).toThrow('Question ID cannot be empty');
    });
  });
});
