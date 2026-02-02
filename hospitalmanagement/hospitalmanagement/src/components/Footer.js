import React from 'react';
import '../components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Hospital Management System. All rights reserved.</p>
        <p className="footer-links">
          <a href="/">Home</a> | <a href="#about">About</a> | <a href="#contact">Contact</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
