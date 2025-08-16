import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';
import { vi } from 'vitest';

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card />);

    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText(/This is the Card component/)).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Title';
    render(<Card title={customTitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childText = 'Custom child content';
    render(
      <Card>
        <p>{childText}</p>
      </Card>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
    expect(
      screen.queryByText(/This is the Card component/)
    ).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Card className={customClass} />);

    const component = screen.getByRole('button');
    expect(component).toHaveClass(customClass);
  });

  it('toggles active state on click', () => {
    render(<Card />);

    const component = screen.getByRole('button');

    // Initially inactive
    expect(screen.getByText(/Status: Inactive/)).toBeInTheDocument();
    expect(screen.getByText(/⭕/)).toBeInTheDocument();

    // Click to activate
    fireEvent.click(component);

    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
    expect(screen.getByText(/✅/)).toBeInTheDocument();
  });

  it('toggles active state on Enter key', () => {
    render(<Card />);

    const component = screen.getByRole('button');

    fireEvent.keyDown(component, { key: 'Enter' });

    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  });

  it('toggles active state on Space key', () => {
    render(<Card />);

    const component = screen.getByRole('button');

    fireEvent.keyDown(component, { key: ' ' });

    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  });

  it('calls onClick handler when provided', () => {
    const mockClick = vi.fn();
    render(<Card onClick={mockClick} />);

    const component = screen.getByRole('button');
    fireEvent.click(component);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
