import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Activity,
  CreditCard,
  UserCog,
  FileText,
  FileCheck,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  FlaskConical,
  Bed
} from 'lucide-react';
import './Sidebar.css';

const LINKS = [
  { to: '/', label: 'Dashboard', exact: true, icon: LayoutDashboard },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/enhanced-patients', label: 'Patients', icon: Users },
  { to: '/enhanced-doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/opd', label: 'Departments', icon: Activity },
  { to: '/staff-management', label: 'Staff', icon: UserCog },
  { to: '/comprehensive-billing', label: 'Payments', icon: CreditCard },
  { to: '/admin-dashboard', label: 'Admin', icon: ShieldCheck },
  { to: '/laboratory-module', label: 'Laboratory', icon: FlaskConical },
  { to: '/ipd', label: 'IPD', icon: Bed },
  { to: '/special-opd', label: 'Special OPD', icon: Stethoscope },
  { to: '/insurance-policies', label: 'Insurance Policies', icon: FileText },
  { to: '/insurance-claims', label: 'Insurance Claims', icon: FileCheck },
  { to: '/consents', label: 'Consent PDF', icon: FileCheck },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {

  // Auto-collapse on small screens handled in Layout or parent usually, 
  // but we can keep a listener here or just rely on props.
  // For simplicity, we assume parent controls `collapsed`.

  return (
    <>
      <button
        className="mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Navigation"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="logo-icon">
              <Activity size={24} color="white" />
            </div>
            {!collapsed && <h2 className="brand-name">WellNest</h2>}
          </div>

          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                exact={link.exact}
                activeClassName="active"
                className="nav-item"
                onClick={() => setMobileOpen(false)}
              >
                <div className="nav-icon">
                  <Icon size={20} />
                </div>
                {!collapsed && <span className="nav-label">{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
