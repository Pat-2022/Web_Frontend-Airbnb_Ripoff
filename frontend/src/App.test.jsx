import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders div', () => {
  render(<App />);
  expect(screen.getByText('Register')).toBeInTheDocument();
});
