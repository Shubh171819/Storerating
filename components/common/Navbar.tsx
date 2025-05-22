
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { UserRole } from '../../types.js';
import { APP_NAME } from '../../constants.js';
import Button from './Button.jsx';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold hover:text-primary-200 transition-colors">
              {APP_NAME}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!currentUser && (
              <>
                <Link to="/login" className="hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
              </>
            )}
            {currentUser && (
              <>
                {currentUser.role === UserRole.ADMIN && (
                  <Link to="/admin/dashboard" className="hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium">Admin Dashboard</Link>
                )}
                {currentUser.role === UserRole.USER && (
                  <Link to="/dashboard" className="hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium">Stores</Link>
                )}
                {currentUser.role === UserRole.STORE_OWNER && (
                  <Link to="/store-owner/dashboard" className="hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium">My Store Dashboard</Link>
                )}
                 <Link to="/update-password" className="hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium">Update Password</Link>
                <Button onClick={handleLogout} variant="secondary" className="text-primary-700 bg-white hover:bg-primary-100">
                  Logout ({currentUser.name.split(' ')[0]})
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;