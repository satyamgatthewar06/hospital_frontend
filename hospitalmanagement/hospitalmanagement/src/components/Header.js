import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import '../components/Header.css';

const Header = () => {
  const authContext = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    authContext.logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>🏥 Hospital Management System</h1>
          <p className="tagline">Efficient Healthcare Management</p>
        </div>
        {authContext.isLoggedIn && (
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{authContext.user?.fullName || authContext.user?.email}</span>
              <span className={`user-role role-${authContext.user?.role?.toLowerCase()}`}>
                {authContext.user?.role}
              </span>
            </div>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <button className="btn-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
