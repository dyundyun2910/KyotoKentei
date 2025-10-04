import React from 'react';

interface QuizHistory {
  date: string;
  level: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  topCategories: { category: string; accuracy: number }[];
}

interface CumulativeStats {
  totalAttempts: number;
  averageAccuracy: number;
  bestCategory: { category: string; accuracy: number };
  weakestCategory: { category: string; accuracy: number };
}

interface HistoryScreenProps {
  history: QuizHistory[];
  stats: CumulativeStats;
  onBack: () => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  stats,
  onBack,
  onClearHistory,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="screen history-screen">
      <button className="btn-back" onClick={onBack}>← 戻る</button>

      <h2 className="screen-title">過去の成績</h2>

      {history.length === 0 ? (
        <div className="empty-history">
          <p>まだクイズに挑戦していません</p>
          <p className="empty-history-sub">クイズを始めて成績を記録しましょう</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {history.map((record, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{formatDate(record.date)}</div>

                <div className="history-info">
                  <span className="history-level">{record.level}</span>
                  <span className="history-separator">/</span>
                  <span className="history-questions">{record.totalQuestions}問</span>
                </div>

                <div className="history-score">
                  正答率: <strong>{record.accuracy}%</strong> ({record.correctAnswers}/{record.totalQuestions})
                </div>

                <div className="history-categories">
                  {record.topCategories.slice(0, 3).map((cat, i) => (
                    <span key={i} className="category-chip">
                      {cat.category} {cat.accuracy}%
                    </span>
                  ))}
                  {record.topCategories.length > 3 && (
                    <span className="category-more">...</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="stats-section">
            <h3 className="section-title">累積統計</h3>

            <div className="stats-card">
              <div className="stats-item">
                <div className="stats-label">総挑戦回数</div>
                <div className="stats-value">{stats.totalAttempts}回</div>
              </div>

              <div className="stats-item">
                <div className="stats-label">平均正答率</div>
                <div className="stats-value">{stats.averageAccuracy}%</div>
              </div>

              <div className="stats-divider" />

              <div className="stats-item">
                <div className="stats-label">最も得意</div>
                <div className="stats-value stats-best">
                  {stats.bestCategory.category} ({stats.bestCategory.accuracy}%)
                </div>
              </div>

              <div className="stats-item">
                <div className="stats-label">最も苦手</div>
                <div className="stats-value stats-weak">
                  {stats.weakestCategory.category} ({stats.weakestCategory.accuracy}%)
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-danger" onClick={onClearHistory}>
            履歴をクリア
          </button>
        </>
      )}
    </div>
  );
};
