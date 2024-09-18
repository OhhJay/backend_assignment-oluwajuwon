// components/EditDocumentModal.tsx

import React, { useState, useEffect } from 'react';
import { CreateSampleData } from '@/interfaces/document.interface';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'react-toastify';
import Spinner from '../shared/Spinner';
 

interface EditDocumentModalProps {
  document: CreateSampleData;
  onClose: () => void;
  onDocumentUpdated: () => void;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ document, onClose, onDocumentUpdated }) => {
  const [formData, setFormData] = useState<CreateSampleData>(document);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(document);
  }, [document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient(`/documents/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        toast.success('Document updated successfully');
        onDocumentUpdated(); // Refresh the document list
        onClose(); // Close the modal
      } else {
        toast.error('Failed to update document');
      }
    } catch (error) {
      toast.error('Error updating document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay ">
      <div className="modal-content modal-home">
        <h2>Edit Document</h2>
        {loading && <Spinner />}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sensitiveData" className="form-label">Sensitive Data</label>
            <input
              type="text"
              id="sensitiveData"
              name="sensitiveData"
              className="form-control"
              value={formData.sensitiveData || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentModal;
