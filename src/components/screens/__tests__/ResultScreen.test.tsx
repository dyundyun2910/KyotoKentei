import { render, screen, fireEvent } from '@testing-library/react';
import { ResultScreen } from '../ResultScreen';

const mockCategoryResults = [
  {
    category: '歴史',
    correct: 8,
    total: 10,
    accuracy: 80,
  },
  {
    category: '寺院',
    correct: 6,
    total: 10,
    accuracy: 60,
  },
];

const mockWeakCategories = ['寺院'];

describe('ResultScreen', () => {
  const defaultProps = {
    correctCount: 14,
    totalQuestions: 20,
    accuracy: 70,
    categoryResults: mockCategoryResults,
    weakCategories: mockWeakCategories,
    onRetry: jest.fn(),
    onHome: jest.fn(),
  };

  it('合計正答数と問題数が表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    expect(screen.getByText('14 / 20')).toBeInTheDocument();
  });

  it('全体の正答率が表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    expect(screen.getByText('正答率 70%')).toBeInTheDocument();
  });

  it('カテゴリ別の結果が表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    mockCategoryResults.forEach(result => {
      expect(screen.getByText(result.category)).toBeInTheDocument();
      expect(screen.getByText(`${result.accuracy}%`)).toBeInTheDocument();
    });
  });

  it('苦手なカテゴリが表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    mockWeakCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('再挑戦ボタンをクリックするとonRetryが呼ばれること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    const retryButton = screen.getByRole('button', { name: 'もう一度挑戦' });
    fireEvent.click(retryButton);
    
    expect(defaultProps.onRetry).toHaveBeenCalled();
  });

  it('ホームボタンをクリックするとonHomeが呼ばれること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    const homeButton = screen.getByRole('button', { name: 'ホームに戻る' });
    fireEvent.click(homeButton);
    
    expect(defaultProps.onHome).toHaveBeenCalled();
  });

  it('クイズ終了のメッセージが表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    expect(screen.getByText('クイズ終了！')).toBeInTheDocument();
  });

  it('カテゴリ別正答率のセクションタイトルが表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    expect(screen.getByText('カテゴリ別正答率')).toBeInTheDocument();
  });

  it('プログレスバーが各カテゴリの正答率に応じて表示されること', () => {
    render(<ResultScreen {...defaultProps} />);
    
    mockCategoryResults.forEach(result => {
      const progressFill = screen.getByText(result.category)
        .closest('.category-result-item')
        ?.querySelector('.progress-fill');
      expect(progressFill).toHaveStyle(`width: ${result.accuracy}%`);
    });
  });
});