import { useState } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { LevelSelector } from './components/screens/LevelSelector';
import { QuestionCountSelector } from './components/screens/QuestionCountSelector';
import { QuizScreen } from './components/screens/QuizScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { Container } from './di/Container';
import { QuizStateViewModel, FeedbackViewModel, ResultViewModel } from './presentation/viewModels/QuizViewModel';
import './styles/App.css';

type Screen = 'home' | 'level' | 'count' | 'quiz' | 'feedback' | 'result' | 'history' | 'admin';

const container = Container.getInstance();
const quizController = container.quizController;
const historyRepository = container.quizHistoryRepository;
const questionReportRepository = container.questionReportRepository;

// 統計情報を計算する関数
const calculateStats = (history: any[]) => {
  if (history.length === 0) {
    return {
      totalAttempts: 0,
      averageAccuracy: 0,
      bestCategory: { category: '', accuracy: 0 },
      weakestCategory: { category: '', accuracy: 0 },
    };
  }

  // 平均正答率
  const totalAccuracy = history.reduce((sum, record) => sum + record.accuracy, 0);
  const averageAccuracy = Math.round(totalAccuracy / history.length);

  // カテゴリ別の統計を集計
  const categoryStats: { [key: string]: { correct: number; total: number } } = {};

  history.forEach(record => {
    record.topCategories.forEach((cat: any) => {
      if (!categoryStats[cat.category]) {
        categoryStats[cat.category] = { correct: 0, total: 0 };
      }
      // accuracyから逆算して正解数と総数を推定
      // 実際のデータがあればそちらを使用
      const total = 1; // 簡略化: 各カテゴリ1問として扱う
      const correct = cat.accuracy / 100;
      categoryStats[cat.category].correct += correct;
      categoryStats[cat.category].total += total;
    });
  });

  // 最も得意/苦手なカテゴリを計算
  let bestCategory = { category: '', accuracy: 0 };
  let weakestCategory = { category: '', accuracy: 100 };

  Object.entries(categoryStats).forEach(([category, stats]) => {
    const accuracy = Math.round((stats.correct / stats.total) * 100);
    if (accuracy > bestCategory.accuracy) {
      bestCategory = { category, accuracy };
    }
    if (accuracy < weakestCategory.accuracy && stats.total > 0) {
      weakestCategory = { category, accuracy };
    }
  });

  return {
    totalAttempts: history.length,
    averageAccuracy,
    bestCategory,
    weakestCategory,
  };
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizStateViewModel | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackViewModel | null>(null);
  const [resultState, setResultState] = useState<ResultViewModel | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setCurrentScreen('level');
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
    setCurrentScreen('count');
  };

  const handleSelectCount = async (count: number) => {
    setIsLoading(true);
    try {
      const state = await quizController.startQuiz(selectedLevel, count);
      setQuizState(state);
      setCurrentScreen('quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert('クイズの開始に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    try {
      const feedback = quizController.answerCurrentQuestion(index);
      setFeedbackState(feedback);
      setTimeout(() => {
        setCurrentScreen('feedback');
      }, 500);
    } catch (error) {
      console.error('Failed to answer question:', error);
    }
  };

  const handleNext = async () => {
    const nextState = quizController.moveToNextQuestion();

    if (nextState === null) {
      // Quiz is completed
      setIsLoading(true);
      try {
        const result = await quizController.calculateResult();
        setResultState(result);
        setCurrentScreen('result');
      } catch (error) {
        console.error('Failed to calculate result:', error);
        alert('結果の計算に失敗しました');
      } finally {
        setIsLoading(false);
      }
    } else {
      setQuizState(nextState);
      setFeedbackState(null);
      setCurrentScreen('quiz');
    }
  };

  const handleRetry = () => {
    quizController.reset();
    setQuizState(null);
    setFeedbackState(null);
    setResultState(null);
    setCurrentScreen('level');
  };

  const handleHome = () => {
    quizController.reset();
    setQuizState(null);
    setFeedbackState(null);
    setResultState(null);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (currentScreen === 'level' || currentScreen === 'history' || currentScreen === 'admin') {
      setCurrentScreen('home');
    } else if (currentScreen === 'count') {
      setCurrentScreen('level');
    }
  };

  const handleViewHistory = async () => {
    setIsLoading(true);
    try {
      const historyData = await historyRepository.findAll();
      // DTOデータをHistoryScreen用の形式に変換
      const formattedHistory = (historyData as any[]).map((dto: any) => ({
        date: dto.completedAt,
        level: dto.level,
        totalQuestions: dto.totalQuestions,
        correctAnswers: dto.correctCount,
        accuracy: dto.accuracy,
        topCategories: dto.categoryStatistics.map((stat: any) => ({
          category: stat.category,
          accuracy: stat.accuracy,
        })),
      }));
      setHistory(formattedHistory);
      setCurrentScreen('history');
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('本当に履歴をクリアしますか？')) {
      await historyRepository.clear();
      setHistory([]);
      alert('履歴をクリアしました');
    }
  };

  const handleReportQuestion = async () => {
    try {
      await quizController.reportCurrentQuestion();
    } catch (error) {
      console.error('Failed to report question:', error);
      throw error;
    }
  };

  const handleViewAdmin = async () => {
    setIsLoading(true);
    try {
      const reportsData = await questionReportRepository.findAll();
      // DTOデータをAdminScreen用の形式に変換
      const formattedReports = reportsData.map((report: any) => ({
        questionId: report.questionId.value,
        reportCount: report.reportCount,
        firstReportedAt: report.firstReportedAt.toISOString(),
        lastReportedAt: report.lastReportedAt.toISOString(),
      }));
      setReports(formattedReports);
      setCurrentScreen('admin');
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReports = () => {
    const dataStr = JSON.stringify(reports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `question-reports-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearReports = async () => {
    if (confirm('本当に全ての報告をクリアしますか？')) {
      await questionReportRepository.clear();
      setReports([]);
      alert('報告をクリアしました');
    }
  };

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">読み込み中...</div>
        </div>
      )}

      {currentScreen === 'home' && (
        <HomeScreen onStart={handleStart} onViewHistory={handleViewHistory} onViewAdmin={handleViewAdmin} />
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

      {currentScreen === 'quiz' && quizState && (
        <QuizScreen
          currentQuestion={quizState.currentQuestion}
          totalQuestions={quizState.totalQuestions}
          level={quizState.level}
          question={quizState.question}
          onAnswer={handleAnswer}
          onQuit={handleHome}
        />
      )}

      {currentScreen === 'feedback' && quizState && feedbackState && (
        <FeedbackScreen
          currentQuestion={quizState.currentQuestion}
          totalQuestions={quizState.totalQuestions}
          level={quizState.level}
          question={quizState.question}
          isCorrect={feedbackState.isCorrect}
          correctIndex={feedbackState.correctIndex}
          selectedIndex={feedbackState.selectedIndex}
          explanation={feedbackState.explanation}
          onNext={handleNext}
          onReport={handleReportQuestion}
        />
      )}

      {currentScreen === 'result' && resultState && (
        <ResultScreen
          correctCount={resultState.correctCount}
          totalQuestions={resultState.totalQuestions}
          accuracy={resultState.accuracy}
          categoryResults={resultState.categoryResults}
          weakCategories={resultState.weakCategories}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}

      {currentScreen === 'history' && (
        <HistoryScreen
          history={history}
          stats={calculateStats(history)}
          onBack={handleBack}
          onClearHistory={handleClearHistory}
        />
      )}

      {currentScreen === 'admin' && (
        <AdminScreen
          reports={reports}
          onBack={handleBack}
          onExport={handleExportReports}
          onClearReports={handleClearReports}
        />
      )}
    </div>
  );
}

export default App;
