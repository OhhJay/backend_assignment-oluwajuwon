// components/DocumentsForm.tsx

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/utils/apiClient';
import { CreateSampleData } from '@/interfaces/document.interface';
import Spinner from '../shared/Spinner';
import { toast } from 'react-toastify';
import PermissionWrapper from '../permissions/PermissionWrapper';
import { User } from '@/interfaces/user.interface';
import FileUpload from './FileUpload';

interface DocumentFormProps {
  onDocumentAdded: () => void; 
}

const DocumentsForm: React.FC<DocumentFormProps> = ({ onDocumentAdded }) => {
  const [formData, setFormData] = useState<CreateSampleData>({
    title: '',
    content: '',
    description: '', 
    sensitiveData: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Fetch the user from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user object
    }
  }, []);

  useEffect(() => {
    // Get user ID from localStorage and set it to formData
    const userId = localStorage.getItem('userId');
    const userJson = localStorage.getItem('user');
    const userData = userJson ? JSON.parse(userJson) : null;

    if (userData) {
      setFormData(prevData => ({ ...prevData, uploadedBy: Number(userData.id) }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient('/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (response.status === 201) {
        toast.success('Document Uploaded Successfully');
        onDocumentAdded();
      } else {
        toast.error('Document upload failed.');
      }

      setFormData({ title: '', content: '', description: '', sensitiveData: '' });
      setError(null);
    } catch (err) {
      toast.error('Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {loading && <Spinner />}
      <h1 className="mb-4">Documents Form</h1>
      <div className="row">
        <div className="col-md-6">
          <form className="form mb-4" onSubmit={handleSubmit}>
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
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </form>
          {user && (
            <PermissionWrapper user={user} roles={["Super Admin"]}>
               <FileUpload onSuccess={onDocumentAdded} />
            </PermissionWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsForm;
