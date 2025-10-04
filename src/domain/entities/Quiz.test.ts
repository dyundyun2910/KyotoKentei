import { Quiz } from './Quiz';
import { Question } from './Question';
import { QuizId } from '../valueObjects/QuizId';
import { Level } from '../valueObjects/Level';

const createMockQuestion = (id: string, level: string = '3級'): Question => {
  return Question.create({
    id,
    level,
    category: '歴史',
    examYear: '2004/12/12',
    questionText: `テスト問題${id}`,
    options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
    correctAnswerIndex: 0,
    explanation: '解説',
  });
};

describe('Quiz Entity', () => {
  describe('create', () => {
    it('should create a Quiz with questions', () => {
      const questions = [
        createMockQuestion('q001'),
        createMockQuestion('q002'),
        createMockQuestion('q003'),
      ];
      const quizId = QuizId.generate();
      const level = Level.fromString('3級');

      const quiz = Quiz.create(quizId, level, questions);

      expect(quiz.id).toBe(quizId);
      expect(quiz.level.equals(level)).toBe(true);
      expect(quiz.totalQuestions).toBe(3);
      expect(quiz.currentQuestionIndex).toBe(0);
      expect(quiz.isCompleted).toBe(false);
    });

    it('should throw error for empty questions array', () => {
      const quizId = QuizId.generate();
      const level = Level.fromString('3級');

      expect(() => Quiz.create(quizId, level, [])).toThrow(
        'Quiz must have at least one question'
      );
    });
  });

  describe('currentQuestion', () => {
    it('should return the first question initially', () => {
      const questions = [createMockQuestion('q001'), createMockQuestion('q002')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      expect(quiz.currentQuestion.id.value).toBe('q001');
    });
  });

  describe('answerCurrentQuestion', () => {
    it('should record the answer', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(2);

      expect(quiz.getAnswer('q001')).toBe(2);
    });

    it('should throw error when quiz is completed', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(0);
      quiz.moveToNextQuestion();

      expect(() => quiz.answerCurrentQuestion(0)).toThrow('Quiz is already completed');
    });
  });

  describe('moveToNextQuestion', () => {
    it('should move to next question', () => {
      const questions = [createMockQuestion('q001'), createMockQuestion('q002')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      expect(quiz.currentQuestionIndex).toBe(0);
      quiz.moveToNextQuestion();
      expect(quiz.currentQuestionIndex).toBe(1);
      expect(quiz.currentQuestion.id.value).toBe('q002');
    });

    it('should mark quiz as completed after last question', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      expect(quiz.isCompleted).toBe(false);
      quiz.moveToNextQuestion();
      expect(quiz.isCompleted).toBe(true);
    });

    it('should throw error when no more questions', () => {
      const questions = [createMockQuestion('q001')];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.moveToNextQuestion();

      expect(() => quiz.moveToNextQuestion()).toThrow('No more questions');
    });
  });

  describe('getAllAnswers', () => {
    it('should return all recorded answers', () => {
      const questions = [
        createMockQuestion('q001'),
        createMockQuestion('q002'),
        createMockQuestion('q003'),
      ];
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);

      quiz.answerCurrentQuestion(0);
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(1);
      quiz.moveToNextQuestion();
      quiz.answerCurrentQuestion(2);

      const answers = quiz.getAllAnswers();
      expect(answers.size).toBe(3);
      expect(answers.get('q001')).toBe(0);
      expect(answers.get('q002')).toBe(1);
      expect(answers.get('q003')).toBe(2);
    });
  });

  describe('startedAt', () => {
    it('should have a start time', () => {
      const questions = [createMockQuestion('q001')];
      const beforeCreate = new Date();
      const quiz = Quiz.create(QuizId.generate(), Level.fromString('3級'), questions);
      const afterCreate = new Date();

      expect(quiz.startedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(quiz.startedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });
});
