import { Question } from './Question';

describe('Question Entity', () => {
  describe('create', () => {
    it('should create a valid Question', () => {
      const params = {
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: '延暦13年(794)、桓武天皇は( )から、平安京に新しい都を遷した。',
        options: ['長岡京', '平城京', '難波京', '藤原京'] as [string, string, string, string],
        correctAnswerIndex: 0,
        explanation: '桓武天皇は長岡京から新しい都の平安京に遷都しました。',
      };

      const question = Question.create(params);

      expect(question.id.value).toBe('q001');
      expect(question.level.value).toBe('3級');
      expect(question.category.value).toBe('歴史');
      expect(question.examYear).toBe('2004/12/12');
      expect(question.questionText).toBe(params.questionText);
      expect(question.options).toEqual(params.options);
      expect(question.correctAnswerIndex).toBe(0);
      expect(question.explanation).toBe(params.explanation);
    });

    it('should throw error for invalid level', () => {
      const params = {
        id: 'q001',
        level: '4級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 0,
        explanation: '解説',
      };

      expect(() => Question.create(params)).toThrow('Invalid level');
    });

    it('should throw error for empty question text', () => {
      const params = {
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: '',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 0,
        explanation: '解説',
      };

      expect(() => Question.create(params)).toThrow('Question text cannot be empty');
    });

    it('should throw error for invalid options count', () => {
      const params = {
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3'] as any,
        correctAnswerIndex: 0,
        explanation: '解説',
      };

      expect(() => Question.create(params)).toThrow('Options must have exactly 4 choices');
    });

    it('should throw error for correctAnswerIndex out of range', () => {
      const params = {
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 4,
        explanation: '解説',
      };

      expect(() => Question.create(params)).toThrow('Correct answer index must be between 0 and 3');
    });
  });

  describe('isCorrectAnswer', () => {
    it('should return true for correct answer', () => {
      const question = Question.create({
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 2,
        explanation: '解説',
      });

      expect(question.isCorrectAnswer(2)).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      const question = Question.create({
        id: 'q001',
        level: '3級',
        category: '歴史',
        examYear: '2004/12/12',
        questionText: 'テスト問題',
        options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'] as [string, string, string, string],
        correctAnswerIndex: 2,
        explanation: '解説',
      });

      expect(question.isCorrectAnswer(1)).toBe(false);
    });
  });
});
