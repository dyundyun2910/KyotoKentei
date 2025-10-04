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

  static create(id: QuizId, level: Level, questions: Question[]): Quiz {
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
