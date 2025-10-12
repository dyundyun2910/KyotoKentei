import { render, screen, fireEvent } from '@testing-library/react';
import { QuizScreen } from '../QuizScreen';

const mockQuestion = {
  category: '歴史',
  text: '延暦13年(794)、桓武天皇は長岡京から、どこに都を遷しましたか？',
  options: ['平安京', '平城京', '難波京', '藤原京'],
};

describe('QuizScreen', () => {
  const defaultProps = {
    currentQuestion: 1,
    totalQuestions: 10,
    level: '3級',
    question: mockQuestion,
    onAnswer: jest.fn(),
    onQuit: jest.fn(),
  };

  it('問題番号と総問題数が表示されること', () => {
    render(<QuizScreen {...defaultProps} />);
    
    expect(screen.getByText('問題 1/10')).toBeInTheDocument();
  });

  it('レベルが表示されること', () => {
    render(<QuizScreen {...defaultProps} />);
    
    expect(screen.getByText('3級')).toBeInTheDocument();
  });

  it('カテゴリが表示されること', () => {
    render(<QuizScreen {...defaultProps} />);
    
    expect(screen.getByText('カテゴリ: 歴史')).toBeInTheDocument();
  });

  it('問題文が表示されること', () => {
    render(<QuizScreen {...defaultProps} />);
    
    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
  });

  it('選択肢が表示され、1つだけ選択できること', () => {
    render(<QuizScreen {...defaultProps} />);

    // 選択肢が全て表示されていることを確認
    mockQuestion.options.forEach(option => {
      const button = screen.getByRole('button', { name: new RegExp(option) });
      expect(button).toBeInTheDocument();
    });

    // 最初の選択肢をクリック
    const firstOption = screen.getByRole('button', { name: new RegExp(mockQuestion.options[0]) });
    fireEvent.click(firstOption);
    expect(defaultProps.onAnswer).toHaveBeenCalledWith(0);

    // 2番目の選択肢は無効化されているはずなのでクリックしても新しい呼び出しはない
    const secondOption = screen.getByRole('button', { name: new RegExp(mockQuestion.options[1]) });
    fireEvent.click(secondOption);
    expect(defaultProps.onAnswer).toHaveBeenCalledTimes(1);
  });

  it('中断ボタンをクリックするとonQuitが呼ばれること', () => {
    render(<QuizScreen {...defaultProps} />);
    
    const quitButton = screen.getByText('← 中断');
    fireEvent.click(quitButton);
    
    expect(defaultProps.onQuit).toHaveBeenCalled();
  });

  it('選択肢を選んだ後は他の選択肢が無効になること', () => {
    render(<QuizScreen {...defaultProps} />);
    
    // 最初の選択肢をクリック
    const firstOption = screen.getByText(mockQuestion.options[0]);
    fireEvent.click(firstOption);
    
    // 他の選択肢が無効になっていることを確認
    mockQuestion.options.slice(1).forEach(option => {
      const button = screen.getByText(option);
      expect(button).toBeDisabled();
    });
  });

  it('問題の進行状況が正しく表示されること', () => {
    const props = {
      ...defaultProps,
      currentQuestion: 5,
      totalQuestions: 10,
    };
    
    render(<QuizScreen {...props} />);
    
    expect(screen.getByText('問題 5/10')).toBeInTheDocument();
  });
});