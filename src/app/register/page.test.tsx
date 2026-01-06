import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/__tests__/helpers/test-utils';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';
import { mockFetch, mockFetchSuccess, mockFetchError, resetFetchMock } from '@/__tests__/mocks/fetch';
import { mockRouter, resetRouterMock } from '@/__tests__/mocks/next-navigation';
import { mockUsers, generateTestData } from '@/__tests__/fixtures/mock-data';

// Setup mocks
global.fetch = mockFetch;
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('RegisterPage - Component Tests', () => {
  beforeEach(() => {
    resetFetchMock();
    resetRouterMock();
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(<RegisterPage />);

      expect(screen.getByTestId('register-heading')).toHaveTextContent('Crear cuenta');
      expect(screen.getByTestId('firstname-input')).toBeInTheDocument();
      expect(screen.getByTestId('lastname-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-email-input')).toBeInTheDocument();
      expect(screen.getByTestId('nationality-input')).toBeInTheDocument();
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-button')).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<RegisterPage />);

      expect(screen.getByTestId('firstname-input')).toHaveAttribute('required');
      expect(screen.getByTestId('lastname-input')).toHaveAttribute('required');
      expect(screen.getByTestId('register-email-input')).toHaveAttribute('required');
      expect(screen.getByTestId('register-password-input')).toHaveAttribute('required');
    });
  });

  describe('User Interactions', () => {
    it('should update form inputs', async () => {
      const user = userEvent.setup();
      const testUser = generateTestData.user();
      render(<RegisterPage />);

      await user.type(screen.getByTestId('firstname-input'), testUser.firstName);
      await user.type(screen.getByTestId('lastname-input'), testUser.lastName);
      await user.type(screen.getByTestId('register-email-input'), testUser.email);

      expect((screen.getByTestId('firstname-input') as HTMLInputElement).value).toBe(testUser.firstName);
      expect((screen.getByTestId('lastname-input') as HTMLInputElement).value).toBe(testUser.lastName);
      expect((screen.getByTestId('register-email-input') as HTMLInputElement).value).toBe(testUser.email);
    });
  });

  describe('Form Submission', () => {
    it('should submit form and redirect on success', async () => {
      mockFetchSuccess({ message: 'User registered' });
      const user = userEvent.setup();
      const testUser = generateTestData.user();
      render(<RegisterPage />);

      await user.type(screen.getByTestId('firstname-input'), testUser.firstName);
      await user.type(screen.getByTestId('lastname-input'), testUser.lastName);
      await user.type(screen.getByTestId('register-email-input'), testUser.email);
      await user.type(screen.getByTestId('nationality-input'), testUser.nationality);
      await user.type(screen.getByTestId('phone-input'), testUser.phone);
      await user.type(screen.getByTestId('register-password-input'), testUser.password);
      await user.click(screen.getByTestId('register-button'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/register',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    });

    it('should show error when email already exists', async () => {
      mockFetchError({ error: 'Email already exists' }, 400);
      const user = userEvent.setup();
      const testUser = mockUsers.valid;
      render(<RegisterPage />);

      await user.type(screen.getByTestId('firstname-input'), testUser.firstName);
      await user.type(screen.getByTestId('lastname-input'), testUser.lastName);
      await user.type(screen.getByTestId('register-email-input'), testUser.email);
      await user.type(screen.getByTestId('nationality-input'), 'México');
      await user.type(screen.getByTestId('phone-input'), '+52123456789');
      await user.type(screen.getByTestId('register-password-input'), testUser.password);
      await user.click(screen.getByTestId('register-button'));

      await waitFor(() => {
        expect(screen.getByTestId('register-error-message')).toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
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
      const testUser = generateTestData.user();
      render(<RegisterPage />);

      await user.type(screen.getByTestId('firstname-input'), testUser.firstName);
      await user.type(screen.getByTestId('lastname-input'), testUser.lastName);
      await user.type(screen.getByTestId('register-email-input'), testUser.email);
      await user.type(screen.getByTestId('nationality-input'), testUser.nationality);
      await user.type(screen.getByTestId('phone-input'), testUser.phone);
      await user.type(screen.getByTestId('register-password-input'), testUser.password);
      await user.click(screen.getByTestId('register-button'));

      expect(screen.getByTestId('register-button')).toHaveTextContent('Registrando...');
      expect(screen.getByTestId('register-button')).toBeDisabled();
    });
  });
});
