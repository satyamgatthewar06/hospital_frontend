import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MobileMenu.css';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Doctors', path: '/doctors', icon: '👨‍⚕️' },
    { label: 'Appointments', path: '/appointments', icon: '📅' },
    { label: 'Billing', path: '/billing', icon: '💰' },
    { label: 'Laboratory', path: '/laboratory', icon: '🔬' },
    { label: 'Wards', path: '/wards', icon: '🏥' },
    { label: 'Staff', path: '/staff', icon: '👔' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { label: 'Insurance', path: '/insurance-claims', icon: '📋' },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={isOpen ? 'hamburger open' : 'hamburger'}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && closeMenu()}
        />
      )}

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>
          <button 
            className="close-btn" 
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="mobile-menu-items">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                onClick={closeMenu}
                className="mobile-menu-item"
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-footer">
          <p className="app-version">Hospital Management v1.0</p>
        </div>
      </nav>
    </>
  );
};

export default MobileMenu;
