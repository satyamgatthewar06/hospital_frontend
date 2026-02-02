import React from 'react';
import { HOSPITAL_CONFIG } from '../../config/hospital';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  // Google Maps URL for navigation
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(HOSPITAL_CONFIG.address)}`;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">About Hospital</h3>
            <p className="footer-text">
              {HOSPITAL_CONFIG.name} is dedicated to providing excellent healthcare services 
              with state-of-the-art medical facilities and compassionate care.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Information</h3>
            <ul className="footer-list">
              <li><strong>🏥 Hospital:</strong> {HOSPITAL_CONFIG.name}</li>
              
              <li className="address-item">
                <strong>📍 Address:</strong>
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="address-link"
                  title="Open in Google Maps"
                >
                  {HOSPITAL_CONFIG.address}
                </a>
              </li>
              
              <li>
                <strong>📞 Phone:</strong>
                <a 
                  href={`tel:${HOSPITAL_CONFIG.phone.replace(/[^0-9]/g, '')}`}
                  className="contact-link"
                  title="Call hospital"
                >
                  {HOSPITAL_CONFIG.phone}
                </a>
              </li>
              
              <li>
                <strong>📧 Email:</strong>
                <a 
                  href={`mailto:${HOSPITAL_CONFIG.email}`}
                  className="contact-link"
                  title="Send email"
                >
                  {HOSPITAL_CONFIG.email}
                </a>
              </li>
              
              <li><strong>⏰ Hours:</strong> 24/7 Emergency Services</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#departments">Departments</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Directors</h3>
            <ul className="footer-list">
              {HOSPITAL_CONFIG.directors.map((director, index) => (
                <li key={index}>
                  <strong>👨‍⚕️ {director.name}</strong>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#9ca3af' }}>
                    {director.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-links">
              <a href="#facebook" className="social-icon facebook" title="Facebook">f</a>
              <a href="#twitter" className="social-icon twitter" title="Twitter">𝕏</a>
              <a href="#instagram" className="social-icon instagram" title="Instagram">📷</a>
              <a href="#linkedin" className="social-icon linkedin" title="LinkedIn">in</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} {HOSPITAL_CONFIG.name}. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
            <a href="#disclaimer">Medical Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;