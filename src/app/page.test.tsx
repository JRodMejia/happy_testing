import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/helpers/test-utils';
import userEvent from '@testing-library/user-event';
import Home from './page';

describe('HomePage - Component Tests', () => {
  describe('Rendering', () => {
    it('should render home page elements', () => {
      render(<Home />);

      expect(screen.getByTestId('home-heading')).toBeInTheDocument();
      expect(screen.getByTestId('home-heading')).toHaveTextContent('Welcome to NutriApp!');
      expect(screen.getByTestId('home-description')).toBeInTheDocument();
      expect(screen.getByTestId('home-login-button')).toBeInTheDocument();
    });

    it('should display test credentials', () => {
      render(<Home />);

      expect(screen.getByTestId('test-email-value')).toHaveTextContent('test@nutriapp.com');
      expect(screen.getByTestId('test-password-value')).toHaveTextContent('nutriapp123');
    });

    it('should have login link with correct href', () => {
      render(<Home />);

      const loginButton = screen.getByTestId('home-login-button');
      expect(loginButton).toHaveAttribute('href', '/login');
    });
  });

  describe('User Interactions', () => {
    it('should navigate to login on button click', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const loginButton = screen.getByTestId('home-login-button');
      expect(loginButton).toBeVisible();
      expect(loginButton).toHaveAttribute('href', '/login');
    });
  });
});
