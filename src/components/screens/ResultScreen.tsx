import React from 'react';

interface CategoryResult {
  category: string;
  correct: number;
  total: number;
  accuracy: number;
}

interface ResultScreenProps {
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  categoryResults: CategoryResult[];
  weakCategories: string[];
  onRetry: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  correctCount,
  totalQuestions,
  accuracy,
  categoryResults,
  weakCategories,
  onRetry,
  onHome,
}) => {
  return (
    <div className="screen result-screen">
      <h2 className="result-title">クイズ終了！</h2>

      <div className="score-card">
        <div className="score-number">
          {correctCount} / {totalQuestions}
        </div>
        <div className="accuracy">正答率 {accuracy}%</div>
      </div>

      <div className="category-results">
        <h3 className="section-title">カテゴリ別正答率</h3>
        {categoryResults.map((result, index) => (
          <div key={index} className="category-result-item">
            <div className="category-result-header">
              <span className="category-name">{result.category}</span>
              <span className="category-accuracy">{result.accuracy}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${result.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {weakCategories.length > 0 && (
        <div className="weak-categories">
          <div className="weak-categories-title">💡 苦手なカテゴリ</div>
          <div className="weak-categories-text">
            「{weakCategories.join('」「')}」を復習しましょう！
          </div>
        </div>
      )}

      <button className="btn btn-primary" onClick={onRetry}>
        もう一度挑戦
      </button>

      <button className="btn btn-secondary" onClick={onHome}>
        ホームに戻る
      </button>
    </div>
  );
};
