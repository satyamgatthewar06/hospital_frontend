import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import OPDDashboard from '../components/OPD/OPDDashboard';
import IPDDashboard from '../components/IPD/IPDDashboard';
import BillingRecords from '../components/Billing/BillingRecords';
import DoctorsList from '../components/Doctors/DoctorsList';
import StaffManagement from '../components/Staff/StaffManagement';
import AnalyticalDashboard from '../components/AnalyticalDashboard';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalAppointments: 0,
        occupiedBeds: 0,
        monthlyRevenue: 0,
        pendingBills: 0,
    });

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = () => {
        try {
            // Get total patients
            const patients = JSON.parse(localStorage.getItem('hms_patients_v1') || '[]');
            const totalPatients = patients.length;

            // Get total appointments
            const appointments = JSON.parse(localStorage.getItem('hms_appointments_v1') || '[]');
            const totalAppointments = appointments.length;

            // Get occupied beds (today's admissions)
            const wardRooms = JSON.parse(localStorage.getItem('hms_ward_rooms_v1') || '[]');
            const occupiedBeds = wardRooms.filter(room => room.occupiedBeds && room.occupiedBeds.length > 0)
                .reduce((total, room) => total + (room.occupiedBeds.length || 0), 0);

            // Get revenue for this month
            const bills = JSON.parse(localStorage.getItem('hms_bills_v1') || '[]');
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            let monthlyRevenue = 0;
            let pendingBills = 0;

            bills.forEach(bill => {
                const billDate = new Date(bill.date || bill.createdAt || new Date());
                if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
                    monthlyRevenue += bill.totalAmount || 0;
                }
                if (bill.status === 'pending' || bill.status === 'unpaid') {
                    pendingBills += bill.totalAmount || 0;
                }
            });

            setStats({
                totalPatients,
                totalAppointments,
                occupiedBeds,
                monthlyRevenue,
                pendingBills,
            });
        } catch (err) {
            console.error('Error loading statistics:', err);
        }
    };

    return (
        <div className="dashboard">
            <h1>🏥 Hospital Management Dashboard</h1>
            
            {/* Statistics Cards */}
            <div className="statistics-grid">
                <div className="stat-card patients">
                    <div className="stat-icon">👥</div>
                    <div className="stat-details">
                        <h3>Total Patients</h3>
                        <p className="stat-number">{stats.totalPatients}</p>
                        <span className="stat-label">Registered</span>
                    </div>
                </div>

                <div className="stat-card appointments">
                    <div className="stat-icon">📅</div>
                    <div className="stat-details">
                        <h3>Total Appointments</h3>
                        <p className="stat-number">{stats.totalAppointments}</p>
                        <span className="stat-label">Scheduled</span>
                    </div>
                </div>

                <div className="stat-card beds">
                    <div className="stat-icon">🛏️</div>
                    <div className="stat-details">
                        <h3>Occupied Beds</h3>
                        <p className="stat-number">{stats.occupiedBeds}</p>
                        <span className="stat-label">Today</span>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                        <h3>Monthly Revenue</h3>
                        <p className="stat-number">₹{stats.monthlyRevenue.toLocaleString('en-IN')}</p>
                        <span className="stat-label">This Month</span>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-details">
                        <h3>Pending Bills</h3>
                        <p className="stat-number">₹{stats.pendingBills.toLocaleString('en-IN')}</p>
                        <span className="stat-label">Outstanding</span>
                    </div>
                </div>
            </div>

            <AnalyticalDashboard />

            <div className="dashboard-section">
                <h2>Outpatient Department (OPD)</h2>
                <OPDDashboard />
            </div>
            <div className="dashboard-section">
                <h2>Inpatient Department (IPD)</h2>
                <IPDDashboard />
            </div>
            <div className="dashboard-section">
                <h2>Billing Records</h2>
                <BillingRecords />
            </div>
            <div className="dashboard-section">
                <h2>Doctors List</h2>
                <DoctorsList />
            </div>
            <div className="dashboard-section">
                <h2>Staff Management</h2>
                <StaffManagement />
            </div>
        </div>
    );
};

export default Dashboard;