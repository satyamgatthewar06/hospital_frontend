import React, { useContext } from "react";
import { HospitalContext } from "../context/HospitalContext";

function Dashboard(props) {
  // defensive context usage
  const ctx = useContext(HospitalContext) || {};
  const patients = ctx.patients || [];
  const doctors = ctx.doctors || [];
  const appointments = ctx.appointments || [];
  const bills = ctx.bills || [];
  const staff = ctx.staff || [];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Dashboard</h2>

      <div className="cards-container">
        <div className="card">
          <div className="card-icon">👥</div>
          <p className="card-title">Total Patients</p>
          <p className="card-value">{patients.length}</p>
        </div>

        <div className="card">
          <div className="card-icon">👨‍⚕️</div>
          <p className="card-title">Total Doctors</p>
          <p className="card-value">{doctors.length}</p>
        </div>

        <div className="card">
          <div className="card-icon">👔</div>
          <p className="card-title">Total Staff</p>
          <p className="card-value">{staff.length}</p>
        </div>

        <div className="card">
          <div className="card-icon">💳</div>
          <p className="card-title">Total Billings</p>
          <p className="card-value">{bills.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;