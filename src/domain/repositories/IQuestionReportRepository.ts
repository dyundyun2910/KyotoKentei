import { QuestionReport } from '../entities/QuestionReport';
import { QuestionId } from '../valueObjects/QuestionId';

export interface IQuestionReportRepository {
  findByQuestionId(questionId: QuestionId): Promise<QuestionReport | null>;
  save(report: QuestionReport): Promise<void>;
  findAll(): Promise<QuestionReport[]>;
  clear(): Promise<void>;
}
