import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assuming you will create a CSS file for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className="navbar-title">Hospital Management System</h1>
            <ul className="navbar-links">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/opd">OPD</Link></li>
                <li><Link to="/ipd">IPD</Link></li>
                <li><Link to="/billing">Billing</Link></li>
                <li><Link to="/doctors">Doctors</Link></li>
                <li><Link to="/staff">Staff</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;