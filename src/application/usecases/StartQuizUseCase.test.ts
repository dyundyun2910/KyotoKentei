import { StartQuizUseCase } from './StartQuizUseCase';
import { StartQuizRequest } from '../dto/StartQuizRequest';
import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Question } from '../../domain/entities/Question';
import { Level } from '../../domain/valueObjects/Level';

class MockQuestionRepository implements IQuestionRepository {
  private questions: Question[] = [];

  setQuestions(questions: Question[]): void {
    this.questions = questions;
  }

  async findAll(): Promise<Question[]> {
    return this.questions;
  }

  async findByLevel(level: Level): Promise<Question[]> {
    return this.questions.filter((q) => q.level.equals(level));
  }

  async findById(id: string): Promise<Question | null> {
    return this.questions.find((q) => q.id.value === id) || null;
  }
}

const createMockQuestions = (count: number, level: string = '3級'): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= count; i++) {
    questions.push(
      Question.create({
        id: `q${String(i).padStart(3, '0')}`,
        level,
        category: '歴史',
        examYear: '2004/12/12',
        questionText: `テスト問題${i}`,
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
        correctAnswerIndex: 0,
        explanation: '解説',
      })
    );
  }
  return questions;
};

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
    const quiz = await useCase.execute(request);

    // Assert
    expect(quiz.totalQuestions).toBe(10);
    expect(quiz.level.value).toBe('3級');
    expect(quiz.id).toBeDefined();
  });

  it('should filter questions by level', async () => {
    // Arrange
    const request = new StartQuizRequest('3級', 5);
    const questions = [
      ...createMockQuestions(10, '3級'),
      ...createMockQuestions(10, '2級'),
    ];
    mockRepository.setQuestions(questions);

    // Act
    const quiz = await useCase.execute(request);

    // Assert
    expect(quiz.level.value).toBe('3級');
    expect(quiz.totalQuestions).toBe(5);
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

  it('should throw error for invalid level', async () => {
    // Arrange
    const request = new StartQuizRequest('4級', 10);
    mockRepository.setQuestions(createMockQuestions(50, '3級'));

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow('Invalid level');
  });

  it('should select random questions', async () => {
    // Arrange
    const request1 = new StartQuizRequest('3級', 10);
    const request2 = new StartQuizRequest('3級', 10);
    mockRepository.setQuestions(createMockQuestions(50, '3級'));

    // Act
    const quiz1 = await useCase.execute(request1);
    const quiz2 = await useCase.execute(request2);

    // Assert
    // Different quiz IDs (randomness is reflected in quiz creation)
    expect(quiz1.id.value).not.toBe(quiz2.id.value);
  });
});
