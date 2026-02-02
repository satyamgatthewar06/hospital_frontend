import React, { useMemo, useContext } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { HospitalContext } from '../context/HospitalContext';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const { patients, bills, appointments, labTests, wards } = useContext(HospitalContext);
  const { theme } = useContext(ThemeContext);

  // Revenue Analytics
  const revenueData = useMemo(() => {
    const monthlyRevenue = {};
    (bills || []).forEach(bill => {
      const date = new Date(bill.billDate);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (bill.finalAmount || 0);
    });
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue)
    }));
  }, [bills]);

  // Appointment Analytics
  const appointmentStats = useMemo(() => {
    const stats = {
      completed: 0,
      pending: 0,
      cancelled: 0
    };
    (appointments || []).forEach(apt => {
      const status = apt.status?.toLowerCase() || 'pending';
      if (status in stats) {
        stats[status]++;
      }
    });
    return Object.entries(stats).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      fill: status === 'completed' ? '#4CAF50' : status === 'pending' ? '#ff9800' : '#f44336'
    }));
  }, [appointments]);

  // Patient Demographics
  const genderDistribution = useMemo(() => {
    const dist = { Male: 0, Female: 0, Other: 0 };
    (patients || []).forEach(p => {
      const gender = p.gender || 'Other';
      dist[gender] = (dist[gender] || 0) + 1;
    });
    return Object.entries(dist).map(([gender, count]) => ({
      name: gender,
      value: count
    }));
  }, [patients]);

  // Department Load
  const departmentLoad = useMemo(() => {
    const load = {};
    (appointments || []).forEach(apt => {
      const dept = apt.department || 'General';
      load[dept] = (load[dept] || 0) + 1;
    });
    return Object.entries(load).map(([dept, count]) => ({
      department: dept,
      appointments: count
    }));
  }, [appointments]);

  // Room Occupancy
  const roomOccupancy = useMemo(() => {
    const total = (wards || []).reduce((sum, w) => sum + (w.capacity || 0), 0);
    const occupied = (wards || []).reduce((sum, w) => sum + (w.currentOccupancy || 0), 0);
    return [
      { name: 'Occupied', value: occupied },
      { name: 'Available', value: total - occupied }
    ];
  }, [wards]);

  // Lab Test Trends
  const labTrends = useMemo(() => {
    const trends = {};
    (labTests || []).forEach(test => {
      const status = test.status || 'Pending';
      trends[status] = (trends[status] || 0) + 1;
    });
    return Object.entries(trends).map(([status, count]) => ({
      status,
      count
    }));
  }, [labTests]);

  // Key Metrics
  const metrics = useMemo(() => {
    return {
      totalPatients: patients?.length || 0,
      totalAppointments: appointments?.length || 0,
      totalRevenue: (bills || []).reduce((sum, b) => sum + (b.finalAmount || 0), 0),
      pendingBills: (bills || []).filter(b => b.paymentStatus === 'Pending').length,
      completedAppointments: (appointments || []).filter(a => a.status === 'Completed').length,
      bedOccupancy: ((wards || []).reduce((sum, w) => sum + (w.currentOccupancy || 0), 0) / 
                     ((wards || []).reduce((sum, w) => sum + (w.capacity || 0), 1) || 1) * 100).toFixed(2)
    };
  }, [patients, appointments, bills, wards]);

  const chartColors = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error
  };

  return (
    <div className="analytics-dashboard fade-in" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <h1>📊 Hospital Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card" style={{ borderLeft: `4px solid ${chartColors.primary}` }}>
          <h3>Total Patients</h3>
          <p className="metric-value">{metrics.totalPatients}</p>
        </div>
        <div className="metric-card" style={{ borderLeft: `4px solid ${chartColors.success}` }}>
          <h3>Completed Appointments</h3>
          <p className="metric-value">{metrics.completedAppointments}</p>
        </div>
        <div className="metric-card" style={{ borderLeft: `4px solid ${chartColors.warning}` }}>
          <h3>Total Revenue</h3>
          <p className="metric-value">₹{(metrics.totalRevenue / 100000).toFixed(1)}L</p>
        </div>
        <div className="metric-card" style={{ borderLeft: `4px solid ${chartColors.error}` }}>
          <h3>Pending Bills</h3>
          <p className="metric-value">{metrics.pendingBills}</p>
        </div>
        <div className="metric-card" style={{ borderLeft: `4px solid #00BCD4` }}>
          <h3>Bed Occupancy</h3>
          <p className="metric-value">{metrics.bedOccupancy}%</p>
        </div>
        <div className="metric-card" style={{ borderLeft: `4px solid #9C27B0` }}>
          <h3>Total Appointments</h3>
          <p className="metric-value">{metrics.totalAppointments}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-container">
          <h3>📈 Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis stroke={theme.colors.textSecondary} />
              <YAxis stroke={theme.colors.textSecondary} />
              <Tooltip contentStyle={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2} dot={{ fill: chartColors.primary }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Status Chart */}
        <div className="chart-container">
          <h3>📅 Appointment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {appointmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Load Chart */}
        <div className="chart-container">
          <h3>🏥 Department Appointment Load</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} stroke={theme.colors.textSecondary} />
              <YAxis stroke={theme.colors.textSecondary} />
              <Tooltip contentStyle={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} />
              <Bar dataKey="appointments" fill={chartColors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Gender Distribution */}
        <div className="chart-container">
          <h3>👥 Patient Demographics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#2196F3" />
                <Cell fill="#E91E63" />
                <Cell fill="#9C27B0" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Room Occupancy */}
        <div className="chart-container">
          <h3>🛏️ Room Occupancy Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomOccupancy}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill={chartColors.error} />
                <Cell fill={chartColors.success} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lab Test Status */}
        <div className="chart-container">
          <h3>🔬 Lab Test Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={labTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis dataKey="status" stroke={theme.colors.textSecondary} />
              <YAxis stroke={theme.colors.textSecondary} />
              <Tooltip contentStyle={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} />
              <Bar dataKey="count" fill={chartColors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
