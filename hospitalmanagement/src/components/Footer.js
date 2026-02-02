import React from 'react';
import './Footer.css';

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Near%20Ashwini%20Hospital%2C%20Wadiya%20Factory%2C%20Shivaji%20Nagar%2C%20Nanded%2C%20Maharashtra%2C%20431602';

const Footer = () => (
  <footer className="site-footer" role="contentinfo">
    <div className="site-footer-inner">
      <div className="footer-left">
        <h3>Gadewar's Accident & Maternity Hospital</h3>
        <a
          className="footer-address"
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open hospital location in maps"
        >
          <address>
            Near Ashwini Hospital, Wadiya Factory,<br />
            Shivaji Nagar, Nanded, Maharashtra, 431602
          </address>
        </a>
      </div>
      <div className="footer-right">
        <p>Contact</p>
        <a href="tel:02462247499" className="footer-tel" aria-label="Call Gadewar's hospital">Tel: 02462247499</a>
      </div>
    </div>
  </footer>
);

export default Footer;