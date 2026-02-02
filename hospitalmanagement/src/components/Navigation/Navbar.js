import React from 'react';
import { Link } from 'react-router-dom';
import { HOSPITAL_CONFIG } from '../../config/hospital';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-header">
          <h1 className="hospital-name">
            {HOSPITAL_CONFIG.logo} {HOSPITAL_CONFIG.name}
          </h1>
          <p className="hospital-tagline">{HOSPITAL_CONFIG.tagline}</p>
          <div className="directors-info">
            {HOSPITAL_CONFIG.directors.map((director, index) => (
              <span key={index} className="director-name">
                {director.name}, {director.title}
              </span>
            ))}
          </div>
        </div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/staff">Staff</Link>
          <Link to="/billing">Billing</Link>
          <Link to="/accountant">Accountant</Link>
          <Link to="/info">📚 Info</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;