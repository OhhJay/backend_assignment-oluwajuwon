// pages/documents.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '@/utils/apiClient';
import { CreateSampleData } from '@/interfaces/document.interface';
import React from 'react';
import Layout from '@/components/layout';
import DocumentsForm from '@/components/documents/DocumentForm';
import DocumentsTable from '@/components/shared/DocumentTable';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<CreateSampleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents function
  const fetchDocuments = async () => {
    try {
      const data = await apiClient('/documents', { method: 'GET' });
      setDocuments(data.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch documents');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Callback to refresh documents
  const refreshDocuments = () => {
    setLoading(true);
    fetchDocuments();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="content">
        <div className="container">
          <div className="page-title">
            <h3>Documents</h3>
          </div>
          <div className="box box-primary">
            <div className="box-body">
              {/* Pass the refreshDocuments callback to DocumentsForm */}
              <DocumentsForm onDocumentAdded={fetchDocuments} />
             
              <DocumentsTable documents={documents} fetchDocuments={fetchDocuments}/>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentsPage;
