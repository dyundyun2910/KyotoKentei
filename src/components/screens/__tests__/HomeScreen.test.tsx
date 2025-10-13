import { render, screen, fireEvent } from '@testing-library/react';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('クイズ開始ボタンをクリックすると onStart が呼ばれること', () => {
    const mockOnStart = jest.fn();
    const mockOnViewHistory = jest.fn();
    const mockOnViewAdmin = jest.fn();

    render(<HomeScreen onStart={mockOnStart} onViewHistory={mockOnViewHistory} onViewAdmin={mockOnViewAdmin} />);

    const startButton = screen.getByText('解答を始める');
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalled();
  });

  it('過去の成績を見るボタンをクリックすると onViewHistory が呼ばれること', () => {
    const mockOnStart = jest.fn();
    const mockOnViewHistory = jest.fn();
    const mockOnViewAdmin = jest.fn();

    render(<HomeScreen onStart={mockOnStart} onViewHistory={mockOnViewHistory} onViewAdmin={mockOnViewAdmin} />);

    const historyButton = screen.getByText('過去の成績を見る');
    fireEvent.click(historyButton);

    expect(mockOnViewHistory).toHaveBeenCalled();
  });

  it('問題報告を管理ボタンをクリックすると onViewAdmin が呼ばれること', () => {
    const mockOnStart = jest.fn();
    const mockOnViewHistory = jest.fn();
    const mockOnViewAdmin = jest.fn();

    render(<HomeScreen onStart={mockOnStart} onViewHistory={mockOnViewHistory} onViewAdmin={mockOnViewAdmin} />);

    const adminButton = screen.getByText('問題報告を管理');
    fireEvent.click(adminButton);

    expect(mockOnViewAdmin).toHaveBeenCalled();
  });

  it('アプリタイトルが表示されること', () => {
    render(<HomeScreen onStart={() => {}} onViewHistory={() => {}} onViewAdmin={() => {}} />);

    const title = screen.getByText('京都検定対策アプリ');
    expect(title).toBeInTheDocument();
  });

  it('イラストが表示されること', () => {
    render(<HomeScreen onStart={() => {}} onViewHistory={() => {}} onViewAdmin={() => {}} />);

    const illustration = screen.getByText('⛩️');
    expect(illustration).toBeInTheDocument();
  });
});