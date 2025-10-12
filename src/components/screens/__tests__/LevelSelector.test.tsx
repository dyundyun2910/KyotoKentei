import { render, screen, fireEvent } from '@testing-library/react';
import { LevelSelector } from '../LevelSelector';

describe('LevelSelector', () => {
  const mockOnBack = jest.fn();
  const mockOnSelectLevel = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnSelectLevel.mockClear();
  });

  it('両方のレベルボタンが表示されること', () => {
    render(<LevelSelector onBack={mockOnBack} onSelectLevel={mockOnSelectLevel} />);

    expect(screen.getByText('3級')).toBeInTheDocument();
    expect(screen.getByText('初級レベル')).toBeInTheDocument();
    expect(screen.getByText('2級')).toBeInTheDocument();
    expect(screen.getByText('中級レベル')).toBeInTheDocument();
  });

  it('3級を選択するとonSelectLevelが呼ばれること', () => {
    render(<LevelSelector onBack={mockOnBack} onSelectLevel={mockOnSelectLevel} />);

    const level3Button = screen.getByText('3級').closest('button');
    fireEvent.click(level3Button!);

    expect(mockOnSelectLevel).toHaveBeenCalledWith('3級');
  });

  it('2級を選択するとonSelectLevelが呼ばれること', () => {
    render(<LevelSelector onBack={mockOnBack} onSelectLevel={mockOnSelectLevel} />);

    const level2Button = screen.getByText('2級').closest('button');
    fireEvent.click(level2Button!);

    expect(mockOnSelectLevel).toHaveBeenCalledWith('2級');
  });

  it('戻るボタンをクリックするとonBackが呼ばれること', () => {
    render(<LevelSelector onBack={mockOnBack} onSelectLevel={mockOnSelectLevel} />);

    const backButton = screen.getByText('← 戻る');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('画面タイトルが表示されること', () => {
    render(<LevelSelector onBack={mockOnBack} onSelectLevel={mockOnSelectLevel} />);

    expect(screen.getByText('難易度を選択してください')).toBeInTheDocument();
  });
});