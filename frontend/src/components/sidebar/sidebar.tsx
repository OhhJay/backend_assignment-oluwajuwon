import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <nav id="sidebar" className="active">
      <div className="sidebar-header">
        <h1>Foodco Test</h1>
      </div>
      <ul className="list-unstyled components text-secondary">
        <li>
          <a
            href="#authmenu"
            data-bs-toggle="collapse"
            aria-expanded="false"
            className="dropdown-toggle no-caret-down"
          >
            <i className="fas fa-user-shield"></i> Authentication
          </a>
          <ul className="collapse list-unstyled" id="authmenu">
          
          </ul>
        </li>
        <li>
          <Link href="/users" legacyBehavior>
            <a>
              <i className="fas fa-user-friends"></i> Users
            </a>
          </Link>
        </li>
        <li>
              <Link href="/roles" legacyBehavior>
                <a className="dropdown-item">
                  <i className="fas fa-user-shield"></i> Roles
                </a>
              </Link>
            </li>
            <li>
              <Link href="/permissions/permissions" legacyBehavior>
                <a className="dropdown-item">
                  <i className="fas fa-user-shield"></i> Permissions
                </a>
              </Link>
            </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
