import React, { useEffect, useState } from 'react';
import { CreateSampleData } from '@/interfaces/document.interface';
import { User } from '@/interfaces/user.interface';
import PermissionWrapper from '../permissions/PermissionWrapper';
import { toast } from 'react-toastify';
import { deleteDoc } from '@/pages/api/document';
import Spinner from './Spinner';
import EditDocumentModal from '../documents/EditDocumentModal';

interface DocumentsTableProps {
  documents: CreateSampleData[];
  fetchDocuments: any;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ documents, fetchDocuments }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [editingDoc, setEditingDoc] = useState<CreateSampleData | null>(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const deleteDocument = async (id: number) => {
    setLoading(true);
    const response = await deleteDoc(id);
    if (response.status == 204) {
      toast.success('Deleted Successfully', {
        className: 'toast-success',
      });
      fetchDocuments();
    } else {
      toast.error('Unable to Delete', {
        className: 'toast-error',
      });
    }
    setLoading(false);
  };

  const handleEdit = (doc: CreateSampleData) => {
    setEditingDoc(doc);
  };


  const handleCloseModal = () => {
    setEditingDoc(null);
  };

  const handleDocumentUpdated = () => {
    fetchDocuments();
  };

  return (
    <div>
        {loading && <Spinner />}
      {editingDoc && (
        <EditDocumentModal
          document={editingDoc}
          onClose={handleCloseModal}
          onDocumentUpdated={handleDocumentUpdated}
        />
      )}
    <table className="table mt-4">
      {loading && <Spinner />}
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Content</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Uploaded By</th>
          {user && (
            <PermissionWrapper user={user} roles={["Super Admin"]}>
              <th>Sensitive Data</th>
            </PermissionWrapper>
          )}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            <td>{doc.title}</td>
            <td>{doc.description}</td>
            <td>{doc.content}</td>
            <td>{doc.createdAt}</td>
            <td>{doc.updatedAt}</td>
            <td>
              {doc.uploadedBy == null
                ? 'Admin'
                : `${doc.uploadedByUser?.firstname} ${doc.uploadedByUser?.lastname}`}
            </td>
            {user && (
              <PermissionWrapper user={user} roles={["Super Admin"]}>
                <td>{doc.sensitiveData}</td>
              </PermissionWrapper>
            )}
            <td>
              <div>
                <i className="fas fa-pen" style={{ color: 'orange', cursor: 'pointer', marginRight: '10px' }}  onClick={() => handleEdit(doc)}></i>
                <i className="fas fa-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteDocument(doc.id!)}></i>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table></div>
  );
};

export default DocumentsTable;
