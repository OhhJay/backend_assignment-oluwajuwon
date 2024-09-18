import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { login } from '@/pages/api/auth';
import { toast } from 'react-toastify';
import Spinner from '../shared/Spinner';

// Mock the login function
jest.mock('@/pages/api/auth', () => ({
  login: jest.fn(),
}));

// Mock the toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows a spinner when loading', async () => {
    (login as jest.Mock).mockResolvedValue({ status: 200, data: { access_token: 'token', user: {} } });
    
    render(<LoginForm />);
    userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // Assumes Spinner has a role="status"
  });

  it('calls login API and handles success', async () => {
    (login as jest.Mock).mockResolvedValue({ status: 200, data: { access_token: 'token', user: {} } });
    
    render(<LoginForm />);
    userEvent.type(screen.getByLabelText(/email
