import React from 'react';
import './Header.css';

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Near%20Ashwini%20Hospital%2C%20Wadiya%20Factory%2C%20Shivaji%20Nagar%2C%20Nanded%2C%20Maharashtra%2C%20431602';

const Header = () => (
  <>
    <div className="top-info" role="banner" aria-label="hospital contact and address">
      <div className="top-info-inner">
        <a
          className="address"
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open hospital location in maps"
        >
          Near Ashwini Hospital, Wadiya Factory, Shivaji Nagar, Nanded, Maharashtra, 431602
        </a>
        <span className="sep">|</span>
        <a className="tel" href="tel:02462247499" aria-label="Call Gadewar's hospital">Tel: 02462247499</a>
      </div>
    </div>

    <header className="site-header fade-in">
      <div className="site-header-inner">
        <h1>Gadewar's Accident & Maternity Hospital</h1>
        <div className="leadership-info">
          <span className="director">Director: Dr. P V Gadewar</span>
          <span className="sep">|</span>
          <span className="co-director">Co-Director: Dr. P P Gadewar</span>
        </div>
        <p className="tagline">Compassionate care · 24/7 Emergency · Expert Maternity Services</p>
      </div>
    </header>
  </>
);

export default Header;