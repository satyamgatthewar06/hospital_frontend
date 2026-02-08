import React, { useContext } from "react";
import { HospitalContext } from "../context/HospitalContext";
import { Users, UserPlus, FileText, Activity } from 'lucide-react';
import StatsCard from "../components/Dashboard/StatsCard";
import ChartWidget from "../components/Dashboard/ChartWidget";
import ScheduleWidget from "../components/Dashboard/ScheduleWidget";
import './Dashboard.css';

function Dashboard() {
  const ctx = useContext(HospitalContext) || {};
  const patients = ctx.patients || [];
  const doctors = ctx.doctors || [];
  const appointments = ctx.appointments || [];
  const bills = ctx.bills || [];

  // Mock Data for Charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Income',
        data: [12000, 19000, 3000, 5000, 2000, 3000, 45000],
        borderColor: '#4FD1C5',
        backgroundColor: 'rgba(79, 209, 197, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expense',
        data: [8000, 12000, 2000, 4000, 1500, 2000, 30000],
        borderColor: '#63B3ED',
        backgroundColor: 'rgba(99, 179, 237, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const patientOverviewData = {
    labels: ['Child', 'Adult', 'Elderly'],
    datasets: [
      {
        data: [30, 150, 40],
        backgroundColor: ['#4FD1C5', '#63B3ED', '#9F7AEA'],
        borderWidth: 0,
      },
    ],
  };

  // Mock Schedule
  const scheduleEvents = [
    { time: '09:00 AM', title: 'Morning Staff Meeting', subtitle: 'Conference Room A', type: 'meeting' },
    { time: '10:00 AM', title: 'Dr. Sarah Smith', subtitle: 'General Consultation', type: 'consultation' },
    { time: '11:30 AM', title: 'Surgery: Appendectomy', subtitle: 'OT - 2', type: 'surgery' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats-grid">
        <StatsCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="blue"
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Total Doctors"
          value={doctors.length}
          icon={UserPlus}
          color="green"
          trend="up"
          trendValue="4%"
        />
        <StatsCard
          title="Appointments"
          value={appointments.length}
          icon={FileText}
          color="purple"
          trend="down"
          trendValue="2%"
        />
        <StatsCard
          title="Total Billings"
          value={bills.length}
          icon={Activity}
          color="orange"
          trend="up"
          trendValue="8%"
        />
      </div>

      <div className="dashboard-charts-grid">
        <div className="chart-section-large">
          <ChartWidget title="Hospital Revenue" type="line" data={revenueData} height={320} />
        </div>
        <div className="chart-section-small">
          <ChartWidget title="Patient Demographics" type="doughnut" data={patientOverviewData} height={250} />
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="schedule-section">
          <ScheduleWidget title="Today's Schedule" events={scheduleEvents} />
        </div>
        {/* Helper widget or more stats can go here */}
        <div className="quick-actions-section">
          {/* Simple list or quick actions like 'Add Patient' */}
          <div className="chart-widget">
            <div className="widget-header">
              <h3>Recent Activity</h3>
            </div>
            <ul className="activity-list">
              {appointments.slice(0, 4).map((apt, i) => (
                <li key={i} className="activity-item">
                  <div className="activity-dot"></div>
                  <div>
                    <p className="activity-text">New appointment for <strong>{apt.patientName || 'Patient'}</strong></p>
                    <small className="activity-time">2 hours ago</small>
                  </div>
                </li>
              ))}
              {appointments.length === 0 && <p style={{ color: '#718096' }}>No recent activity.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;