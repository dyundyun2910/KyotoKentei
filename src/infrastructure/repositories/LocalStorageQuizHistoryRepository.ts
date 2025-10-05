import { IQuizHistoryRepository } from '../../domain/repositories/IQuizHistoryRepository';
import { QuizResult } from '../../domain/entities/QuizResult';

const STORAGE_KEY = 'kyoto-quiz-history';

interface QuizResultDTO {
  quizId: string;
  level: string;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  completedAt: string;
  categoryStatistics: {
    category: string;
    correctCount: number;
    totalCount: number;
    accuracy: number;
  }[];
}

export class LocalStorageQuizHistoryRepository implements IQuizHistoryRepository {
  async save(result: QuizResult): Promise<void> {
    try {
      const dto = this.toDTO(result);

      const serialized = localStorage.getItem(STORAGE_KEY);
      const data: QuizResultDTO[] = serialized ? JSON.parse(serialized) : [];
      data.push(dto);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save quiz history', error);
    }
  }

  async findAll(): Promise<QuizResult[]> {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return [];

      const data: QuizResultDTO[] = JSON.parse(serialized);
      // Note: QuizResultの完全な復元は複雑なので、DTOをそのまま返す
      // ViewModelとして使用する側で必要なデータを取得する
      return data as any;
    } catch (error) {
      console.warn('Failed to load quiz history', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  private toDTO(result: QuizResult): QuizResultDTO {
    return {
      quizId: result.quiz.id.value,
      level: result.quiz.level.value,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      accuracy: result.accuracy.value,
      completedAt: result.completedAt.toISOString(),
      categoryStatistics: result.categoryStatistics.map((stat) => ({
        category: stat.category.value,
        correctCount: stat.correctCount,
        totalCount: stat.totalCount,
        accuracy: stat.accuracy.value,
      })),
    };
  }
}
