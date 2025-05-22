
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/common/Navbar.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import UpdatePasswordPage from './pages/UpdatePasswordPage.js';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.js';
import AdminUserListPage from './pages/admin/AdminUserListPage.js';
import AdminStoreListPage from './pages/admin/AdminStoreListPage.js';
import AdminAddUserPage from './pages/admin/AdminAddUserPage.js';
import AdminAddStorePage from './pages/admin/AdminAddStorePage.js';
import UserStoreListPage from './pages/user/UserStoreListPage.js';
import StoreOwnerDashboardPage from './pages/store_owner/StoreOwnerDashboardPage.js';
import { UserRole } from './types.js';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage.js';

// Fix: Define ProtectedRouteProps to make allowedRoles and children optional.
interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

// ProtectedRoute component
const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    // Optionally, show a global loading spinner here
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div></div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to a generic dashboard or home page if role not allowed
    // Or an "Access Denied" page
    return <Navigate to="/" replace />; 
  }

  return children ? <>{children}</> : <Outlet />;
};


const AppContent = () => {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          {/* Fix: ProtectedRoute used here will now correctly accept no props (allowedRoles and children are optional) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              currentUser?.role === UserRole.USER ? <UserStoreListPage /> : <Navigate to="/" replace />
            } />

            {/* Admin Routes */}
            {/* Fix: ProtectedRoute used here will now correctly accept only allowedRoles (children is optional) */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUserListPage />} />
              <Route path="users/:userId" element={<AdminUserDetailsPage />} />
              <Route path="users/add" element={<AdminAddUserPage />} />
              <Route path="stores" element={<AdminStoreListPage />} />
              <Route path="stores/add" element={<AdminAddStorePage />} />
            </Route>

            {/* Store Owner Routes */}
            {/* Fix: ProtectedRoute used here will now correctly accept only allowedRoles (children is optional) */}
             <Route path="/store-owner" element={<ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]} />}>
              <Route path="dashboard" element={<StoreOwnerDashboardPage />} />
            </Route>

            {/* Default redirect based on role */}
            <Route path="/" element={
              currentUser ? (
                currentUser.role === UserRole.ADMIN ? <Navigate to="/admin/dashboard" replace /> :
                currentUser.role === UserRole.STORE_OWNER ? <Navigate to="/store-owner/dashboard" replace /> :
                <Navigate to="/dashboard" replace />
              ) : <Navigate to="/login" replace />
            }/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 text-sm">
        © {new Date().getFullYear()} StoreSpark Platform. All rights reserved.
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;