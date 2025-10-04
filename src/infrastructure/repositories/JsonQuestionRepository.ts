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
    return all.filter((q) => q.level.equals(level));
  }

  async findById(id: string): Promise<Question | null> {
    const all = await this.findAll();
    return all.find((q) => q.id.value === id) || null;
  }

  private async loadQuestions(): Promise<void> {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const response = await fetch(`${baseUrl}data/questions.json`);
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
      explanation: dto.explanation,
    });
  }
}
