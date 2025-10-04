import React from 'react';

interface FeedbackScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  level: string;
  question: {
    category: string;
    text: string;
    options: string[];
  };
  isCorrect: boolean;
  correctIndex: number;
  selectedIndex: number;
  explanation?: string;
  onNext: () => void;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  currentQuestion,
  totalQuestions,
  level,
  question,
  isCorrect,
  correctIndex,
  selectedIndex,
  explanation,
  onNext,
}) => {
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="screen feedback-screen">
      <div className="quiz-header">
        <div className="quiz-progress">
          問題 {currentQuestion}/{totalQuestions}
        </div>
        <div className="quiz-level">{level}</div>
      </div>

      <div className="category-badge">カテゴリ: {question.category}</div>

      <div className="question-text">{question.text}</div>

      <div className="options">
        {question.options.map((option, index) => {
          const isThisCorrect = index === correctIndex;
          const isThisSelected = index === selectedIndex;

          return (
            <div
              key={index}
              className={`option-result ${isThisCorrect ? 'correct' : ''} ${isThisSelected && !isThisCorrect ? 'incorrect' : ''}`}
            >
              <span className="option-label">
                {isThisCorrect && '✓ '}
                {isThisSelected && !isThisCorrect && '✗ '}
                {labels[index]}.
              </span>{' '}
              {option}
              {isThisCorrect && <span className="badge-correct">[正解]</span>}
              {isThisSelected && !isThisCorrect && <span className="badge-selected">[選択]</span>}
            </div>
          );
        })}
      </div>

      <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
        {isCorrect ? '✓ 正解！' : '✗ 不正解'}
      </div>

      {!isCorrect && explanation && (
        <div className="explanation">
          <div className="explanation-title">💡 解説</div>
          <div className="explanation-text">{explanation}</div>
        </div>
      )}

      <button className="btn btn-primary" onClick={onNext}>
        次の問題へ →
      </button>
    </div>
  );
};
