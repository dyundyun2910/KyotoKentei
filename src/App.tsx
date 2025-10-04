import React, { useState } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { LevelSelector } from './components/screens/LevelSelector';
import { QuestionCountSelector } from './components/screens/QuestionCountSelector';
import { QuizScreen } from './components/screens/QuizScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import './styles/App.css';

type Screen = 'home' | 'level' | 'count' | 'quiz' | 'feedback' | 'result' | 'history';

// モックデータ
const mockQuestion = {
  category: '歴史',
  text: '延暦13年(794)、桓武天皇は( )から、平安京に新しい都を遷した。',
  options: ['長岡京', '平城京', '難波京', '藤原京'],
};

const mockCategoryResults = [
  { category: '歴史', correct: 4, total: 5, accuracy: 80 },
  { category: '寺院', correct: 3, total: 5, accuracy: 60 },
  { category: '行事', correct: 5, total: 5, accuracy: 100 },
];

const mockHistory = [
  {
    date: '2024-10-04T15:30:00',
    level: '3級',
    totalQuestions: 10,
    correctAnswers: 7,
    accuracy: 70,
    topCategories: [
      { category: '歴史', accuracy: 80 },
      { category: '寺院', accuracy: 60 },
    ],
  },
  {
    date: '2024-10-03T10:15:00',
    level: '2級',
    totalQuestions: 10,
    correctAnswers: 6,
    accuracy: 60,
    topCategories: [
      { category: '歴史', accuracy: 50 },
      { category: '文化', accuracy: 70 },
    ],
  },
  {
    date: '2024-10-02T19:45:00',
    level: '3級',
    totalQuestions: 100,
    correctAnswers: 85,
    accuracy: 85,
    topCategories: [
      { category: '歴史', accuracy: 90 },
      { category: '寺院', accuracy: 80 },
      { category: '行事', accuracy: 85 },
    ],
  },
];

const mockStats = {
  totalAttempts: 15,
  averageAccuracy: 72,
  bestCategory: { category: '行事', accuracy: 90 },
  weakestCategory: { category: '寺院', accuracy: 55 },
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);

  const handleStart = () => {
    setCurrentScreen('level');
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
    setCurrentScreen('count');
  };

  const handleSelectCount = (count: number) => {
    setSelectedCount(count);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setTimeout(() => {
      setCurrentScreen('feedback');
    }, 500);
  };

  const handleNext = () => {
    // 実際の実装では次の問題へ遷移
    // プロトタイプでは結果画面へ
    setCurrentScreen('result');
  };

  const handleRetry = () => {
    setCurrentScreen('level');
  };

  const handleHome = () => {
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (currentScreen === 'level' || currentScreen === 'history') {
      setCurrentScreen('home');
    } else if (currentScreen === 'count') {
      setCurrentScreen('level');
    }
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  const handleClearHistory = () => {
    if (confirm('本当に履歴をクリアしますか？')) {
      // 実際の実装ではLocalStorageをクリア
      alert('履歴をクリアしました');
    }
  };

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomeScreen onStart={handleStart} onViewHistory={handleViewHistory} />
      )}

      {currentScreen === 'level' && (
        <LevelSelector onBack={handleBack} onSelectLevel={handleSelectLevel} />
      )}

      {currentScreen === 'count' && (
        <QuestionCountSelector
          level={selectedLevel}
          onBack={handleBack}
          onSelectCount={handleSelectCount}
        />
      )}

      {currentScreen === 'quiz' && (
        <QuizScreen
          currentQuestion={1}
          totalQuestions={selectedCount}
          level={selectedLevel}
          question={mockQuestion}
          onAnswer={handleAnswer}
          onQuit={handleHome}
        />
      )}

      {currentScreen === 'feedback' && (
        <FeedbackScreen
          currentQuestion={1}
          totalQuestions={selectedCount}
          level={selectedLevel}
          question={mockQuestion}
          isCorrect={selectedAnswer === 0}
          correctIndex={0}
          selectedIndex={selectedAnswer}
          explanation={
            selectedAnswer !== 0
              ? '桓武天皇は**長岡京**から新しい都の平安京に遷都しました。桓武天皇は三つの都を経験しており、長岡京では藤原種継暗殺事件や早良親王の怨霊の祟りなどの問題があり、平安京への再遷都が行われました。'
              : undefined
          }
          onNext={handleNext}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          correctCount={7}
          totalQuestions={10}
          accuracy={70}
          categoryResults={mockCategoryResults}
          weakCategories={['寺院']}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}

      {currentScreen === 'history' && (
        <HistoryScreen
          history={mockHistory}
          stats={mockStats}
          onBack={handleBack}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
}

export default App;
