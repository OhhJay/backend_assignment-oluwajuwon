// components/Layout.tsx
import React from 'react';
import Navbar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import Head from 'next/head';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Foodco App</title>
        <link href="/assets/vendor/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
        <link href="/assets/vendor/fontawesome/css/solid.min.css" rel="stylesheet" />
        <link href="/assets/vendor/fontawesome/css/brands.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/css/master.css" rel="stylesheet" />
        <link href="/assets/vendor/flagiconcss/css/flag-icon.min.css" rel="stylesheet" />
      </Head>
      <div className="wrapper">
     
        <div id="body" className="active">
          <Navbar />
          <div className="content">
            <div className="container">
              {children}
            </div>
          </div>
        </div>
      </div>
      <script src="/assets/vendor/jquery/jquery.min.js"></script>
      <script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/script.js"></script>
    </>
  );
};

export default Layout;
