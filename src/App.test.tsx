import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders admin panel without crashing', () => {
  render(<App />);
  expect(screen.getByText(/skip to content/i)).toBeInTheDocument();
});
