// components/FileUpload.tsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../shared/Spinner';

interface FileUploadProps {
    onSuccess?: () => void; // Add optional onSuccess prop
  }
  
  const FileUpload: React.FC<FileUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Store the file in state
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Show spinner

    try {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        if (onSuccess) onSuccess(); 
        toast.success('File uploaded successfully');
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="csvFile" className="form-label">Upload CSV</label>
        <input
          type="file"
          id="csvFile"
          name="csvFile"
          className="form-control m-2"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button className='btn btn-warning' type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
