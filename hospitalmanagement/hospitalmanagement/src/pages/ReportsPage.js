import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import '../styles/ReportsPage.css';

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    billStatusBreakdown: [],
    appointmentStatusTrends: [],
    doctorPerformance: [],
    patientAgeDistribution: [],
    billingTrendsByDepartment: [],
  });

  const [dateRange, setDateRange] = useState('lastMonth');

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = () => {
    try {
      const bills = JSON.parse(localStorage.getItem('hms_bills_v1') || '[]');
      const appointments = JSON.parse(localStorage.getItem('hms_appointments_v1') || '[]');
      const patients = JSON.parse(localStorage.getItem('hms_patients_v1') || '[]');
      const doctors = JSON.parse(localStorage.getItem('hms_doctors_v1') || '[]');

      // Bill Status Breakdown
      const billStatusMap = {};
      bills.forEach(bill => {
        const status = bill.status || 'pending';
        billStatusMap[status] = (billStatusMap[status] || 0) + 1;
      });

      const billStatusBreakdown = Object.keys(billStatusMap).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: billStatusMap[status],
      }));

      // Appointment Status Trends
      const appointmentStatusMap = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      appointments.forEach(apt => {
        const date = new Date(apt.date || apt.appointmentDate || new Date());
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const status = apt.status || 'scheduled';

        if (!appointmentStatusMap[status]) {
          appointmentStatusMap[status] = {};
        }
        if (!appointmentStatusMap[status][monthName]) {
          appointmentStatusMap[status][monthName] = 0;
        }
        appointmentStatusMap[status][monthName]++;
      });

      const appointmentStatusTrends = months.map(month => {
        const data = { name: month };
        Object.keys(appointmentStatusMap).forEach(status => {
          data[status] = appointmentStatusMap[status][month] || 0;
        });
        return data;
      });

      // Doctor Performance
      const doctorPerformanceMap = {};
      appointments.forEach(apt => {
        const doctorName = apt.doctorName || 'Unknown';
        if (!doctorPerformanceMap[doctorName]) {
          doctorPerformanceMap[doctorName] = { appointments: 0, completed: 0 };
        }
        doctorPerformanceMap[doctorName].appointments++;
        if (apt.status === 'completed' || apt.status === 'finished') {
          doctorPerformanceMap[doctorName].completed++;
        }
      });

      const doctorPerformance = Object.keys(doctorPerformanceMap)
        .map(doctor => ({
          name: doctor,
          appointments: doctorPerformanceMap[doctor].appointments,
          completed: doctorPerformanceMap[doctor].completed,
        }))
        .sort((a, b) => b.appointments - a.appointments)
        .slice(0, 10);

      // Patient Age Distribution
      const ageGroupMap = {};
      patients.forEach(patient => {
        const age = patient.age || Math.floor(Math.random() * 80);
        const ageGroup = Math.floor(age / 10) * 10 + '-' + (Math.floor(age / 10) * 10 + 9);
        ageGroupMap[ageGroup] = (ageGroupMap[ageGroup] || 0) + 1;
      });

      const patientAgeDistribution = Object.keys(ageGroupMap)
        .sort()
        .map(group => ({
          name: group,
          value: ageGroupMap[group],
        }));

      // Billing Trends by Department
      const deptBillingMap = {};
      bills.forEach(bill => {
        const dept = bill.department || 'OPD';
        const date = new Date(bill.date || bill.createdAt || new Date());
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];

        if (!deptBillingMap[dept]) {
          deptBillingMap[dept] = {};
        }
        if (!deptBillingMap[dept][monthName]) {
          deptBillingMap[dept][monthName] = 0;
        }
        deptBillingMap[dept][monthName] += bill.totalAmount || 0;
      });

      const billingTrendsByDepartment = months.map(month => {
        const data = { name: month };
        Object.keys(deptBillingMap).forEach(dept => {
          data[dept] = deptBillingMap[dept][month] || 0;
        });
        return data;
      });

      setReportData({
        billStatusBreakdown,
        appointmentStatusTrends,
        doctorPerformance,
        patientAgeDistribution,
        billingTrendsByDepartment,
      });
    } catch (err) {
      console.error('Error loading report data:', err);
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>📈 Hospital Analytics & Reports</h1>
        <div className="date-range-selector">
          <label htmlFor="dateRange">Date Range:</label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastQuarter">Last Quarter</option>
            <option value="lastYear">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Bill Status Breakdown */}
      <div className="report-section">
        <div className="report-card">
          <h3>💳 Bill Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.billStatusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.billStatusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance */}
        <div className="report-card">
          <h3>👨‍⚕️ Top Doctor Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.doctorPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#45B7D1" />
              <Bar dataKey="completed" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointment Status Trends */}
      <div className="report-card full-width">
        <h3>📅 Appointment Status Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={reportData.appointmentStatusTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="scheduled" stroke="#FF6B6B" strokeWidth={2} />
            <Line type="monotone" dataKey="completed" stroke="#4ECDC4" strokeWidth={2} />
            <Line type="monotone" dataKey="cancelled" stroke="#FFA07A" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Age Distribution */}
      <div className="report-section">
        <div className="report-card">
          <h3>👥 Patient Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.patientAgeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#45B7D1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Billing Trends by Department */}
        <div className="report-card">
          <h3>💰 Billing Trends by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.billingTrendsByDepartment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Legend />
              <Line type="monotone" dataKey="OPD" stroke="#FF6B6B" />
              <Line type="monotone" dataKey="IPD" stroke="#4ECDC4" />
              <Line type="monotone" dataKey="Emergency" stroke="#45B7D1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
