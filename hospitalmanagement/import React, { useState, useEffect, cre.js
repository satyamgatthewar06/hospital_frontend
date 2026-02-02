import React, { useState, useEffect, createContext } from 'react';
import OPDDashboard from '../components/OPD/OPDDashboard';
import IPDDashboard from '../components/IPD/IPDDashboard';
import BillingRecords from '../components/Billing/BillingRecords';

// Step 1: Create the context
export const HospitalContext = createContext();

// Step 2: Create the Provider component
export function HospitalProvider({ children }) {
  // Step 3: Define state variables for different hospital data
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 35, contact: '9876543210', type: 'OPD' },
    { id: 2, name: 'Jane Smith', age: 28, contact: '9876543211', type: 'OPD' },
  ]);

  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', contact: '9876543210', experience: '15 years' },
    { id: 2, name: 'Dr. Johnson', specialty: 'Neurology', contact: '9876543211', experience: '12 years' },
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: 'Alice Brown', role: 'Nurse', department: 'General Ward', contact: '9876543210' },
    { id: 2, name: 'Bob White', role: 'Lab Technician', department: 'Laboratory', contact: '9876543211' },
  ]);

  const [billings, setBillings] = useState([
    { id: 1, patientName: 'John Doe', amount: 5000, date: '2025-01-27', status: 'Paid', type: 'OPD' },
    { id: 2, patientName: 'Jane Smith', amount: 8500, date: '2025-01-26', status: 'Pending', type: 'OPD' },
  ]);

  // Step 4: Provide all data to the app
  return (
    <HospitalContext.Provider value={{ 
      patients, setPatients,        // Patient data and updater function
      doctors, setDoctors,          // Doctor data and updater function
      staff, setStaff,              // Staff data and updater function
      billings, setBillings         // Billing data and updater function
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

function Dashboard() {
  const [opdCount, setOpdCount] = useState(45);
  const [ipdCount, setIpdCount] = useState(28);
  const [totalBilling, setTotalBilling] = useState(125000);
  const [doctorCount, setDoctorCount] = useState(15);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      
      <div className="cards-container">
        <div className="card">
          <div className="card-icon">👥</div>
          <p className="card-title">OPD Patients</p>
          <p className="card-value">{opdCount}</p>
        </div>
        
        <div className="card">
          <div className="card-icon">🛏️</div>
          <p className="card-title">IPD Patients</p>
          <p className="card-value">{ipdCount}</p>
        </div>
        
        <div className="card">
          <div className="card-icon">💰</div>
          <p className="card-title">Total Billing</p>
          <p className="card-value">₹{totalBilling.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <div className="card-icon">👨‍⚕️</div>
          <p className="card-title">Total Doctors</p>
          <p className="card-value">{doctorCount}</p>
        </div>
      </div>

      <OPDDashboard />
      <IPDDashboard />
      <BillingRecords />
    </div>
  );
}

export default Dashboard;