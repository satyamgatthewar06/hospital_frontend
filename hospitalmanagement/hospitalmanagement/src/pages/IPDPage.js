import React, { useContext } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/IPDPage.css';

const IPDPage = () => {
  const ctx = useContext(HospitalContext) || {};

  // Calculate statistics
  const totalIPDPatients = ctx.patients ? ctx.patients.filter(p => p.type === 'IPD').length : 0;
  const occupiedBeds = ctx.patients ? ctx.patients.filter(p => p.type === 'IPD' && p.status === 'admitted').length : 0;
  const totalBeds = 50; // Total hospital beds
  const emptyBeds = totalBeds - occupiedBeds;
  const dischargedPatients = ctx.patients ? ctx.patients.filter(p => p.type === 'IPD' && p.status === 'discharged').length : 0;

  // Pie chart data for bed status
  const bedStatusData = [
    { name: 'Occupied', value: occupiedBeds, color: '#ef4444' },
    { name: 'Empty', value: emptyBeds, color: '#10b981' }
  ].filter(item => item.value > 0);

  // Pie chart data for patient status
  const patientStatusData = [
    { name: 'Admitted', value: occupiedBeds, color: '#667eea' },
    { name: 'Discharged', value: dischargedPatients, color: '#764ba2' }
  ].filter(item => item.value > 0);

  // Ward-wise occupancy (mock data)
  const wardOccupancyData = [
    { ward: 'General Ward', beds: 12, color: '#667eea' },
    { ward: 'ICU', beds: 8, color: '#ef4444' },
    { ward: 'Pediatrics', beds: 6, color: '#10b981' },
    { ward: 'Orthopedics', beds: 7, color: '#f59e0b' },
    { ward: 'Cardiology', beds: 5, color: '#06b6d4' }
  ];

  // Monthly admission trend
  const monthlyAdmissionData = [
    { month: 'Jan', admissions: 35, discharges: 28 },
    { month: 'Feb', admissions: 42, discharges: 38 },
    { month: 'Mar', admissions: 38, discharges: 35 },
    { month: 'Apr', admissions: 48, discharges: 42 },
    { month: 'May', admissions: 45, discharges: 40 },
    { month: 'Jun', admissions: 52, discharges: 48 }
  ];

  return (
    <div className="ipd-page">
      <div className="page-header">
        <h1>🏨 IPD (In-Patient Department)</h1>
        <p className="page-subtitle">Manage in-patient admissions, bed allocations, and discharge with comprehensive analytics</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-icon">🛏️</div>
          <div className="metric-content">
            <p className="metric-label">Total IPD Patients</p>
            <h2 className="metric-value">{totalIPDPatients}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <p className="metric-label">Occupied Beds</p>
            <h2 className="metric-value">{occupiedBeds}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🆓</div>
          <div className="metric-content">
            <p className="metric-label">Empty Beds</p>
            <h2 className="metric-value">{emptyBeds}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚪</div>
          <div className="metric-content">
            <p className="metric-label">Discharged</p>
            <h2 className="metric-value">{dischargedPatients}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Bed Status Pie Chart */}
        <div className="chart-card">
          <h3>Bed Status Overview</h3>
          {bedStatusData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bedStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bedStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} beds`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-chart">No bed data available</div>
          )}
        </div>

        {/* Patient Status Pie Chart */}
        <div className="chart-card">
          <h3>Patient Status Distribution</h3>
          {patientStatusData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patientStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patientStatusData.map((entry, index) => (
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

      {/* Ward Occupancy Bar Chart */}
      <div className="trend-card">
        <h3>🏥 Ward-wise Bed Occupancy</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wardOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="ward" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value} beds`}
              />
              <Bar dataKey="beds" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Admission Trends */}
      <div className="trend-card">
        <h3>📈 Monthly Admission & Discharge Trends</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAdmissionData}>
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
                dataKey="admissions" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="discharges" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
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
          <button className="action-btn btn-primary">🛏️ Admit Patient</button>
          <button className="action-btn btn-secondary">🚪 Discharge Patient</button>
          <button className="action-btn btn-tertiary">📊 Bed Status</button>
          <button className="action-btn btn-quaternary">⚙️ Settings</button>
        </div>
      </div>
    </div>
  );
};

export default IPDPage;
