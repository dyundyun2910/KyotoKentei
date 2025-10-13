import { IQuestionRepository } from '../domain/repositories/IQuestionRepository';
import { IQuizHistoryRepository } from '../domain/repositories/IQuizHistoryRepository';
import { IQuestionReportRepository } from '../domain/repositories/IQuestionReportRepository';
import { QuizScoringService } from '../domain/services/QuizScoringService';
import { StartQuizUseCase } from '../application/usecases/StartQuizUseCase';
import { AnswerQuestionUseCase } from '../application/usecases/AnswerQuestionUseCase';
import { CalculateResultUseCase } from '../application/usecases/CalculateResultUseCase';
import { ReportQuestionUseCase } from '../application/usecases/ReportQuestionUseCase';
import { GetQuestionReportsUseCase } from '../application/usecases/GetQuestionReportsUseCase';
import { JsonQuestionRepository } from '../infrastructure/repositories/JsonQuestionRepository';
import { LocalStorageQuizHistoryRepository } from '../infrastructure/repositories/LocalStorageQuizHistoryRepository';
import { LocalStorageQuestionReportRepository } from '../infrastructure/repositories/LocalStorageQuestionReportRepository';
import { QuizController } from '../presentation/controllers/QuizController';

export class Container {
  private static instance: Container;

  // Repositories
  private _questionRepository: IQuestionRepository;
  private _quizHistoryRepository: IQuizHistoryRepository;
  private _questionReportRepository: IQuestionReportRepository;

  // Services
  private _scoringService: QuizScoringService;

  // Use Cases
  private _startQuizUseCase: StartQuizUseCase;
  private _answerQuestionUseCase: AnswerQuestionUseCase;
  private _calculateResultUseCase: CalculateResultUseCase;
  private _reportQuestionUseCase: ReportQuestionUseCase;
  private _getQuestionReportsUseCase: GetQuestionReportsUseCase;

  // Controllers
  private _quizController: QuizController;

  private constructor() {
    // Initialize Repositories
    this._questionRepository = new JsonQuestionRepository(import.meta.env.BASE_URL);
    this._quizHistoryRepository = new LocalStorageQuizHistoryRepository();
    this._questionReportRepository = new LocalStorageQuestionReportRepository();

    // Initialize Services
    this._scoringService = new QuizScoringService();

    // Initialize Use Cases
    this._startQuizUseCase = new StartQuizUseCase(this._questionRepository);
    this._answerQuestionUseCase = new AnswerQuestionUseCase();
    this._calculateResultUseCase = new CalculateResultUseCase(this._scoringService);
    this._reportQuestionUseCase = new ReportQuestionUseCase(this._questionReportRepository);
    this._getQuestionReportsUseCase = new GetQuestionReportsUseCase(this._questionReportRepository);

    // Initialize Controllers
    this._quizController = new QuizController(
      this._startQuizUseCase,
      this._answerQuestionUseCase,
      this._calculateResultUseCase,
      this._quizHistoryRepository,
      this._reportQuestionUseCase
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

  get questionReportRepository(): IQuestionReportRepository {
    return this._questionReportRepository;
  }

  get reportQuestionUseCase(): ReportQuestionUseCase {
    return this._reportQuestionUseCase;
  }

  get getQuestionReportsUseCase(): GetQuestionReportsUseCase {
    return this._getQuestionReportsUseCase;
  }
}
