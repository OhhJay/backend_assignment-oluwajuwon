import RegisterForm from '@/components/auth/RegisterForm';
import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div className="container">
      <h1 className="text-center">Register</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
