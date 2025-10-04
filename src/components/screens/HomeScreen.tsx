import React from 'react';

export const HomeScreen: React.FC<{
  onStart: () => void;
  onViewHistory: () => void;
}> = ({ onStart, onViewHistory }) => {
  return (
    <div className="screen home-screen">
      <h1 className="app-title">京都検定対策アプリ</h1>

      <div className="illustration">
        {/* 京都のイラスト placeholder */}
        <div className="illustration-placeholder">🏯</div>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        解答を始める
      </button>

      <button className="btn btn-secondary" onClick={onViewHistory}>
        過去の成績を見る
      </button>
    </div>
  );
};
