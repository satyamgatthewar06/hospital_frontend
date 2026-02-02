import React, { useContext } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/OPDPage.css';

const OPDPage = () => {
  const ctx = useContext(HospitalContext) || {};

  // Calculate statistics
  const totalOPDPatients = ctx.patients ? ctx.patients.filter(p => p.type === 'OPD').length : 0;
  const totalAppointments = ctx.appointments ? ctx.appointments.length : 0;
  const completedAppointments = ctx.appointments ? ctx.appointments.filter(a => a.status === 'Completed').length : 0;
  const upcomingAppointments = ctx.appointments ? ctx.appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length : 0;

  // Pie chart data for appointment status
  const appointmentStatusData = [
    { name: 'Completed', value: completedAppointments, color: '#10b981' },
    { name: 'Upcoming', value: upcomingAppointments, color: '#3b82f6' },
    { name: 'Cancelled', value: totalAppointments - completedAppointments - upcomingAppointments, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Pie chart data for patient distribution
  const patientDistributionData = [
    { name: 'OPD Patients', value: totalOPDPatients, color: '#667eea' },
    { name: 'IPD Patients', value: ctx.patients ? ctx.patients.filter(p => p.type === 'IPD').length : 0, color: '#764ba2' }
  ].filter(item => item.value > 0);

  // Monthly appointment trend (mock data)
  const monthlyTrendData = [
    { month: 'Jan', appointments: 45 },
    { month: 'Feb', appointments: 52 },
    { month: 'Mar', appointments: 48 },
    { month: 'Apr', appointments: 61 },
    { month: 'May', appointments: 55 },
    { month: 'Jun', appointments: 67 }
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  return (
    <div className="opd-page">
      <div className="page-header">
        <h1>🏥 OPD (Out-Patient Department)</h1>
        <p className="page-subtitle">Manage out-patient consultations and appointments with real-time analytics</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <p className="metric-label">Total OPD Patients</p>
            <h2 className="metric-value">{totalOPDPatients}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <p className="metric-label">Total Appointments</p>
            <h2 className="metric-value">{totalAppointments}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <p className="metric-label">Completed</p>
            <h2 className="metric-value">{completedAppointments}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <p className="metric-label">Upcoming</p>
            <h2 className="metric-value">{upcomingAppointments}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Appointment Status Pie Chart */}
        <div className="chart-card">
          <h3>Appointment Status Distribution</h3>
          {appointmentStatusData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} appointments`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-chart">No appointment data available</div>
          )}
        </div>

        {/* Patient Distribution Pie Chart */}
        <div className="chart-card">
          <h3>Patient Distribution</h3>
          {patientDistributionData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patientDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patientDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} patients`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-chart">No patient data available</div>
          )}
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="trend-card">
        <h3>📈 Monthly Appointment Trends</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn btn-primary">📅 Schedule Appointment</button>
          <button className="action-btn btn-secondary">👥 View Patients</button>
          <button className="action-btn btn-tertiary">📊 View Reports</button>
          <button className="action-btn btn-quaternary">⚙️ Settings</button>
        </div>
      </div>
    </div>
  );
};

export default OPDPage;
