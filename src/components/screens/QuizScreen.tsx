import React, { useState } from 'react';

interface QuizScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  level: string;
  question: {
    category: string;
    text: string;
    options: string[];
  };
  onAnswer: (index: number) => void;
  onQuit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  currentQuestion,
  totalQuestions,
  level,
  question,
  onAnswer,
  onQuit,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onAnswer(index);
  };

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="screen quiz-screen">
      <div className="quiz-header">
        <button className="btn-back" onClick={onQuit}>← 中断</button>
        <div className="quiz-progress">
          問題 {currentQuestion}/{totalQuestions}
        </div>
        <div className="quiz-level">{level}</div>
      </div>

      <div className="category-badge">カテゴリ: {question.category}</div>

      <div className="question-text">{question.text}</div>

      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`btn btn-option ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleSelect(index)}
            disabled={selectedIndex !== null && selectedIndex !== index}
          >
            <span className="option-label">{labels[index]}.</span> {option}
          </button>
        ))}
      </div>
    </div>
  );
};
