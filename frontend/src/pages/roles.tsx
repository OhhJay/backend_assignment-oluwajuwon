// pages/roles/index.tsx
import React from 'react';
import RolesTable from '../components/roles/Table';
import Layout from '@/components/layout';

const RolesPage: React.FC = () => {
  return (
    <Layout>
      <div className="page-title">
        <h3>User Roles</h3>
      </div>
      <div className="box box-primary">
        <div className="box-body">
          <RolesTable />
        </div>
      </div>
    </Layout>
  );
};

export default RolesPage;
