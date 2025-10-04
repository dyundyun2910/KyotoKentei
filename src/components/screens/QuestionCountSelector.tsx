import React from 'react';

export const QuestionCountSelector: React.FC<{
  level: string;
  onBack: () => void;
  onSelectCount: (count: number) => void;
}> = ({ level, onBack, onSelectCount }) => {
  return (
    <div className="screen question-count-selector">
      <button className="btn-back" onClick={onBack}>← 戻る</button>

      <h2 className="screen-title">出題数を選択してください</h2>

      <div className="selected-level">選択: {level}</div>

      <button
        className="btn btn-count"
        onClick={() => onSelectCount(10)}
      >
        <div className="count-number">10問</div>
        <div className="count-description">約5分で完了</div>
      </button>

      <button
        className="btn btn-count"
        onClick={() => onSelectCount(100)}
      >
        <div className="count-number">100問</div>
        <div className="count-description">約50分で完了</div>
      </button>
    </div>
  );
};
