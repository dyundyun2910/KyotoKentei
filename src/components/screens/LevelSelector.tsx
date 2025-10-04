import React from 'react';

export const LevelSelector: React.FC<{
  onBack: () => void;
  onSelectLevel: (level: string) => void;
}> = ({ onBack, onSelectLevel }) => {
  return (
    <div className="screen level-selector">
      <button className="btn-back" onClick={onBack}>← 戻る</button>

      <h2 className="screen-title">難易度を選択してください</h2>

      <button
        className="btn btn-level"
        onClick={() => onSelectLevel('3級')}
      >
        <div className="level-name">3級</div>
        <div className="level-description">初級レベル</div>
      </button>

      <button
        className="btn btn-level"
        onClick={() => onSelectLevel('2級')}
      >
        <div className="level-name">2級</div>
        <div className="level-description">中級レベル</div>
      </button>
    </div>
  );
};
