import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/AdminPanelDashboard.css';

const AdminPanelDashboard = () => {
  const ctx = useContext(HospitalContext) || {};
  const patients = ctx.patients || [];
  const doctors = ctx.doctors || [];
  const appointments = ctx.appointments || [];
  const bills = ctx.bills || [];
  const rooms = ctx.rooms || [];
  const staff = ctx.staff || [];

  const [activeSection, setActiveSection] = useState('overview');

  const dashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const occupiedBeds = rooms?.reduce((sum, r) => sum + (r.status === 'Occupied' ? 1 : 0), 0) || 0;
    const totalBeds = rooms?.length || 0;
    const pendingBills = bills?.filter(b => b.paymentStatus === 'Pending').reduce((sum, b) => sum + (parseInt(b.finalAmount) || 0), 0) || 0;
    const totalRevenue = bills?.reduce((sum, b) => sum + (parseInt(b.finalAmount) || 0), 0) || 0;
    const todayAppointments = appointments?.filter(a => a.appointmentDate === today).length || 0;

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      todayAppointments,
      totalStaff: staff.length,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0,
      totalRevenue,
      pendingBills,
      totalBills: bills.length,
      thisMonthRevenue: bills
        ?.filter(b => b.billDate?.startsWith(new Date().toISOString().split('T')[0].slice(0, 7)))
        .reduce((sum, b) => sum + (parseInt(b.finalAmount) || 0), 0) || 0,
    };
  }, [patients, doctors, appointments, bills, rooms, staff]);

  const recentActivity = useMemo(() => {
    const activity = [];
    
    if (appointments && appointments.length > 0) {
      appointments.slice(-3).forEach(apt => {
        activity.push({
          type: 'appointment',
          text: `Appointment booked: ${apt.patientName} with ${apt.doctorName}`,
          time: apt.appointmentDate,
        });
      });
    }

    if (bills && bills.length > 0) {
      bills.slice(-3).forEach(bill => {
        activity.push({
          type: 'bill',
          text: `Bill generated for ${bill.patientName}: ₹${bill.finalAmount}`,
          time: bill.billDate,
        });
      });
    }

    return activity.slice(-5);
  }, [appointments, bills]);

  return (
    <div className="admin-dashboard fade-in">
      <h1>Admin Panel Dashboard</h1>

      {/* Main Statistics */}
      <div className="stats-section card">
        <h2>Key Metrics</h2>
        <div className="stats-grid-large">
          <div className="stat-card">
            <div className="stat-icon patients">👥</div>
            <div className="stat-content">
              <p className="stat-label">Total Patients</p>
              <p className="stat-value">{dashboardStats.totalPatients}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon doctors">🩺</div>
            <div className="stat-content">
              <p className="stat-label">Total Doctors</p>
              <p className="stat-value">{dashboardStats.totalDoctors}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon appointments">📅</div>
            <div className="stat-content">
              <p className="stat-label">Today's Appointments</p>
              <p className="stat-value">{dashboardStats.todayAppointments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon beds">🛏️</div>
            <div className="stat-content">
              <p className="stat-label">Occupied Beds</p>
              <p className="stat-value">{dashboardStats.occupiedBeds}/{dashboardStats.totalBeds}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-content">
              <p className="stat-label">This Month Revenue</p>
              <p className="stat-value">₹{dashboardStats.thisMonthRevenue}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-content">
              <p className="stat-label">Pending Bills</p>
              <p className="stat-value">₹{dashboardStats.pendingBills}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bed Occupancy */}
      <div className="occupancy-section card">
        <h2>Bed Occupancy Status</h2>
        <div className="occupancy-display">
          <div className="occupancy-bar">
            <div 
              className="occupancy-fill" 
              style={{ width: `${dashboardStats.occupancyRate}%` }}
            >
              {dashboardStats.occupancyRate}%
            </div>
          </div>
          <p>{dashboardStats.occupiedBeds} of {dashboardStats.totalBeds} beds occupied</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="financial-section card">
        <h2>Financial Summary</h2>
        <div className="financial-grid">
          <div className="financial-item">
            <p>Total Revenue</p>
            <p className="amount">₹{dashboardStats.totalRevenue}</p>
          </div>
          <div className="financial-item">
            <p>This Month</p>
            <p className="amount">₹{dashboardStats.thisMonthRevenue}</p>
          </div>
          <div className="financial-item">
            <p>Pending Amount</p>
            <p className="amount pending">₹{dashboardStats.pendingBills}</p>
          </div>
          <div className="financial-item">
            <p>Total Bills</p>
            <p className="amount">{dashboardStats.totalBills}</p>
          </div>
        </div>
      </div>

      {/* Staff Overview */}
      <div className="staff-section card">
        <h2>Staff Overview</h2>
        <p>Total Staff Members: <strong>{dashboardStats.totalStaff}</strong></p>
      </div>

      {/* Recent Activity */}
      <div className="activity-section card">
        <h2>Recent Activity</h2>
        <div className="activity-feed">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <span className={`activity-type ${activity.type}`}>{activity.type}</span>
                <p>{activity.text}</p>
                <small>{activity.time}</small>
              </div>
            ))
          ) : (
            <p className="no-data">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelDashboard;
