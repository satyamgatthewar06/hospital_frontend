import React, { useState } from 'react';
import { Search, Bell, Settings, User, LogOut } from 'lucide-react'; // Added LogOut for cleaner actions
import './Header.css';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleComminSoon = () => {
    alert("Record it says commin soon");
  };

  return (
    <header className="header">
      {/* Search Bar - Updated Structure */}
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search patients, tests, or reports..."
          className="search-input"
        />
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        <button className="icon-btn settings-btn" onClick={handleComminSoon} title="Settings">
          <Settings size={20} />
        </button>

        <div className="notification-wrapper" style={{ position: 'relative' }}>
          <button
            className={`icon-btn notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={handleComminSoon}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="badge-dot" style={{
              position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px',
              backgroundColor: '#F56565', borderRadius: '50%', border: '2px solid white'
            }}></span>
          </button>
          {/* NotificationCenter removed/hidden as per request to just show alert for now on valid click */}
        </div>

        {/* User Profile */}
        <div className="user-profile" onClick={handleComminSoon} title="My Profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Dr. Alfred Strange</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;