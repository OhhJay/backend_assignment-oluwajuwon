// components/Table.tsx

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/utils/apiClient';
import { User } from '@/interfaces/user.interface'; 
import { permission } from 'process';
import { useRouter } from 'next/router';

const Table: React.FC = () => {

  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient('/users', { method: 'GET' });
        console.log(data)
        if(data.status ==  200){
          setUsers(data.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="col-md-12 col-lg-12">
      <div className="card">
        <div className="card-header">User Table</div>
        <div className="card-body">
          <p className="card-title">User list fetched from the API</p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Permissions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <th scope="row">{user.id}</th>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.roles.map(role => (
                        <div key={role.id}>
                          {role.role.name} {role.role.description && `(${role.role.description})`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {user.permissions.map(permission => (
                        <div key={permission.id}>
                          {permission.permission.name} {permission.permission.description && `(${permission.permission.description})`}
                        </div>
                      ))}
                    </td>
                    <td>action</td>
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

export default Table;
