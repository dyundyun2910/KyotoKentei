import { IQuestionRepository } from '../domain/repositories/IQuestionRepository';
import { IQuizHistoryRepository } from '../domain/repositories/IQuizHistoryRepository';
import { QuizScoringService } from '../domain/services/QuizScoringService';
import { StartQuizUseCase } from '../application/usecases/StartQuizUseCase';
import { AnswerQuestionUseCase } from '../application/usecases/AnswerQuestionUseCase';
import { CalculateResultUseCase } from '../application/usecases/CalculateResultUseCase';
import { JsonQuestionRepository } from '../infrastructure/repositories/JsonQuestionRepository';
import { LocalStorageQuizHistoryRepository } from '../infrastructure/repositories/LocalStorageQuizHistoryRepository';
import { QuizController } from '../presentation/controllers/QuizController';

export class Container {
  private static instance: Container;

  // Repositories
  private _questionRepository: IQuestionRepository;
  private _quizHistoryRepository: IQuizHistoryRepository;

  // Services
  private _scoringService: QuizScoringService;

  // Use Cases
  private _startQuizUseCase: StartQuizUseCase;
  private _answerQuestionUseCase: AnswerQuestionUseCase;
  private _calculateResultUseCase: CalculateResultUseCase;

  // Controllers
  private _quizController: QuizController;

  private constructor() {
    // Initialize Repositories
    this._questionRepository = new JsonQuestionRepository();
    this._quizHistoryRepository = new LocalStorageQuizHistoryRepository();

    // Initialize Services
    this._scoringService = new QuizScoringService();

    // Initialize Use Cases
    this._startQuizUseCase = new StartQuizUseCase(this._questionRepository);
    this._answerQuestionUseCase = new AnswerQuestionUseCase();
    this._calculateResultUseCase = new CalculateResultUseCase(this._scoringService);

    // Initialize Controllers
    this._quizController = new QuizController(
      this._startQuizUseCase,
      this._answerQuestionUseCase,
      this._calculateResultUseCase,
      this._quizHistoryRepository
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get questionRepository(): IQuestionRepository {
    return this._questionRepository;
  }

  get quizHistoryRepository(): IQuizHistoryRepository {
    return this._quizHistoryRepository;
  }

  get startQuizUseCase(): StartQuizUseCase {
    return this._startQuizUseCase;
  }

  get answerQuestionUseCase(): AnswerQuestionUseCase {
    return this._answerQuestionUseCase;
  }

  get calculateResultUseCase(): CalculateResultUseCase {
    return this._calculateResultUseCase;
  }

  get quizController(): QuizController {
    return this._quizController;
  }
}
