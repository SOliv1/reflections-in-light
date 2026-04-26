// 1. Mock FIRST — before imports
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <div>{children}</div>
}));

// 2. Then imports
import { render, screen } from '@testing-library/react';
import App from './App';

// 3. Then your test
test('renders app without crashing', () => {
  render(<App />);
  expect(screen.getByText(/reflections/i)).toBeInTheDocument();
});
