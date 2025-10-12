import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCountSelector } from '../QuestionCountSelector';

describe('QuestionCountSelector', () => {
  const mockOnBack = jest.fn();
  const mockOnSelectCount = jest.fn();
  const mockLevel = '3級';

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnSelectCount.mockClear();
  });

  it('全ての問題数オプションが表示されること', () => {
    render(
      <QuestionCountSelector
        level={mockLevel}
        onBack={mockOnBack}
        onSelectCount={mockOnSelectCount}
      />
    );

    expect(screen.getByText('10問')).toBeInTheDocument();
    expect(screen.getByText('約5分で完了')).toBeInTheDocument();
    expect(screen.getByText('100問')).toBeInTheDocument();
    expect(screen.getByText('約50分で完了')).toBeInTheDocument();
  });

  it('10問を選択するとonSelectCountが正しく呼ばれること', () => {
    render(
      <QuestionCountSelector
        level={mockLevel}
        onBack={mockOnBack}
        onSelectCount={mockOnSelectCount}
      />
    );

    const button10 = screen.getByText('10問').closest('button');
    fireEvent.click(button10!);

    expect(mockOnSelectCount).toHaveBeenCalledWith(10);
  });

  it('100問を選択するとonSelectCountが正しく呼ばれること', () => {
    render(
      <QuestionCountSelector
        level={mockLevel}
        onBack={mockOnBack}
        onSelectCount={mockOnSelectCount}
      />
    );

    const button100 = screen.getByText('100問').closest('button');
    fireEvent.click(button100!);

    expect(mockOnSelectCount).toHaveBeenCalledWith(100);
  });

  it('戻るボタンをクリックするとonBackが呼ばれること', () => {
    render(
      <QuestionCountSelector
        level={mockLevel}
        onBack={mockOnBack}
        onSelectCount={mockOnSelectCount}
      />
    );

    const backButton = screen.getByText('← 戻る');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('選択された難易度が表示されること', () => {
    render(
      <QuestionCountSelector
        level={mockLevel}
        onBack={mockOnBack}
        onSelectCount={mockOnSelectCount}
      />
    );

    expect(screen.getByText('選択: 3級')).toBeInTheDocument();
  });

  it('画面タイトルが表示されること', () => {
    render(
      <QuestionCountSelector
        level={mockLevel}
        onBack={mockOnBack}
        onSelectCount={mockOnSelectCount}
      />
    );

    expect(screen.getByText('出題数を選択してください')).toBeInTheDocument();
  });
});