import React, { useState } from 'react';
import { useRouter } from 'next/router'; 
import '../../styles/auth.css';  
import '../../styles/toastStyles.css';  
import { login } from '@/pages/api/auth';
import { toast } from 'react-toastify';
import Spinner from '../shared/Spinner'; // Import the Spinner component
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    try {
      const response = await login({ email, password });
        
      localStorage.setItem('token', response.data.access_token);  
      localStorage.setItem('user',  JSON.stringify(response.data) );  
      
      if (response.status === 200) {
        toast.success('Login successful', {
          className: 'toast-success',  
        });
        setTimeout(() => {
          router.push('/dashboard');  
        }, 2000);
      } else {
        toast.error('Login failed. Please check your credentials and try again.', {
          className: 'toast-error', 
        });
      }
    } catch (err) {
      toast.error('Login failed. Please check your credentials and try again.', {
        className: 'toast-error', 
      });
      console.error(err);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="card-body text-center">
      {loading && <Spinner />} {/* Show spinner when loading */}
      <div className="mb-4">
        {/* Optional logo or image */}
      </div>
      <h2 className="mb-4 text-muted">Login to your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 text-start">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary shadow-2 mb-4" type="submit">Login</button>
      </form>
      {/* <p className="mb-2 text-muted">Forgot password? <a href="/forgot-password">Reset</a></p> */}
      {/* <p className="mb-0 text-muted">Don't have an account yet? <a href="/signup">Signup</a></p> */}
    </div>
  );
};

export default LoginForm;
