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
  AreaChart,
  Area,
} from 'recharts';
import '../styles/AnalyticalDashboard.css';

const AnalyticalDashboard = () => {
  const [chartData, setChartData] = useState({
    monthlyRevenue: [],
    appointmentTrends: [],
    departmentDistribution: [],
    patientStatus: [],
    bedOccupancy: [],
    staffDistribution: [],
  });

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

  useEffect(() => {
    loadAnalyticalData();
  }, []);

  const loadAnalyticalData = () => {
    try {
      const patients = JSON.parse(localStorage.getItem('hms_patients_v1') || '[]');
      const appointments = JSON.parse(localStorage.getItem('hms_appointments_v1') || '[]');
      const bills = JSON.parse(localStorage.getItem('hms_bills_v1') || '[]');
      const wardRooms = JSON.parse(localStorage.getItem('hms_ward_rooms_v1') || '[]');
      const staff = JSON.parse(localStorage.getItem('hms_staff_v1') || '[]');
      const doctors = JSON.parse(localStorage.getItem('hms_doctors_v1') || '[]');

      // Monthly Revenue Data
      const monthlyRevenueMap = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      bills.forEach(bill => {
        const date = new Date(bill.date || bill.createdAt || new Date());
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        
        if (!monthlyRevenueMap[monthName]) {
          monthlyRevenueMap[monthName] = 0;
        }
        monthlyRevenueMap[monthName] += bill.totalAmount || 0;
      });

      const monthlyRevenue = months.map(month => ({
        name: month,
        revenue: monthlyRevenueMap[month] || 0,
      }));

      // Appointment Trends
      const appointmentMap = {};
      appointments.forEach(apt => {
        const date = new Date(apt.date || apt.appointmentDate || new Date());
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        
        if (!appointmentMap[monthName]) {
          appointmentMap[monthName] = 0;
        }
        appointmentMap[monthName]++;
      });

      const appointmentTrends = months.map(month => ({
        name: month,
        appointments: appointmentMap[month] || 0,
      }));

      // Department Distribution (based on patient visit types)
      const departmentMap = {};
      patients.forEach(patient => {
        const dept = patient.department || patient.type || 'OPD';
        departmentMap[dept] = (departmentMap[dept] || 0) + 1;
      });

      const departmentDistribution = Object.keys(departmentMap).map(dept => ({
        name: dept,
        value: departmentMap[dept],
      }));

      // Patient Status Distribution
      const statusMap = {};
      patients.forEach(patient => {
        const status = patient.status || 'Active';
        statusMap[status] = (statusMap[status] || 0) + 1;
      });

      const patientStatus = Object.keys(statusMap).map(status => ({
        name: status,
        value: statusMap[status],
      }));

      // Bed Occupancy Data
      const bedOccupancyData = [];
      wardRooms.forEach(room => {
        const occupancy = room.occupiedBeds ? room.occupiedBeds.length : 0;
        const capacity = room.capacity || 10;
        const occupancyPercentage = (occupancy / capacity) * 100;
        
        bedOccupancyData.push({
          name: room.roomNumber || `Room ${room.id}`,
          occupied: occupancy,
          available: capacity - occupancy,
          percentage: Math.round(occupancyPercentage),
        });
      });

      const bedOccupancy = bedOccupancyData.slice(0, 8); // Show top 8 rooms

      // Staff Distribution by Department
      const staffDeptMap = {};
      staff.forEach(member => {
        const dept = member.department || 'General';
        staffDeptMap[dept] = (staffDeptMap[dept] || 0) + 1;
      });

      const staffDistribution = Object.keys(staffDeptMap).map(dept => ({
        name: dept,
        value: staffDeptMap[dept],
      }));

      setChartData({
        monthlyRevenue,
        appointmentTrends,
        departmentDistribution,
        patientStatus,
        bedOccupancy,
        staffDistribution,
      });
    } catch (err) {
      console.error('Error loading analytical data:', err);
    }
  };

  return (
    <div className="analytical-dashboard">
      <h2 className="analytics-title">📊 Analytical Dashboard</h2>
      
      {/* Monthly Revenue Trend */}
      <div className="chart-container full-width">
        <h3>💰 Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.monthlyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#45B7D1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#45B7D1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
            <Area type="monotone" dataKey="revenue" stroke="#45B7D1" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Appointment Trends */}
      <div className="chart-container full-width">
        <h3>📅 Appointment Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.appointmentTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#FF6B6B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout for Pie Charts */}
      <div className="chart-row">
        {/* Department Distribution */}
        <div className="chart-container half-width">
          <h3>🏢 Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.departmentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Status */}
        <div className="chart-container half-width">
          <h3>👥 Patient Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.patientStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.patientStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bed Occupancy */}
      <div className="chart-container full-width">
        <h3>🛏️ Bed Occupancy Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.bedOccupancy}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="occupied" stackId="a" fill="#FF6B6B" />
            <Bar dataKey="available" stackId="a" fill="#4ECDC4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Staff Distribution */}
      <div className="chart-container full-width">
        <h3>👨‍⚕️ Staff Distribution by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.staffDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#45B7D1" name="Staff Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticalDashboard;
