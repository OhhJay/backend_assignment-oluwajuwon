// pages/dashboard.tsx
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link
import Table from '../components/shared/Table'; 
import Layout from '../components/layout'; 

const Dashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Foodco Test</title>
        <link href="/assets/vendor/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
        <link href="/assets/vendor/fontawesome/css/solid.min.css" rel="stylesheet" />
        <link href="/assets/vendor/fontawesome/css/brands.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/css/master.css" rel="stylesheet" />
        <link href="/assets/vendor/flagiconcss/css/flag-icon.min.css" rel="stylesheet" />
      </Head>
      <div className="page-header"> 
        <h2 className="page-title">Dashboard</h2>
        <Link href="/document" className="btn btn-primary m-4">
          Go to Documents
        </Link>
      </div>
      <div className="row">
        <Table />
      </div>
    </Layout>
  );
};

export default Dashboard;
