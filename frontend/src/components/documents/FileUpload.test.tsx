import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';
import { toast } from 'react-toastify';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the Spinner component
jest.mock('../shared/Spinner', () => ({
  __esModule: true,
  default: () => <div role="status">Loading...</div>,
}));

describe('FileUpload', () => {
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file upload form correctly', () => {
    render(<FileUpload onSuccess={onSuccess} />);

    expect(screen.getByLabelText(/upload csv/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('handles file selection and submission correctly', async () => {
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    const mockResponse = { ok: true };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<FileUpload onSuccess={onSuccess} />);

    userEvent.upload(screen.getByLabelText(/upload csv/i), mockFile);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        })
      );
      expect(toast.success).toHaveBeenCalledWith('File uploaded successfully');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('displays an error when no file is selected', async () => {
    render(<FileUpload onSuccess={onSuccess} />);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select a file');
    });
  });

  it('handles file upload error correctly', async () => {
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    const mockResponse = { ok: false, json: () => Promise.resolve({ error: 'Upload failed' }) };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<FileUpload onSuccess={onSuccess} />);

    userEvent.upload(screen.getByLabelText(/upload csv/i), mockFile);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error: Upload failed');
    });
  });

  it('shows spinner while loading', async () => {
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });

    (global.fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 1000)));

    render(<FileUpload onSuccess={onSuccess} />);

    userEvent.upload(screen.getByLabelText(/upload csv/i), mockFile);

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByRole('status')).toBeInTheDocument(); // Assumes Spinner has a role="status"
  });
});
