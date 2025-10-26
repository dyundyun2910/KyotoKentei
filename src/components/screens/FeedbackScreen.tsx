import React, { useState } from 'react';

// examYear形式 "YYYY/MM/DD" から年のみを抽出
const formatExamYear = (examYear: string): string => {
  const year = examYear.split('/')[0];
  return `${year}年`;
};

interface FeedbackScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  level: string;
  question: {
    category: string;
    examYear: string;
    text: string;
    options: string[];
  };
  isCorrect: boolean;
  correctIndex: number;
  selectedIndex: number;
  explanation?: string;
  onNext: () => void;
  onReport?: () => Promise<void>;
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
  onReport,
}) => {
  const labels = ['A', 'B', 'C', 'D'];
  const [isReported, setIsReported] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleReport = async () => {
    if (!onReport || isReporting || isReported) return;

    setIsReporting(true);
    try {
      await onReport();
      setIsReported(true);
    } catch (error) {
      console.error('Failed to report question:', error);
      alert('報告に失敗しました');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="screen feedback-screen">
      <div className="feedback-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            問題 {currentQuestion}/{totalQuestions}
          </div>
          <div className="quiz-level">{level}</div>
        </div>

        <div className="category-badge">カテゴリ: {question.category}</div>
        <div className="exam-year">出題年: {formatExamYear(question.examYear)}</div>

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

        <div className={`feedback-text ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? '✓ 正解！' : '✗ 不正解'}
        </div>

        {onReport && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button
              className="btn-report"
              onClick={handleReport}
              disabled={isReporting || isReported}
            >
              {isReported ? '✓ 報告済み' : 'この問題が間違っていることを報告する'}
            </button>
          </div>
        )}

        {!isCorrect && explanation && (
          <div className="explanation">
            <div className="explanation-title">💡 解説</div>
            <div className="explanation-text">{explanation}</div>
          </div>
        )}
      </div>

      <div className="feedback-actions">
        <button className="btn btn-primary btn-next" onClick={onNext}>
          次の問題へ →
        </button>
      </div>
    </div>
  );
};
