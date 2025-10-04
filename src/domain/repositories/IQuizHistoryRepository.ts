import { QuizResult } from '../entities/QuizResult';

export interface IQuizHistoryRepository {
  save(result: QuizResult): Promise<void>;
  findAll(): Promise<QuizResult[]>;
  clear(): Promise<void>;
}
