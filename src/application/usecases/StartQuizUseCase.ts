import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Quiz } from '../../domain/entities/Quiz';
import { Question } from '../../domain/entities/Question';
import { Level } from '../../domain/valueObjects/Level';
import { QuizId } from '../../domain/valueObjects/QuizId';
import { StartQuizRequest } from '../dto/StartQuizRequest';
import { StartQuizResponse } from '../dto/StartQuizResponse';

export class StartQuizUseCase {
  constructor(private readonly questionRepository: IQuestionRepository) {}

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

    const quiz = Quiz.create(QuizId.generate(), level, selectedQuestions);

    return StartQuizResponse.fromQuiz(quiz);
  }

  private selectRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
