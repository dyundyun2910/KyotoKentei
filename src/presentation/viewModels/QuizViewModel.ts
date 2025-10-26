export interface QuestionViewModel {
  id: string;
  category: string;
  examYear: string;
  text: string;
  options: string[];
}

export interface QuizStateViewModel {
  quizId: string;
  level: string;
  currentQuestion: number;
  totalQuestions: number;
  question: QuestionViewModel;
  canMoveNext: boolean;
}

export interface FeedbackViewModel {
  isCorrect: boolean;
  correctIndex: number;
  selectedIndex: number;
  explanation?: string;
}

export interface CategoryResultViewModel {
  category: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface ResultViewModel {
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  categoryResults: CategoryResultViewModel[];
  weakCategories: string[];
}

export interface QuizHistoryItemViewModel {
  quizId: string;
  level: string;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  completedAt: string;
  categoryStatistics: CategoryResultViewModel[];
}
