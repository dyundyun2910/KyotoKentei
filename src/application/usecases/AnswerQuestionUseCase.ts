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
