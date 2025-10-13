import { QuestionReport } from './QuestionReport';
import { QuestionId } from '../valueObjects/QuestionId';

describe('QuestionReport Entity', () => {
  describe('create', () => {
    it('should create a new report with count 1', () => {
      // Arrange
      const questionId = new QuestionId('q001');

      // Act
      const report = QuestionReport.create(questionId);

      // Assert
      expect(report.questionId.value).toBe('q001');
      expect(report.reportCount).toBe(1);
      expect(report.firstReportedAt).toBeInstanceOf(Date);
      expect(report.lastReportedAt).toBeInstanceOf(Date);
    });

    it('should set firstReportedAt and lastReportedAt to the same time', () => {
      // Arrange
      const questionId = new QuestionId('q001');

      // Act
      const report = QuestionReport.create(questionId);

      // Assert
      expect(report.firstReportedAt.getTime()).toBe(report.lastReportedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct a report from stored data', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const reportCount = 5;
      const firstReportedAt = new Date('2024-01-01T00:00:00Z');
      const lastReportedAt = new Date('2024-01-05T12:00:00Z');

      // Act
      const report = QuestionReport.reconstruct(
        questionId,
        reportCount,
        firstReportedAt,
        lastReportedAt
      );

      // Assert
      expect(report.questionId.value).toBe('q001');
      expect(report.reportCount).toBe(5);
      expect(report.firstReportedAt).toBe(firstReportedAt);
      expect(report.lastReportedAt).toBe(lastReportedAt);
    });

    it('should throw error when report count is less than 1', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const reportCount = 0;
      const firstReportedAt = new Date();
      const lastReportedAt = new Date();

      // Act & Assert
      expect(() =>
        QuestionReport.reconstruct(
          questionId,
          reportCount,
          firstReportedAt,
          lastReportedAt
        )
      ).toThrow('Report count must be at least 1');
    });

    it('should throw error when report count is negative', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const reportCount = -1;
      const firstReportedAt = new Date();
      const lastReportedAt = new Date();

      // Act & Assert
      expect(() =>
        QuestionReport.reconstruct(
          questionId,
          reportCount,
          firstReportedAt,
          lastReportedAt
        )
      ).toThrow('Report count must be at least 1');
    });
  });

  describe('incrementReport', () => {
    it('should increment report count', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);
      const initialCount = report.reportCount;

      // Act
      report.incrementReport();

      // Assert
      expect(report.reportCount).toBe(initialCount + 1);
    });

    it('should update lastReportedAt when incremented', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);
      const initialLastReportedAt = report.lastReportedAt;

      // Wait a bit to ensure time difference
      const delay = () => new Promise(resolve => setTimeout(resolve, 10));

      // Act
      return delay().then(() => {
        report.incrementReport();

        // Assert
        expect(report.lastReportedAt.getTime()).toBeGreaterThan(
          initialLastReportedAt.getTime()
        );
      });
    });

    it('should not change firstReportedAt when incremented', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);
      const initialFirstReportedAt = report.firstReportedAt;

      // Act
      report.incrementReport();

      // Assert
      expect(report.firstReportedAt).toBe(initialFirstReportedAt);
    });

    it('should allow multiple increments', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);

      // Act
      report.incrementReport();
      report.incrementReport();
      report.incrementReport();

      // Assert
      expect(report.reportCount).toBe(4); // 1 (initial) + 3 increments
    });
  });

  describe('getters', () => {
    it('should return questionId', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);

      // Act & Assert
      expect(report.questionId).toBe(questionId);
    });

    it('should return reportCount', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);

      // Act & Assert
      expect(report.reportCount).toBe(1);
    });

    it('should return firstReportedAt', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);

      // Act & Assert
      expect(report.firstReportedAt).toBeInstanceOf(Date);
    });

    it('should return lastReportedAt', () => {
      // Arrange
      const questionId = new QuestionId('q001');
      const report = QuestionReport.create(questionId);

      // Act & Assert
      expect(report.lastReportedAt).toBeInstanceOf(Date);
    });
  });
});
