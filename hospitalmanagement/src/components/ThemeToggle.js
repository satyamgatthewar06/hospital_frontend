import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`,
          color: theme.colors.text
        }}
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
};

export default ThemeToggle;
