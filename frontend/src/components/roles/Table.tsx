// components/Table.tsx

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/utils/apiClient';
import { Role } from '@/interfaces/role.interface';
import { RoleUser } from '../../interfaces/role.interface';

const RolesTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient('/roles', { method: 'GET' });
        console.log(data.status)
        if(data.status ==  200){
            setRoles(data.data);
        }
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch users: ${err}`);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>; // Display loading message while fetching
  if (error) return <p>{error}</p>; // Display error message if fetching fails

  return (
    <div className="col-md-12 col-lg-12">
      <div className="card">
        <div className="card-header">Roles</div>
        <div className="card-body">
          <p className="card-title">Roles list</p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Users</th>
                  <th>Permissions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>
                      {role.users.length > 0 ? (
                        <ul>
                          {role.users.map((user: RoleUser) => (
                            <li key={user.userId}>{user.user.firstname} {user.user.lastname}</li>
                          ))}
                        </ul>
                      ) : (
                        'No users'
                      )}
                    </td>
                    <td>{role.permissionsCount}</td>
                    <td>
                      <a href={`permissions/${role.id}`} className="btn btn-outline-secondary btn-rounded m-1">
                        <i className="fas fa-eye"></i> Permissions
                      </a>
                      <a href={`edit-role/${role.id}`} className="btn btn-outline-info btn-rounded m-1">
                        <i className="fas fa-pen"></i> Edit
                      </a>
                      <button className="btn btn-outline-danger btn-rounded m-1">
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesTable;
