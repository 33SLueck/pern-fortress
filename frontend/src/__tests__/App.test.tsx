import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders PERN Frontend heading', () => {
    render(<App />);
    expect(screen.getByText('PERN Frontend')).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<App />);
    expect(
      screen.getByText(/Welcome to the PERN stack frontend application!/)
    ).toBeInTheDocument();
  });

  it('renders count button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /Count: 0/ })
    ).toBeInTheDocument();
  });
});
