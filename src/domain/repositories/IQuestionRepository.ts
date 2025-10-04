import { Question } from '../entities/Question';
import { Level } from '../valueObjects/Level';

export interface IQuestionRepository {
  findAll(): Promise<Question[]>;
  findByLevel(level: Level): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
}
