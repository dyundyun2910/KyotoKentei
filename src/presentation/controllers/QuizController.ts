import { Quiz } from '../../domain/entities/Quiz';
import { QuizResult } from '../../domain/entities/QuizResult';
import { StartQuizUseCase } from '../../application/usecases/StartQuizUseCase';
import { AnswerQuestionUseCase } from '../../application/usecases/AnswerQuestionUseCase';
import { CalculateResultUseCase } from '../../application/usecases/CalculateResultUseCase';
import { IQuizHistoryRepository } from '../../domain/repositories/IQuizHistoryRepository';
import { StartQuizRequest } from '../../application/dto/StartQuizRequest';
import { AnswerQuestionRequest } from '../../application/dto/AnswerQuestionRequest';
import {
  QuizStateViewModel,
  QuestionViewModel,
  FeedbackViewModel,
  ResultViewModel,
  CategoryResultViewModel,
} from '../viewModels/QuizViewModel';

export class QuizController {
  private currentQuiz: Quiz | null = null;
  private currentResult: QuizResult | null = null;
  private lastAnswerIndex: number | null = null;

  constructor(
    private readonly startQuizUseCase: StartQuizUseCase,
    private readonly answerQuestionUseCase: AnswerQuestionUseCase,
    private readonly calculateResultUseCase: CalculateResultUseCase,
    private readonly quizHistoryRepository: IQuizHistoryRepository
  ) {}

  async startQuiz(level: string, questionCount: number): Promise<QuizStateViewModel> {
    const request = new StartQuizRequest(level, questionCount);
    this.currentQuiz = await this.startQuizUseCase.execute(request);

    return this.getCurrentQuizState();
  }

  answerCurrentQuestion(answerIndex: number): FeedbackViewModel {
    if (!this.currentQuiz) {
      throw new Error('No active quiz');
    }

    this.lastAnswerIndex = answerIndex;

    const request = new AnswerQuestionRequest(answerIndex);

    const response = this.answerQuestionUseCase.execute(this.currentQuiz, request);

    return {
      isCorrect: response.isCorrect,
      correctIndex: this.currentQuiz.currentQuestion.correctAnswerIndex,
      selectedIndex: answerIndex,
      explanation: response.isCorrect ? undefined : this.currentQuiz.currentQuestion.explanation,
    };
  }

  moveToNextQuestion(): QuizStateViewModel | null {
    if (!this.currentQuiz) {
      throw new Error('No active quiz');
    }

    if (this.currentQuiz.isCompleted) {
      return null;
    }

    this.currentQuiz.moveToNextQuestion();
    this.lastAnswerIndex = null;

    if (this.currentQuiz.isCompleted) {
      return null;
    }

    return this.getCurrentQuizState();
  }

  async calculateResult(): Promise<ResultViewModel> {
    if (!this.currentQuiz) {
      throw new Error('No active quiz');
    }

    if (!this.currentQuiz.isCompleted) {
      throw new Error('Quiz is not completed yet');
    }

    this.currentResult = this.calculateResultUseCase.execute(this.currentQuiz);

    // Save to history
    await this.quizHistoryRepository.save(this.currentResult);

    return this.toResultViewModel(this.currentResult);
  }

  getCurrentQuizState(): QuizStateViewModel {
    if (!this.currentQuiz) {
      throw new Error('No active quiz');
    }

    const currentQuestion = this.currentQuiz.currentQuestion;

    return {
      quizId: this.currentQuiz.id.value,
      level: this.currentQuiz.level.value,
      currentQuestion: this.currentQuiz.currentQuestionIndex + 1,
      totalQuestions: this.currentQuiz.totalQuestions,
      question: this.toQuestionViewModel(currentQuestion),
      canMoveNext: this.lastAnswerIndex !== null,
    };
  }

  reset(): void {
    this.currentQuiz = null;
    this.currentResult = null;
    this.lastAnswerIndex = null;
  }

  private toQuestionViewModel(question: any): QuestionViewModel {
    return {
      id: question.id.value,
      category: question.category.value,
      text: question.questionText,
      options: question.options,
    };
  }

  private toResultViewModel(result: QuizResult): ResultViewModel {
    const categoryResults: CategoryResultViewModel[] = result.categoryStatistics.map(
      (stat) => ({
        category: stat.category.value,
        correct: stat.correctCount,
        total: stat.totalCount,
        accuracy: stat.accuracy.value,
      })
    );

    const weakCategories = result.getWeakCategories().map((stat) => stat.category.value);

    return {
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      accuracy: result.accuracy.value,
      categoryResults,
      weakCategories,
    };
  }
}
