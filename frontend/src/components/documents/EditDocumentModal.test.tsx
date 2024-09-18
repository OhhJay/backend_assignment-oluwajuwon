import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditDocumentModal from './EditDocumentModal';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'react-toastify';
import Spinner from '../shared/Spinner';

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

// Mock the Spinner component
jest.mock('../shared/Spinner', () => ({
  __esModule: true,
  default: () => <div role="status">Loading...</div>,
}));

describe('EditDocumentModal', () => {
  const mockDocument = {
    id: 1,
    title: 'Test Document',
    content: 'Content',
    description: 'Description',
    sensitiveData: 'Sensitive Data',
  };

  const onClose = jest.fn();
  const onDocumentUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal and fields correctly', () => {
    render(<EditDocumentModal document={mockDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue(mockDocument.title);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockDocument.description);
    expect(screen.getByLabelText(/content/i)).toHaveValue(mockDocument.content);
    expect(screen.getByLabelText(/sensitive data/i)).toHaveValue(mockDocument.sensitiveData);
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('displays spinner while loading', async () => {
    (apiClient as jest.Mock).mockResolvedValue({ status: 200 });

    render(<EditDocumentModal document={mockDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);

    userEvent.clear(screen.getByLabelText(/title/i));
    userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
    
    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByRole('status')).toBeInTheDocument(); // Assumes Spinner has a role="status"
  });

  it('handles successful form submission', async () => {
    (apiClient as jest.Mock).mockResolvedValue({ status: 200 });

    render(<EditDocumentModal document={mockDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);

    userEvent.clear(screen.getByLabelText(/title/i));
    userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
    
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(`/documents/${mockDocument.id}`, expect.any(Object));
      expect(toast.success).toHaveBeenCalledWith('Document updated successfully');
      expect(onDocumentUpdated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    (apiClient as jest.Mock).mockRejectedValue(new Error('Update failed'));

    render(<EditDocumentModal document={mockDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);

    userEvent.clear(screen.getByLabelText(/title/i));
    userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
    
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error updating document');
    });
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<EditDocumentModal document={mockDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('updates formData when document prop changes', () => {
    const { rerender } = render(<EditDocumentModal document={mockDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue(mockDocument.title);

    const newDocument = { ...mockDocument, title: 'New Title' };
    rerender(<EditDocumentModal document={newDocument} onClose={onClose} onDocumentUpdated={onDocumentUpdated} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('New Title');
  });
});
