import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentsForm from './DocumentsForm';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'react-toastify';
import Spinner from '../shared/Spinner';
import FileUpload from './FileUpload';
import PermissionWrapper from '../permissions/PermissionWrapper';

// Mock the apiClient function
jest.mock('@/utils/apiClient', () => ({
  apiClient: jest.fn(),
}));

// Mock the toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the FileUpload component
jest.mock('./FileUpload', () => ({
  __esModule: true,
  default: jest.fn(() => <div>FileUpload Component</div>),
}));

// Mock the PermissionWrapper component
jest.mock('../permissions/PermissionWrapper', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('DocumentsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  it('renders the form and fields correctly', () => {
    render(<DocumentsForm onDocumentAdded={jest.fn()} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sensitive data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('displays spinner while loading', async () => {
    (apiClient as jest.Mock).mockResolvedValue({ status: 201 });

    render(<DocumentsForm onDocumentAdded={jest.fn()} />);

    userEvent.type(screen.getByLabelText(/title/i), 'Sample Title');
    userEvent.type(screen.getByLabelText(/content/i), 'Sample Content');
    
    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByRole('status')).toBeInTheDocument(); // Assumes Spinner has a role="status"
  });

  it('handles successful form submission', async () => {
    (apiClient as jest.Mock).mockResolvedValue({ status: 201 });

    render(<DocumentsForm onDocumentAdded={jest.fn()} />);
    
    userEvent.type(screen.getByLabelText(/title/i), 'Sample Title');
    userEvent.type(screen.getByLabelText(/content/i), 'Sample Content');
    
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/documents', expect.any(Object));
      expect(toast.success).toHaveBeenCalledWith('Document Uploaded Successfully');
    });
  });

  it('handles form submission error', async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error('Submission failed'));

    render(<DocumentsForm onDocumentAdded={jest.fn()} />);
    
    userEvent.type(screen.getByLabelText(/title/i), 'Sample Title');
    userEvent.type(screen.getByLabelText(/content/i), 'Sample Content');
    
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit form.');
    });
  });

  it('fetches user from localStorage and updates formData', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    render(<DocumentsForm onDocumentAdded={jest.fn()} />);
    
    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText('FileUpload Component')).toBeInTheDocument();
      });
    });
  });

  it('conditionally renders FileUpload component based on user permissions', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    
    render(<DocumentsForm onDocumentAdded={jest.fn()} />);
    
    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText('FileUpload Component')).toBeInTheDocument();
      });
    });
  });
});
