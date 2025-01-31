import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {mockNavigation} from '@tests';
import App from './App';

jest.mock('@navigation', () => ({
  __esModule: true,
  default: mockNavigation,
}));

jest.mock('@context', () => ({
  ThemeProvider: ({children}: {children: React.ReactNode}) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('properly wraps content with ThemeProvider', () => {
    render(<App />);
    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toBeInTheDocument();
  });
});
