import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const LINKS = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/admin-dashboard', label: 'Admin Dashboard' },
  { to: '/enhanced-patients', label: 'Patients (Enhanced)' },
  { to: '/patients', label: 'Patients' },
  { to: '/enhanced-appointments', label: 'Appointments (Enhanced)' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/opd', label: 'OPD' },
  { to: '/ipd', label: 'IPD' },
  { to: '/wards', label: 'Wards' },
  { to: '/room-management', label: 'Room Management' },
  { to: '/comprehensive-billing', label: 'Billing (Enhanced)' },
  { to: '/billing', label: 'Billing' },
  { to: '/enhanced-doctors', label: 'Doctors (Enhanced)' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/staff-management', label: 'Staff (Enhanced)' },
  { to: '/staff', label: 'Staff' },
  { to: '/laboratory-module', label: 'Laboratory (Enhanced)' },
  { to: '/laboratory', label: 'Laboratory' },
  { to: '/insurance-policies', label: 'Insurance Policies' },
  { to: '/insurance-claims', label: 'Insurance Claims' },
  { to: '/tpa-management', label: 'TPA (Enhanced)' },
  { to: '/tpa', label: 'TPA' },
  { to: '/admin/login', label: 'Admin' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <button
        className={`hamburger ${open ? 'is-open' : ''}`}
        aria-label="Toggle navigation"
        onClick={() => setOpen(v => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={`sidebar ${open ? 'open' : 'closed'}`} aria-hidden={!open}>
        <div className="sidebar-inner">
          <div className="brand">
            <h2>Gadewar's Hospital</h2>
          </div>

          <nav className="nav">
            {LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                exact={link.exact}
                activeClassName="active"
                className="nav-link"
                onClick={() => {
                  if (window.innerWidth < 1024) setOpen(false);
                }}
              >
                <span className="nav-label">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <small>© {new Date().getFullYear()} Gadewar's</small>
          </div>
        </div>
      </aside>

      {/* overlay for mobile */}
      {open && window.innerWidth < 1024 && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
