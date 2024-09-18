import React from 'react';
import LoginForm from '../../components/auth/LoginForm';  
import '../../styles/auth.css';  
const LoginPage: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="auth-content">
        <LoginForm /> {}
      </div>
    </div>
  );
};

export default LoginPage;
