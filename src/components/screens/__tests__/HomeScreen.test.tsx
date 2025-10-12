import { render, screen, fireEvent } from '@testing-library/react';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('クイズ開始ボタンをクリックすると onStart が呼ばれること', () => {
    const mockOnStart = jest.fn();
    const mockOnViewHistory = jest.fn();

    render(<HomeScreen onStart={mockOnStart} onViewHistory={mockOnViewHistory} />);

    const startButton = screen.getByText('解答を始める');
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalled();
  });

  it('過去の成績を見るボタンをクリックすると onViewHistory が呼ばれること', () => {
    const mockOnStart = jest.fn();
    const mockOnViewHistory = jest.fn();

    render(<HomeScreen onStart={mockOnStart} onViewHistory={mockOnViewHistory} />);

    const historyButton = screen.getByText('過去の成績を見る');
    fireEvent.click(historyButton);

    expect(mockOnViewHistory).toHaveBeenCalled();
  });

  it('アプリタイトルが表示されること', () => {
    render(<HomeScreen onStart={() => {}} onViewHistory={() => {}} />);

    const title = screen.getByText('京都検定対策アプリ');
    expect(title).toBeInTheDocument();
  });

  it('イラストが表示されること', () => {
    render(<HomeScreen onStart={() => {}} onViewHistory={() => {}} />);

    const illustration = screen.getByText('⛩️');
    expect(illustration).toBeInTheDocument();
  });
});