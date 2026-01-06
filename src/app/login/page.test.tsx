import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/__tests__/helpers/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { mockFetch, mockFetchSuccess, mockFetchError, resetFetchMock } from '@/__tests__/mocks/fetch';
import { mockRouter, resetRouterMock } from '@/__tests__/mocks/next-navigation';
import { mockUsers, mockApiResponses } from '@/__tests__/fixtures/mock-data';

// Setup mocks
global.fetch = mockFetch;
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('LoginPage - Component Tests', () => {
  beforeEach(() => {
    resetFetchMock();
    resetRouterMock();
  });

  describe('Rendering', () => {
    it('should render all form elements', () => {
      render(<LoginPage />);

      expect(screen.getByTestId('nutriapp-title')).toBeInTheDocument();
      expect(screen.getByTestId('login-heading')).toHaveTextContent('Bienvenido');
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('register-link')).toBeInTheDocument();
    });

    it('should have correct input attributes', () => {
      render(<LoginPage />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
    });
  });

  describe('User Interactions', () => {
    it('should update form inputs', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

      await user.type(emailInput, mockUsers.valid.email);
      await user.type(passwordInput, mockUsers.valid.password);

      expect(emailInput.value).toBe(mockUsers.valid.email);
      expect(passwordInput.value).toBe(mockUsers.valid.password);
    });
  });

  describe('Form Submission', () => {
    it('should submit form and redirect on success', async () => {
      mockFetchSuccess({ message: 'Login successful' });
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByTestId('email-input'), mockUsers.valid.email);
      await user.type(screen.getByTestId('password-input'), mockUsers.valid.password);
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/login',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              email: mockUsers.valid.email,
              password: mockUsers.valid.password,
            }),
          })
        );
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dishes');
      });
    });

    it('should show error on failed login', async () => {
      mockFetchError({ error: 'Credenciales incorrectas' }, 401);
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByTestId('email-input'), mockUsers.invalidCredentials.email);
      await user.type(screen.getByTestId('password-input'), mockUsers.invalidCredentials.password);
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Credenciales incorrectas');
      });
    });

    it('should show loading state', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ message: 'Success' }),
                }),
              100
            )
          )
      );

      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByTestId('email-input'), mockUsers.valid.email);
      await user.type(screen.getByTestId('password-input'), mockUsers.valid.password);
      await user.click(screen.getByTestId('login-button'));

      expect(screen.getByTestId('login-button')).toHaveTextContent('Ingresando...');
      expect(screen.getByTestId('login-button')).toBeDisabled();
    });
  });
});
