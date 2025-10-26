# 京都検定クイズアプリ 設計書

## 目次
1. [アーキテクチャ概要](#1-アーキテクチャ概要)
2. [Clean Architecture レイヤー設計](#2-clean-architecture-レイヤー設計)
3. [ドメインモデル設計](#3-ドメインモデル設計)
4. [ユースケース設計](#4-ユースケース設計)
5. [インターフェース層設計](#5-インターフェース層設計)
6. [インフラストラクチャ層設計](#6-インフラストラクチャ層設計)
7. [テスト戦略（TDD）](#7-テスト戦略tdd)
8. [Clean Code プラクティス](#8-clean-code-プラクティス)
9. [ディレクトリ構成](#9-ディレクトリ構成)
10. [開発フロー](#10-開発フロー)

---

## 1. アーキテクチャ概要

### 1.1 Clean Architecture の適用

本プロジェクトはRobert C. Martin (Uncle Bob) のClean Architectureに準拠し、以下の原則を守ります：

**依存性のルール**
- 依存関係は常に外側から内側へ向かう
- 内側の層は外側の層について何も知らない
- ビジネスルールは最も内側に配置

```
┌─────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                   │
│  (Frameworks, Drivers, External Interfaces)             │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Interface Adapters Layer               │  │
│  │  (Controllers, Presenters, Gateways)              │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Application Business Rules          │  │  │
│  │  │         (Use Cases)                         │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │   Enterprise Business Rules           │  │  │  │
│  │  │  │   (Entities, Domain Models)           │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 レイヤー分離

```
src/
├── domain/              # Enterprise Business Rules（最内層）
├── application/         # Application Business Rules（ユースケース層）
├── adapters/           # Interface Adapters（アダプター層）
└── infrastructure/     # Frameworks & Drivers（最外層）
```

---

## 2. Clean Architecture レイヤー設計

### 2.1 Domain Layer（ドメイン層）

**責務:**
- ビジネスルールの中核
- エンティティとバリューオブジェクトの定義
- ドメインロジックのカプセル化
- **他のどの層にも依存しない**

**含まれるもの:**
```
domain/
├── entities/
│   ├── Question.ts
│   ├── Quiz.ts
│   ├── QuizResult.ts
│   └── CategoryStatistics.ts
├── valueObjects/
│   ├── Level.ts
│   ├── Category.ts
│   ├── QuestionId.ts
│   └── Accuracy.ts
├── repositories/         # インターフェースのみ
│   ├── IQuestionRepository.ts
│   └── IQuizHistoryRepository.ts
└── services/
    └── QuizScoringService.ts
```

---

### 2.2 Application Layer（アプリケーション層）

**責務:**
- ユースケースの実装
- ビジネスフローのオーケストレーション
- ドメイン層のみに依存

**含まれるもの:**
```
application/
├── usecases/
│   ├── StartQuizUseCase.ts
│   ├── AnswerQuestionUseCase.ts
│   ├── CalculateResultUseCase.ts
│   ├── SaveQuizHistoryUseCase.ts
│   └── GetStatisticsUseCase.ts
└── dto/
    ├── StartQuizRequest.ts
    ├── AnswerQuestionRequest.ts
    └── QuizResultResponse.ts
```

---

### 2.3 Adapters Layer（アダプター層）

**責務:**
- ユースケースとUIの橋渡し
- データ形式の変換
- プレゼンテーションロジック

**含まれるもの:**
```
adapters/
├── presenters/
│   ├── QuizPresenter.ts
│   ├── ResultPresenter.ts
│   └── StatisticsPresenter.ts
├── controllers/
│   ├── QuizController.ts
│   └── StatisticsController.ts
└── viewModels/
    ├── QuizViewModel.ts
    ├── ResultViewModel.ts
    └── StatisticsViewModel.ts
```

---

### 2.4 Infrastructure Layer（インフラストラクチャ層）

**責務:**
- 外部システムとの連携
- データ永続化の実装
- フレームワーク固有のコード

**含まれるもの:**
```
infrastructure/
├── repositories/
│   ├── JsonQuestionRepository.ts
│   └── LocalStorageQuizHistoryRepository.ts
├── ui/
│   ├── components/
│   ├── pages/
│   └── hooks/
└── config/
    └── dependencies.ts
```

---

## 3. ドメインモデル設計

### 3.1 Entity: Question

```typescript
// domain/entities/Question.ts

import { QuestionId } from '../valueObjects/QuestionId';
import { Level } from '../valueObjects/Level';
import { Category } from '../valueObjects/Category';

export class Question {
  private constructor(
    private readonly _id: QuestionId,
    private readonly _level: Level,
    private readonly _category: Category,
    private readonly _examYear: string,
    private readonly _questionText: string,
    private readonly _options: readonly [string, string, string, string],
    private readonly _correctAnswerIndex: 0 | 1 | 2 | 3,
    private readonly _explanation: string
  ) {}

  static create(params: {
    id: string;
    level: string;
    category: string;
    examYear: string;
    questionText: string;
    options: [string, string, string, string];
    correctAnswerIndex: number;
    explanation: string;
  }): Question {
    return new Question(
      new QuestionId(params.id),
      Level.fromString(params.level),
      new Category(params.category),
      params.examYear,
      params.questionText,
      params.options,
      params.correctAnswerIndex as 0 | 1 | 2 | 3,
      params.explanation
    );
  }

  get id(): QuestionId {
    return this._id;
  }

  get level(): Level {
    return this._level;
  }

  get category(): Category {
    return this._category;
  }

  get examYear(): string {
    return this._examYear;
  }

  get questionText(): string {
    return this._questionText;
  }

  get options(): readonly [string, string, string, string] {
    return this._options;
  }

  get correctAnswerIndex(): 0 | 1 | 2 | 3 {
    return this._correctAnswerIndex;
  }

  get explanation(): string {
    return this._explanation;
  }

  isCorrectAnswer(answerIndex: number): boolean {
    return answerIndex === this._correctAnswerIndex;
  }
}
```

---

### 3.2 Entity: Quiz

```typescript
// domain/entities/Quiz.ts

import { Question } from './Question';
import { Level } from '../valueObjects/Level';
import { QuizId } from '../valueObjects/QuizId';

export class Quiz {
  private _currentQuestionIndex: number = 0;
  private _answers: Map<string, number> = new Map();
  private _startedAt: Date;

  private constructor(
    private readonly _id: QuizId,
    private readonly _level: Level,
    private readonly _questions: readonly Question[]
  ) {
    if (_questions.length === 0) {
      throw new Error('Quiz must have at least one question');
    }
    this._startedAt = new Date();
  }

  static create(
    id: QuizId,
    level: Level,
    questions: Question[]
  ): Quiz {
    return new Quiz(id, level, questions);
  }

  get id(): QuizId {
    return this._id;
  }

  get level(): Level {
    return this._level;
  }

  get questions(): readonly Question[] {
    return this._questions;
  }

  get currentQuestionIndex(): number {
    return this._currentQuestionIndex;
  }

  get totalQuestions(): number {
    return this._questions.length;
  }

  get currentQuestion(): Question {
    return this._questions[this._currentQuestionIndex];
  }

  get isCompleted(): boolean {
    return this._currentQuestionIndex >= this._questions.length;
  }

  get startedAt(): Date {
    return this._startedAt;
  }

  answerCurrentQuestion(answerIndex: number): void {
    if (this.isCompleted) {
      throw new Error('Quiz is already completed');
    }

    const currentQuestion = this.currentQuestion;
    this._answers.set(currentQuestion.id.value, answerIndex);
  }

  moveToNextQuestion(): void {
    if (this.isCompleted) {
      throw new Error('No more questions');
    }
    this._currentQuestionIndex++;
  }

  getAnswer(questionId: string): number | undefined {
    return this._answers.get(questionId);
  }

  getAllAnswers(): Map<string, number> {
    return new Map(this._answers);
  }
}
```

---

### 3.3 Entity: QuizResult

```typescript
// domain/entities/QuizResult.ts

import { Quiz } from './Quiz';
import { Accuracy } from '../valueObjects/Accuracy';
import { CategoryStatistics } from './CategoryStatistics';

export class QuizResult {
  private constructor(
    private readonly _quiz: Quiz,
    private readonly _correctCount: number,
    private readonly _accuracy: Accuracy,
    private readonly _categoryStatistics: readonly CategoryStatistics[],
    private readonly _completedAt: Date
  ) {}

  static fromQuiz(
    quiz: Quiz,
    categoryStatistics: CategoryStatistics[]
  ): QuizResult {
    const correctCount = this.calculateCorrectCount(quiz);
    const accuracy = Accuracy.calculate(correctCount, quiz.totalQuestions);

    return new QuizResult(
      quiz,
      correctCount,
      accuracy,
      categoryStatistics,
      new Date()
    );
  }

  private static calculateCorrectCount(quiz: Quiz): number {
    let correct = 0;
    for (const question of quiz.questions) {
      const answer = quiz.getAnswer(question.id.value);
      if (answer !== undefined && question.isCorrectAnswer(answer)) {
        correct++;
      }
    }
    return correct;
  }

  get quiz(): Quiz {
    return this._quiz;
  }

  get correctCount(): number {
    return this._correctCount;
  }

  get totalQuestions(): number {
    return this._quiz.totalQuestions;
  }

  get accuracy(): Accuracy {
    return this._accuracy;
  }

  get categoryStatistics(): readonly CategoryStatistics[] {
    return this._categoryStatistics;
  }

  get completedAt(): Date {
    return this._completedAt;
  }

  getWeakCategories(threshold: number = 70): CategoryStatistics[] {
    return this._categoryStatistics
      .filter(stat => stat.accuracy.value < threshold)
      .sort((a, b) => a.accuracy.value - b.accuracy.value);
  }
}
```

---

### 3.4 Value Object: Level

```typescript
// domain/valueObjects/Level.ts

export class Level {
  private static readonly VALID_LEVELS = ['1級', '2級', '3級'] as const;

  private constructor(private readonly _value: '1級' | '2級' | '3級') {}

  static fromString(value: string): Level {
    if (!this.isValid(value)) {
      throw new Error(`Invalid level: ${value}. Must be either '1級', '2級' or '3級'`);
    }
    return new Level(value as '1級' | '2級' | '3級');
  }

  private static isValid(value: string): value is '1級' | '2級' | '3級' {
    return this.VALID_LEVELS.includes(value as any);
  }

  get value(): '1級' | '2級' | '3級' {
    return this._value;
  }

  equals(other: Level): boolean {
    return this._value === other._value;
  }
}
```

---

### 3.5 Value Object: Category

```typescript
// domain/valueObjects/Category.ts

export class Category {
  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('Category cannot be empty');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Category): boolean {
    return this._value === other._value;
  }
}
```

---

### 3.6 Value Object: Accuracy

```typescript
// domain/valueObjects/Accuracy.ts

export class Accuracy {
  private constructor(private readonly _value: number) {
    if (_value < 0 || _value > 100) {
      throw new Error('Accuracy must be between 0 and 100');
    }
  }

  static calculate(correct: number, total: number): Accuracy {
    if (total === 0) {
      throw new Error('Total cannot be zero');
    }
    if (correct < 0 || correct > total) {
      throw new Error('Correct count must be between 0 and total');
    }
    const percentage = Math.round((correct / total) * 100);
    return new Accuracy(percentage);
  }

  static fromPercentage(percentage: number): Accuracy {
    return new Accuracy(percentage);
  }

  get value(): number {
    return this._value;
  }

  isAbove(threshold: number): boolean {
    return this._value > threshold;
  }

  isBelow(threshold: number): boolean {
    return this._value < threshold;
  }
}
```

---

### 3.7 Repository Interface

```typescript
// domain/repositories/IQuestionRepository.ts

import { Question } from '../entities/Question';
import { Level } from '../valueObjects/Level';

export interface IQuestionRepository {
  findAll(): Promise<Question[]>;
  findByLevel(level: Level): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
}
```

```typescript
// domain/repositories/IQuizHistoryRepository.ts

import { QuizResult } from '../entities/QuizResult';

export interface IQuizHistoryRepository {
  save(result: QuizResult): Promise<void>;
  findAll(): Promise<QuizResult[]>;
  clear(): Promise<void>;
}
```

### 3.8 Entity: QuestionReport

**新機能: 問題の間違い報告**

```typescript
// domain/entities/QuestionReport.ts

import { QuestionId } from '../valueObjects/QuestionId';

export class QuestionReport {
  private constructor(
    private readonly _questionId: QuestionId,
    private _reportCount: number,
    private readonly _firstReportedAt: Date,
    private _lastReportedAt: Date
  ) {}

  static create(questionId: QuestionId): QuestionReport {
    const now = new Date();
    return new QuestionReport(questionId, 1, now, now);
  }

  static reconstruct(
    questionId: QuestionId,
    reportCount: number,
    firstReportedAt: Date,
    lastReportedAt: Date
  ): QuestionReport {
    if (reportCount < 1) {
      throw new Error('Report count must be at least 1');
    }
    return new QuestionReport(
      questionId,
      reportCount,
      firstReportedAt,
      lastReportedAt
    );
  }

  get questionId(): QuestionId {
    return this._questionId;
  }

  get reportCount(): number {
    return this._reportCount;
  }

  get firstReportedAt(): Date {
    return this._firstReportedAt;
  }

  get lastReportedAt(): Date {
    return this._lastReportedAt;
  }

  incrementReport(): void {
    this._reportCount++;
    this._lastReportedAt = new Date();
  }
}
```

### 3.9 Repository Interface: IQuestionReportRepository

```typescript
// domain/repositories/IQuestionReportRepository.ts

import { QuestionReport } from '../entities/QuestionReport';
import { QuestionId } from '../valueObjects/QuestionId';

export interface IQuestionReportRepository {
  findByQuestionId(questionId: QuestionId): Promise<QuestionReport | null>;
  save(report: QuestionReport): Promise<void>;
  findAll(): Promise<QuestionReport[]>;
  clear(): Promise<void>;
}
```

---

## 4. ユースケース設計

### 4.1 StartQuizUseCase

```typescript
// application/usecases/StartQuizUseCase.ts

import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Quiz } from '../../domain/entities/Quiz';
import { Level } from '../../domain/valueObjects/Level';
import { QuizId } from '../../domain/valueObjects/QuizId';
import { StartQuizRequest } from '../dto/StartQuizRequest';
import { StartQuizResponse } from '../dto/StartQuizResponse';

export class StartQuizUseCase {
  constructor(
    private readonly questionRepository: IQuestionRepository
  ) {}

  async execute(request: StartQuizRequest): Promise<StartQuizResponse> {
    const level = Level.fromString(request.level);
    const allQuestions = await this.questionRepository.findByLevel(level);

    if (allQuestions.length < request.questionCount) {
      throw new Error(
        `Not enough questions available. Requested: ${request.questionCount}, Available: ${allQuestions.length}`
      );
    }

    const selectedQuestions = this.selectRandomQuestions(
      allQuestions,
      request.questionCount
    );

    const quiz = Quiz.create(
      QuizId.generate(),
      level,
      selectedQuestions
    );

    return StartQuizResponse.fromQuiz(quiz);
  }

  private selectRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
```

**テストファーストで実装:**
```typescript
// application/usecases/StartQuizUseCase.test.ts

describe('StartQuizUseCase', () => {
  let useCase: StartQuizUseCase;
  let mockRepository: MockQuestionRepository;

  beforeEach(() => {
    mockRepository = new MockQuestionRepository();
    useCase = new StartQuizUseCase(mockRepository);
  });

  it('should start a quiz with specified number of questions', async () => {
    // Arrange
    const request = new StartQuizRequest('3級', 10);
    mockRepository.setQuestions(createMockQuestions(50, '3級'));

    // Act
    const response = await useCase.execute(request);

    // Assert
    expect(response.totalQuestions).toBe(10);
    expect(response.level).toBe('3級');
  });

  it('should throw error when not enough questions available', async () => {
    // Arrange
    const request = new StartQuizRequest('3級', 100);
    mockRepository.setQuestions(createMockQuestions(50, '3級'));

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      'Not enough questions available'
    );
  });
});
```

---

### 4.2 AnswerQuestionUseCase

```typescript
// application/usecases/AnswerQuestionUseCase.ts

import { Quiz } from '../../domain/entities/Quiz';
import { AnswerQuestionRequest } from '../dto/AnswerQuestionRequest';
import { AnswerQuestionResponse } from '../dto/AnswerQuestionResponse';

export class AnswerQuestionUseCase {
  execute(quiz: Quiz, request: AnswerQuestionRequest): AnswerQuestionResponse {
    const currentQuestion = quiz.currentQuestion;
    const isCorrect = currentQuestion.isCorrectAnswer(request.answerIndex);

    quiz.answerCurrentQuestion(request.answerIndex);

    return AnswerQuestionResponse.create(
      isCorrect,
      currentQuestion.correctAnswerIndex,
      isCorrect ? null : currentQuestion.explanation
    );
  }
}
```

**テスト:**
```typescript
// application/usecases/AnswerQuestionUseCase.test.ts

describe('AnswerQuestionUseCase', () => {
  let useCase: AnswerQuestionUseCase;

  beforeEach(() => {
    useCase = new AnswerQuestionUseCase();
  });

  it('should return correct when answer is right', () => {
    // Arrange
    const quiz = createMockQuiz();
    const request = new AnswerQuestionRequest(quiz.currentQuestion.correctAnswerIndex);

    // Act
    const response = useCase.execute(quiz, request);

    // Assert
    expect(response.isCorrect).toBe(true);
    expect(response.explanation).toBeNull();
  });

  it('should return explanation when answer is wrong', () => {
    // Arrange
    const quiz = createMockQuiz();
    const wrongAnswer = (quiz.currentQuestion.correctAnswerIndex + 1) % 4;
    const request = new AnswerQuestionRequest(wrongAnswer);

    // Act
    const response = useCase.execute(quiz, request);

    // Assert
    expect(response.isCorrect).toBe(false);
    expect(response.explanation).not.toBeNull();
  });
});
```

---

### 4.3 CalculateResultUseCase

```typescript
// application/usecases/CalculateResultUseCase.ts

import { Quiz } from '../../domain/entities/Quiz';
import { QuizResult } from '../../domain/entities/QuizResult';
import { CategoryStatistics } from '../../domain/entities/CategoryStatistics';
import { QuizScoringService } from '../../domain/services/QuizScoringService';

export class CalculateResultUseCase {
  constructor(
    private readonly scoringService: QuizScoringService
  ) {}

  execute(quiz: Quiz): QuizResult {
    if (!quiz.isCompleted) {
      throw new Error('Quiz is not completed yet');
    }

    const categoryStatistics = this.scoringService.calculateCategoryStatistics(quiz);

    return QuizResult.fromQuiz(quiz, categoryStatistics);
  }
}
```

---

### 4.4 ReportQuestionUseCase

**新機能: 問題の間違い報告ユースケース**

```typescript
// application/usecases/ReportQuestionUseCase.ts

import { IQuestionReportRepository } from '../../domain/repositories/IQuestionReportRepository';
import { QuestionReport } from '../../domain/entities/QuestionReport';
import { QuestionId } from '../../domain/valueObjects/QuestionId';
import { ReportQuestionRequest } from '../dto/ReportQuestionRequest';

export class ReportQuestionUseCase {
  constructor(
    private readonly questionReportRepository: IQuestionReportRepository
  ) {}

  async execute(request: ReportQuestionRequest): Promise<void> {
    const questionId = new QuestionId(request.questionId);

    // 既存の報告を探す
    const existingReport = await this.questionReportRepository.findByQuestionId(questionId);

    if (existingReport) {
      // 既存の報告がある場合は報告回数を増やす
      existingReport.incrementReport();
      await this.questionReportRepository.save(existingReport);
    } else {
      // 新しい報告を作成
      const newReport = QuestionReport.create(questionId);
      await this.questionReportRepository.save(newReport);
    }
  }
}
```

**DTO:**
```typescript
// application/dto/ReportQuestionRequest.ts

export class ReportQuestionRequest {
  constructor(public readonly questionId: string) {
    if (!questionId || questionId.trim().length === 0) {
      throw new Error('Question ID cannot be empty');
    }
  }
}
```

**テスト:**
```typescript
// application/usecases/ReportQuestionUseCase.test.ts

describe('ReportQuestionUseCase', () => {
  let useCase: ReportQuestionUseCase;
  let mockRepository: MockQuestionReportRepository;

  beforeEach(() => {
    mockRepository = new MockQuestionReportRepository();
    useCase = new ReportQuestionUseCase(mockRepository);
  });

  it('should create new report when question has not been reported', async () => {
    // Arrange
    const request = new ReportQuestionRequest('q001');
    mockRepository.setReports([]);

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
});
```

---

### 4.5 GetQuestionReportsUseCase

**管理者向け: 報告データ取得ユースケース**

```typescript
// application/usecases/GetQuestionReportsUseCase.ts

import { IQuestionReportRepository } from '../../domain/repositories/IQuestionReportRepository';
import { QuestionReport } from '../../domain/entities/QuestionReport';
import { GetQuestionReportsResponse } from '../dto/GetQuestionReportsResponse';

export class GetQuestionReportsUseCase {
  constructor(
    private readonly questionReportRepository: IQuestionReportRepository
  ) {}

  async execute(): Promise<GetQuestionReportsResponse> {
    const reports = await this.questionReportRepository.findAll();

    // 報告回数の多い順にソート
    const sortedReports = reports
      .sort((a, b) => b.reportCount - a.reportCount);

    return GetQuestionReportsResponse.fromReports(sortedReports);
  }
}
```

**DTO:**
```typescript
// application/dto/GetQuestionReportsResponse.ts

import { QuestionReport } from '../../domain/entities/QuestionReport';

export interface QuestionReportDTO {
  questionId: string;
  reportCount: number;
  firstReportedAt: string;
  lastReportedAt: string;
}

export class GetQuestionReportsResponse {
  constructor(public readonly reports: QuestionReportDTO[]) {}

  static fromReports(reports: QuestionReport[]): GetQuestionReportsResponse {
    const dtos = reports.map(report => ({
      questionId: report.questionId.value,
      reportCount: report.reportCount,
      firstReportedAt: report.firstReportedAt.toISOString(),
      lastReportedAt: report.lastReportedAt.toISOString()
    }));

    return new GetQuestionReportsResponse(dtos);
  }
}
```

---

## 5. インターフェース層設計

### 5.1 Controller

```typescript
// adapters/controllers/QuizController.ts

import { StartQuizUseCase } from '../../application/usecases/StartQuizUseCase';
import { AnswerQuestionUseCase } from '../../application/usecases/AnswerQuestionUseCase';
import { QuizPresenter } from '../presenters/QuizPresenter';

export class QuizController {
  constructor(
    private readonly startQuizUseCase: StartQuizUseCase,
    private readonly answerQuestionUseCase: AnswerQuestionUseCase,
    private readonly presenter: QuizPresenter
  ) {}

  async startQuiz(level: string, questionCount: number): Promise<void> {
    try {
      const request = new StartQuizRequest(level, questionCount);
      const response = await this.startQuizUseCase.execute(request);
      this.presenter.presentQuizStarted(response);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }

  answerQuestion(answerIndex: number): void {
    try {
      // Quiz state is managed by presenter
      const quiz = this.presenter.getCurrentQuiz();
      const request = new AnswerQuestionRequest(answerIndex);
      const response = this.answerQuestionUseCase.execute(quiz, request);
      this.presenter.presentAnswerResult(response);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }
}
```

---

### 5.2 Presenter

```typescript
// adapters/presenters/QuizPresenter.ts

import { Quiz } from '../../domain/entities/Quiz';
import { QuizViewModel } from '../viewModels/QuizViewModel';

export interface QuizPresenter {
  presentQuizStarted(response: StartQuizResponse): void;
  presentAnswerResult(response: AnswerQuestionResponse): void;
  presentError(error: Error): void;
  getCurrentQuiz(): Quiz;
  getViewModel(): QuizViewModel;
}
```

---

### 5.3 ViewModel

```typescript
// adapters/viewModels/QuizViewModel.ts

export interface QuizViewModel {
  currentQuestionIndex: number;
  totalQuestions: number;
  level: string;
  question: {
    text: string;
    category: string;
    options: [string, string, string, string];
  };
  feedback: {
    isCorrect: boolean;
    correctAnswerIndex: number;
    explanation: string | null;
  } | null;
  isCompleted: boolean;
}
```

---

## 6. インフラストラクチャ層設計

### 6.1 JsonQuestionRepository

```typescript
// infrastructure/repositories/JsonQuestionRepository.ts

import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Question } from '../../domain/entities/Question';
import { Level } from '../../domain/valueObjects/Level';

interface QuestionDTO {
  id: string;
  level: string;
  category: string;
  'exam-year': string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

export class JsonQuestionRepository implements IQuestionRepository {
  private questions: Question[] | null = null;

  async findAll(): Promise<Question[]> {
    if (!this.questions) {
      await this.loadQuestions();
    }
    return this.questions!;
  }

  async findByLevel(level: Level): Promise<Question[]> {
    const all = await this.findAll();
    return all.filter(q => q.level.equals(level));
  }

  async findById(id: string): Promise<Question | null> {
    const all = await this.findAll();
    return all.find(q => q.id.value === id) || null;
  }

  private async loadQuestions(): Promise<void> {
    const response = await fetch('/data/questions.json');
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }
    const data = await response.json();
    this.questions = data.questions.map(this.toEntity);
  }

  private toEntity(dto: QuestionDTO): Question {
    return Question.create({
      id: dto.id,
      level: dto.level,
      category: dto.category,
      examYear: dto['exam-year'],
      questionText: dto.question,
      options: dto.options,
      correctAnswerIndex: dto.correctAnswer,
      explanation: dto.explanation
    });
  }
}
```

**テスト:**
```typescript
// infrastructure/repositories/JsonQuestionRepository.test.ts

describe('JsonQuestionRepository', () => {
  let repository: JsonQuestionRepository;

  beforeEach(() => {
    repository = new JsonQuestionRepository();
    setupFetchMock(); // Mock fetch API
  });

  it('should load questions from JSON file', async () => {
    // Act
    const questions = await repository.findAll();

    // Assert
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toBeInstanceOf(Question);
  });

  it('should filter questions by level', async () => {
    // Arrange
    const level = Level.fromString('3級');

    // Act
    const questions = await repository.findByLevel(level);

    // Assert
    questions.forEach(q => {
      expect(q.level.equals(level)).toBe(true);
    });
  });
});
```

---

### 6.2 LocalStorageQuizHistoryRepository

```typescript
// infrastructure/repositories/LocalStorageQuizHistoryRepository.ts

import { IQuizHistoryRepository } from '../../domain/repositories/IQuizHistoryRepository';
import { QuizResult } from '../../domain/entities/QuizResult';

const STORAGE_KEY = 'kyoto-quiz-history';

export class LocalStorageQuizHistoryRepository implements IQuizHistoryRepository {
  async save(result: QuizResult): Promise<void> {
    try {
      const history = await this.findAll();
      history.push(result);
      const serialized = JSON.stringify(history.map(this.toDTO));
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.warn('Failed to save quiz history', error);
    }
  }

  async findAll(): Promise<QuizResult[]> {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return [];
      const data = JSON.parse(serialized);
      return data.map(this.toEntity);
    } catch (error) {
      console.warn('Failed to load quiz history', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  private toDTO(result: QuizResult): any {
    // Serialize QuizResult to plain object
  }

  private toEntity(dto: any): QuizResult {
    // Deserialize plain object to QuizResult
  }
}
```

---

## 7. テスト戦略（TDD）

### 7.1 テストピラミッド

```
        ┌─────────────┐
        │   E2E Tests │  (少ない)
        │   (Cypress) │
        └─────────────┘
       ┌───────────────┐
       │Integration Tests│  (中程度)
       │     (Jest)      │
       └───────────────┘
      ┌─────────────────┐
      │   Unit Tests    │  (多い)
      │     (Jest)      │
      └─────────────────┘
```

### 7.2 TDD サイクル

**Red → Green → Refactor**

1. **Red**: 失敗するテストを書く
2. **Green**: テストが通る最小限のコードを書く
3. **Refactor**: コードをクリーンにする

### 7.3 テスト対象と優先順位

**Priority 1: Domain Layer（最優先）**
- Entity
- Value Object
- Domain Service

**Priority 2: Use Cases**
- ビジネスロジックのテスト
- モックリポジトリを使用

**Priority 3: Infrastructure**
- Repository実装
- 外部依存のテスト

**Priority 4: UI Components**
- React Testing Library
- スナップショットテスト

### 7.4 テスト例

#### 7.4.1 Entity のテスト

```typescript
// domain/entities/Question.test.ts

describe('Question Entity', () => {
  describe('create', () => {
    it('should create a valid Question', () => {
      // Arrange
      const params = {
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 0,
        explanation: '解説'
      };

      // Act
      const question = Question.create(params);

      // Assert
      expect(question.id.value).toBe('q001');
      expect(question.level.value).toBe('3級');
      expect(question.questionText).toBe('テスト問題');
    });

    it('should throw error for invalid level', () => {
      // Arrange
      const params = {
        id: 'q001',
        level: '1級', // Invalid
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 0,
        explanation: '解説'
      };

      // Act & Assert
      expect(() => Question.create(params)).toThrow('Invalid level');
    });
  });

  describe('isCorrectAnswer', () => {
    it('should return true for correct answer', () => {
      // Arrange
      const question = createTestQuestion({ correctAnswerIndex: 2 });

      // Act
      const result = question.isCorrectAnswer(2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      // Arrange
      const question = createTestQuestion({ correctAnswerIndex: 2 });

      // Act
      const result = question.isCorrectAnswer(1);

      // Assert
      expect(result).toBe(false);
    });
  });
});
```

#### 7.4.2 Value Object のテスト

```typescript
// domain/valueObjects/Accuracy.test.ts

describe('Accuracy Value Object', () => {
  describe('calculate', () => {
    it('should calculate correct percentage', () => {
      // Act
      const accuracy = Accuracy.calculate(7, 10);

      // Assert
      expect(accuracy.value).toBe(70);
    });

    it('should round to nearest integer', () => {
      // Act
      const accuracy = Accuracy.calculate(2, 3);

      // Assert
      expect(accuracy.value).toBe(67); // 66.666... → 67
    });

    it('should throw error for zero total', () => {
      // Act & Assert
      expect(() => Accuracy.calculate(0, 0)).toThrow('Total cannot be zero');
    });

    it('should throw error for negative values', () => {
      // Act & Assert
      expect(() => Accuracy.calculate(-1, 10)).toThrow();
    });

    it('should throw error when correct > total', () => {
      // Act & Assert
      expect(() => Accuracy.calculate(11, 10)).toThrow();
    });
  });

  describe('isAbove', () => {
    it('should return true when above threshold', () => {
      // Arrange
      const accuracy = Accuracy.fromPercentage(80);

      // Act & Assert
      expect(accuracy.isAbove(70)).toBe(true);
    });

    it('should return false when below threshold', () => {
      // Arrange
      const accuracy = Accuracy.fromPercentage(60);

      // Act & Assert
      expect(accuracy.isAbove(70)).toBe(false);
    });
  });
});
```

#### 7.4.3 Use Case のテスト

```typescript
// application/usecases/CalculateResultUseCase.test.ts

describe('CalculateResultUseCase', () => {
  let useCase: CalculateResultUseCase;
  let mockScoringService: MockQuizScoringService;

  beforeEach(() => {
    mockScoringService = new MockQuizScoringService();
    useCase = new CalculateResultUseCase(mockScoringService);
  });

  it('should calculate result for completed quiz', () => {
    // Arrange
    const quiz = createCompletedQuiz({
      totalQuestions: 10,
      correctAnswers: 7
    });

    // Act
    const result = useCase.execute(quiz);

    // Assert
    expect(result.correctCount).toBe(7);
    expect(result.accuracy.value).toBe(70);
  });

  it('should throw error for incomplete quiz', () => {
    // Arrange
    const quiz = createIncompleteQuiz();

    // Act & Assert
    expect(() => useCase.execute(quiz)).toThrow('Quiz is not completed yet');
  });

  it('should include category statistics', () => {
    // Arrange
    const quiz = createCompletedQuiz();
    const expectedStats = [
      createCategoryStatistics('歴史', 3, 5),
      createCategoryStatistics('寺院', 4, 5)
    ];
    mockScoringService.setStatistics(expectedStats);

    // Act
    const result = useCase.execute(quiz);

    // Assert
    expect(result.categoryStatistics).toHaveLength(2);
  });
});
```

---

## 8. Clean Code プラクティス

### 8.1 命名規則

**Uncle Bob の原則:**
- 意図を明確にする名前
- 誤解を招かない名前
- 検索可能な名前

**Good Examples:**
```typescript
// ✅ Good
class QuizScoringService {
  calculateCategoryStatistics(quiz: Quiz): CategoryStatistics[] {
    // ...
  }
}

const MINIMUM_ACCURACY_THRESHOLD = 70;

function isWeakCategory(accuracy: Accuracy): boolean {
  return accuracy.isBelow(MINIMUM_ACCURACY_THRESHOLD);
}
```

**Bad Examples:**
```typescript
// ❌ Bad
class QS {
  calc(q: Quiz): any[] {
    // ...
  }
}

const thr = 70;

function check(a: number): boolean {
  return a < thr;
}
```

---

### 8.2 関数の原則

**Small Functions (小さい関数)**
- 1つの関数は1つのことだけをする
- 理想は20行以内

```typescript
// ✅ Good: Single Responsibility
function selectRandomQuestions(
  questions: Question[],
  count: number
): Question[] {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
```

```typescript
// ❌ Bad: Doing too many things
function startQuiz(level: string, count: number): Quiz {
  // Load questions
  const response = fetch('/data/questions.json');
  const data = response.json();

  // Filter by level
  const filtered = data.questions.filter(q => q.level === level);

  // Shuffle
  const shuffled = filtered.sort(() => Math.random() - 0.5);

  // Select
  const selected = shuffled.slice(0, count);

  // Create quiz
  return new Quiz(selected);
}
```

---

### 8.3 コメント

**Good Code > Comments**
- コードで意図を表現する
- コメントが必要な時は、なぜそうするかを説明

```typescript
// ✅ Good: Code explains itself
function getWeakCategories(
  categoryStatistics: CategoryStatistics[],
  threshold: number = 70
): CategoryStatistics[] {
  return categoryStatistics
    .filter(stat => stat.accuracy.value < threshold)
    .sort((a, b) => a.accuracy.value - b.accuracy.value);
}
```

```typescript
// ❌ Bad: Unnecessary comments
function getWeakCategories(stats: any[], t: number = 70): any[] {
  // Filter stats
  return stats
    .filter(s => s.acc < t) // Get items below threshold
    .sort((a, b) => a.acc - b.acc); // Sort ascending
}
```

---

### 8.4 エラーハンドリング

**Use Exceptions, Not Error Codes**

```typescript
// ✅ Good
class Quiz {
  answerCurrentQuestion(answerIndex: number): void {
    if (this.isCompleted) {
      throw new QuizAlreadyCompletedError();
    }
    // ...
  }
}
```

```typescript
// ❌ Bad
class Quiz {
  answerCurrentQuestion(answerIndex: number): { success: boolean; error?: string } {
    if (this.isCompleted) {
      return { success: false, error: 'Quiz is completed' };
    }
    // ...
    return { success: true };
  }
}
```

---

### 8.5 DRY (Don't Repeat Yourself)

```typescript
// ✅ Good: Extract common logic
abstract class BaseRepository<T> {
  protected async fetchJson(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${url}`);
    }
    return response.json();
  }
}

class JsonQuestionRepository extends BaseRepository<Question> {
  async findAll(): Promise<Question[]> {
    const data = await this.fetchJson('/data/questions.json');
    return data.questions.map(this.toEntity);
  }
}
```

---

## 9. ディレクトリ構成

```
kyoto-quiz/
├── public/
│   ├── index.html
│   └── data/
│       └── questions.json
├── src/
│   ├── domain/                    # Enterprise Business Rules
│   │   ├── entities/
│   │   │   ├── Question.ts
│   │   │   ├── Question.test.ts
│   │   │   ├── Quiz.ts
│   │   │   ├── Quiz.test.ts
│   │   │   ├── QuizResult.ts
│   │   │   ├── QuizResult.test.ts
│   │   │   ├── CategoryStatistics.ts
│   │   │   └── CategoryStatistics.test.ts
│   │   ├── valueObjects/
│   │   │   ├── QuizId.ts
│   │   │   ├── QuestionId.ts
│   │   │   ├── Level.ts
│   │   │   ├── Level.test.ts
│   │   │   ├── Category.ts
│   │   │   ├── Category.test.ts
│   │   │   ├── Accuracy.ts
│   │   │   └── Accuracy.test.ts
│   │   ├── repositories/
│   │   │   ├── IQuestionRepository.ts
│   │   │   └── IQuizHistoryRepository.ts
│   │   └── services/
│   │       ├── QuizScoringService.ts
│   │       └── QuizScoringService.test.ts
│   ├── application/               # Application Business Rules
│   │   ├── usecases/
│   │   │   ├── StartQuizUseCase.ts
│   │   │   ├── StartQuizUseCase.test.ts
│   │   │   ├── AnswerQuestionUseCase.ts
│   │   │   ├── AnswerQuestionUseCase.test.ts
│   │   │   ├── CalculateResultUseCase.ts
│   │   │   ├── CalculateResultUseCase.test.ts
│   │   │   ├── SaveQuizHistoryUseCase.ts
│   │   │   └── GetStatisticsUseCase.ts
│   │   └── dto/
│   │       ├── StartQuizRequest.ts
│   │       ├── StartQuizResponse.ts
│   │       ├── AnswerQuestionRequest.ts
│   │       └── AnswerQuestionResponse.ts
│   ├── adapters/                  # Interface Adapters
│   │   ├── controllers/
│   │   │   ├── QuizController.ts
│   │   │   ├── QuizController.test.ts
│   │   │   ├── StatisticsController.ts
│   │   │   └── StatisticsController.test.ts
│   │   ├── presenters/
│   │   │   ├── QuizPresenter.ts
│   │   │   ├── QuizPresenterImpl.ts
│   │   │   ├── ResultPresenter.ts
│   │   │   └── StatisticsPresenter.ts
│   │   └── viewModels/
│   │       ├── QuizViewModel.ts
│   │       ├── ResultViewModel.ts
│   │       └── StatisticsViewModel.ts
│   ├── infrastructure/            # Frameworks & Drivers
│   │   ├── repositories/
│   │   │   ├── JsonQuestionRepository.ts
│   │   │   ├── JsonQuestionRepository.test.ts
│   │   │   ├── LocalStorageQuizHistoryRepository.ts
│   │   │   └── LocalStorageQuizHistoryRepository.test.ts
│   │   ├── ui/
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   └── ProgressBar.tsx
│   │   │   │   └── screens/
│   │   │   │       ├── StartScreen.tsx
│   │   │   │       ├── StartScreen.test.tsx
│   │   │   │       ├── LevelSelector.tsx
│   │   │   │       ├── QuestionCountSelector.tsx
│   │   │   │       ├── QuizScreen.tsx
│   │   │   │       ├── FeedbackScreen.tsx
│   │   │   │       └── ResultScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useQuizController.ts
│   │   │   │   └── useQuizViewModel.ts
│   │   │   └── pages/
│   │   │       └── App.tsx
│   │   └── config/
│   │       └── dependencies.ts     # DI Container
│   ├── shared/                    # 共通ユーティリティ
│   │   ├── errors/
│   │   │   ├── QuizAlreadyCompletedError.ts
│   │   │   └── QuestionNotFoundError.ts
│   │   └── utils/
│   │       └── arrayUtils.ts
│   └── index.tsx
├── scripts/
│   └── parse_pdf.py
├── docs/
│   ├── requirements.md
│   └── design.md
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## 10. 開発フロー

### 10.1 TDD開発フロー

**Phase 1: Domain Layer（Week 1）**

1. **Day 1-2: Value Objects**
   ```
   Red → Write failing test for Level
   Green → Implement Level to pass test
   Refactor → Clean up code

   Red → Write failing test for Category
   Green → Implement Category
   Refactor

   Red → Write failing test for Accuracy
   Green → Implement Accuracy
   Refactor
   ```

2. **Day 3-4: Entities**
   ```
   Red → Write failing test for Question.create()
   Green → Implement Question
   Refactor

   Red → Write failing test for Quiz.answerCurrentQuestion()
   Green → Implement Quiz
   Refactor

   Red → Write failing test for QuizResult.fromQuiz()
   Green → Implement QuizResult
   Refactor
   ```

3. **Day 5: Domain Services**
   ```
   Red → Write failing test for QuizScoringService
   Green → Implement scoring logic
   Refactor
   ```

**Phase 2: Application Layer（Week 2）**

4. **Day 1-2: Use Cases**
   ```
   Red → Write failing test for StartQuizUseCase
   Green → Implement use case with mock repository
   Refactor

   (Repeat for all use cases)
   ```

**Phase 3: Infrastructure Layer（Week 2-3）**

5. **Day 3-4: Repositories**
   ```
   Red → Write failing test for JsonQuestionRepository
   Green → Implement repository
   Refactor

   Red → Write failing test for LocalStorageQuizHistoryRepository
   Green → Implement repository
   Refactor
   ```

**Phase 4: UI Layer（Week 3-4）**

6. **Day 1-5: React Components**
   ```
   Red → Write failing test for Button component
   Green → Implement Button
   Refactor

   (Repeat for all components)
   ```

---

### 10.2 依存性注入

```typescript
// infrastructure/config/dependencies.ts

import { JsonQuestionRepository } from '../repositories/JsonQuestionRepository';
import { LocalStorageQuizHistoryRepository } from '../repositories/LocalStorageQuizHistoryRepository';
import { StartQuizUseCase } from '../../application/usecases/StartQuizUseCase';
import { QuizScoringService } from '../../domain/services/QuizScoringService';

export class DependencyContainer {
  private static instance: DependencyContainer;

  private readonly _questionRepository = new JsonQuestionRepository();
  private readonly _quizHistoryRepository = new LocalStorageQuizHistoryRepository();
  private readonly _scoringService = new QuizScoringService();

  private constructor() {}

  static getInstance(): DependencyContainer {
    if (!this.instance) {
      this.instance = new DependencyContainer();
    }
    return this.instance;
  }

  get questionRepository() {
    return this._questionRepository;
  }

  get quizHistoryRepository() {
    return this._quizHistoryRepository;
  }

  get startQuizUseCase() {
    return new StartQuizUseCase(this._questionRepository);
  }

  get calculateResultUseCase() {
    return new CalculateResultUseCase(this._scoringService);
  }

  // ... other use cases
}
```

---

### 10.3 テスト実行

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:domain": "jest src/domain",
    "test:application": "jest src/application",
    "test:infrastructure": "jest src/infrastructure"
  }
}
```

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/**/*.test.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 11. まとめ

### 11.1 Clean Architecture のメリット

1. **テスタビリティ**: ビジネスロジックが独立しているため、テストが容易
2. **保守性**: 関心の分離により、変更の影響範囲が限定的
3. **拡張性**: 新機能追加時に既存コードへの影響が少ない
4. **フレームワーク非依存**: Reactを別のフレームワークに置き換えても、ドメイン層は影響を受けない

### 11.2 TDDのメリット

1. **品質保証**: コードが常にテストされている
2. **設計改善**: テストしやすいコードは良い設計
3. **リファクタリングの安全性**: テストがあるため、安心してリファクタリングできる
4. **ドキュメント**: テストがコードの仕様書になる

### 11.3 Clean Codeのメリット

1. **可読性**: コードが読みやすく、理解しやすい
2. **保守性**: 変更が容易
3. **チーム開発**: 他のメンバーが理解しやすい
4. **バグの減少**: シンプルなコードはバグが少ない

---

**この設計に従うことで、Uncle Bobにも、t-wadaにも怒られない、品質の高いアプリケーションを開発できます。**
