import { AnswerQuestionUseCase } from './AnswerQuestionUseCase';
import { AnswerQuestionRequest } from '../dto/AnswerQuestionRequest';
import { Quiz } from '../../domain/entities/Quiz';
import { Question } from '../../domain/entities/Question';
import { QuizId } from '../../domain/valueObjects/QuizId';
import { Level } from '../../domain/valueObjects/Level';

const createMockQuiz = (correctAnswerIndex: number = 0): Quiz => {
  const question = Question.create({
    id: 'q001',
    level: '3級',
    category: '歴史',
    examYear: '2004/12/12',
    questionText: 'テスト問題',
    options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
    correctAnswerIndex,
    explanation: 'これは解説文です。',
  });

  return Quiz.create(QuizId.generate(), Level.fromString('3級'), [question]);
};

describe('AnswerQuestionUseCase', () => {
  let useCase: AnswerQuestionUseCase;

  beforeEach(() => {
    useCase = new AnswerQuestionUseCase();
  });

  it('should return correct when answer is right', () => {
    // Arrange
    const quiz = createMockQuiz(2);
    const request = new AnswerQuestionRequest(2);

    // Act
    const response = useCase.execute(quiz, request);

    // Assert
    expect(response.isCorrect).toBe(true);
    expect(response.correctAnswerIndex).toBe(2);
    expect(response.explanation).toBeNull();
  });

  it('should return explanation when answer is wrong', () => {
    // Arrange
    const quiz = createMockQuiz(0);
    const request = new AnswerQuestionRequest(2);

    // Act
    const response = useCase.execute(quiz, request);

    // Assert
    expect(response.isCorrect).toBe(false);
    expect(response.correctAnswerIndex).toBe(0);
    expect(response.explanation).toBe('これは解説文です。');
  });

  it('should record the answer in quiz', () => {
    // Arrange
    const quiz = createMockQuiz(0);
    const request = new AnswerQuestionRequest(1);

    // Act
    useCase.execute(quiz, request);

    // Assert
    expect(quiz.getAnswer('q001')).toBe(1);
  });
});
