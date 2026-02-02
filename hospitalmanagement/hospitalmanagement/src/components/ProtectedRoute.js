import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const authContext = useContext(AuthContext);

  if (authContext.loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authContext.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !authContext.hasAnyRole(requiredRoles)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Required roles: {requiredRoles.join(', ')}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
