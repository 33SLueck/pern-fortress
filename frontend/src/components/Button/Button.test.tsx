import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';
import { vi } from 'vitest';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button />);

    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(
      screen.getByText(/This is the Button component/)
    ).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Title';
    render(<Button title={customTitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childText = 'Custom child content';
    render(
      <Button>
        <p>{childText}</p>
      </Button>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
    expect(
      screen.queryByText(/This is the Button component/)
    ).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Button className={customClass} />);

    const component = screen.getByRole('button');
    expect(component).toHaveClass(customClass);
  });

  it('toggles active state on click', () => {
    render(<Button />);

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
    render(<Button />);

    const component = screen.getByRole('button');

    fireEvent.keyDown(component, { key: 'Enter' });

    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  });

  it('toggles active state on Space key', () => {
    render(<Button />);

    const component = screen.getByRole('button');

    fireEvent.keyDown(component, { key: ' ' });

    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  });

  it('calls onClick handler when provided', () => {
    const mockClick = vi.fn();
    render(<Button onClick={mockClick} />);

    const component = screen.getByRole('button');
    fireEvent.click(component);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
