import React, { useContext } from 'react';
import { HospitalContext } from '../context/HospitalContext';

function RoleGuard({ allowed = [], children, fallback = null }) {
  const { currentUser } = useContext(HospitalContext);

  if (!currentUser) return fallback || <div className="info-message">Access denied. Please login.</div>;
  if (allowed.length === 0) return children;
  if (allowed.includes(currentUser.role)) return children;
  return fallback || <div className="info-message">You do not have permission to view this section.</div>;
}

export default RoleGuard;
