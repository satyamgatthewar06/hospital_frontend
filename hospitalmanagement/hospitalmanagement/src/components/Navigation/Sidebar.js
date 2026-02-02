import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const authContext = useContext(AuthContext);
  const userRole = authContext.user?.role;

  // Define menu items by role
  const getMenuItems = () => {
    const commonItems = [
      { label: 'Dashboard', path: '/', icon: '📊', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'ACCOUNTANT', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN'] },
      { label: 'Patients', path: '/patients', icon: '👥', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
      { label: 'Appointments', path: '/appointments', icon: '📅', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    ];

    const adminItems = [
      { label: 'Admin Dashboard', path: '/admin-dashboard', icon: '⚙️', roles: ['ADMIN'] },
      { label: 'Doctors', path: '/doctors', icon: '🩺', roles: ['ADMIN', 'RECEPTIONIST'] },
      { label: 'Staff', path: '/staff', icon: '👔', roles: ['ADMIN'] },
      { label: 'Auth & Security', path: '/auth', icon: '🔐', roles: ['ADMIN'] },
    ];

    const clinicalItems = [
      { label: 'Receptionist Dashboard', path: '/receptionist-dashboard', icon: '📞', roles: ['RECEPTIONIST'] },
      { label: 'OPD', path: '/opd', icon: '🏥', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
      { label: 'IPD', path: '/ipd', icon: '🛏️', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
      { label: 'Laboratory', path: '/laboratory', icon: '🧪', roles: ['ADMIN', 'LAB_TECHNICIAN', 'DOCTOR'] },
      { label: 'Wards', path: '/wards', icon: '🏢', roles: ['ADMIN', 'NURSE', 'DOCTOR'] },
    ];

    const accountingItems = [
      { label: 'Billing', path: '/billing', icon: '💰', roles: ['ADMIN', 'ACCOUNTANT'] },
      { label: 'Reports', path: '/reports', icon: '📈', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'] },
      { label: 'TPA Management', path: '/tpa', icon: '🤝', roles: ['ADMIN', 'ACCOUNTANT'] },
      { label: 'Enhanced TPA', path: '/enhanced-tpa', icon: '📋', roles: ['ADMIN', 'ACCOUNTANT'] },
    ];

    // Combine all items
    const allItems = [...commonItems, ...adminItems, ...clinicalItems, ...accountingItems];
    
    // Filter items based on user role
    return allItems.filter(item => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="role-icon">
          {userRole === 'ADMIN' && '⚙️'}
          {userRole === 'DOCTOR' && '🩺'}
          {userRole === 'RECEPTIONIST' && '📞'}
          {userRole === 'ACCOUNTANT' && '💼'}
          {userRole === 'NURSE' && '⚕️'}
          {userRole === 'PHARMACIST' && '💊'}
          {userRole === 'LAB_TECHNICIAN' && '🔬'}
        </span>
        {userRole}
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <Link to={item.path} className="menu-link">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
