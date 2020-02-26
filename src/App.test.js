import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  const { getByTestId } = render(<App />);
  const articles = getByTestId('articles-container');
  expect(articles).toBeInTheDocument();
});
