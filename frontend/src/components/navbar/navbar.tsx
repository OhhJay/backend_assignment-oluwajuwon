import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { logout } from '@/pages/api/auth';
import { User } from '@/interfaces/user.interface';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Spinner from '../shared/Spinner';
const Navbar: React.FC = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state
  const [user, setUser] = useState< User  | null>(null);

  useEffect(() => {
    // Retrieve the user from localStorage on the client side
    const userJson = localStorage.getItem('user');
    const userData = userJson ? JSON.parse(userJson) : null;
    setUser(userData);
  }, []);

 const  handleLogout = async () => {

  setLoading(true); // Show spinner
  const response = await logout(user!.email)
  if (response.data === true) {
    toast.success('Logged Out', {
      className: 'toast-success',  
    }); 
    router.push('/auth/login');
  } else {
    toast.error('Unable to Logout', {
      className: 'toast-error', 
    });
  }
  setLoading(false);
};

  return (
    
    <nav className={`navbar navbar-expand-lg navbar-light bg-white`}>
      {loading && <Spinner />} {/* Show spinner when loading */}
      <button type="button" id="sidebarCollapse" className={`btn btn-light`}>
        <i className="fas fa-bars"></i>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          {/* <li className="nav-item">
            <Link href="/roles" legacyBehavior>
              <a className="nav-link">
                <i className="fas fa-user-shield"></i> Roles
              </a>
            </Link>
          </li> */}
          {/* <li className="nav-item">
            <Link href="/permissions/permissions" legacyBehavior>
              <a className="nav-link">
                <i className="fas fa-user-shield"></i> Permissions
              </a>
            </Link>
          </li> */}
          <li className="nav-item dropdown">
            <a
              href="#"
              id="navUserDropdown"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user"></i> {user ? `${user.firstname} ${user.lastname}` : 'User'}
              <i className="fas fa-caret-down" style={{ fontSize: '.8em', marginLeft: '5px' }}></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              
              <div className="dropdown-divider"></div>
              <li onClick={handleLogout} className="dropdown-item">
                <Link href="/logout" legacyBehavior>
                  <a className="nav-link">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </a>
                </Link>
              </li>
            </ul>
          </li>
          <li onClick={handleLogout} className="dropdown-item">
                 
                  <a className="btn btn-danger">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </a>
                 
              </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
