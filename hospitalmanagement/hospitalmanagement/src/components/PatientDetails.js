import React from 'react';
import '../styles/PatientDetails.css';
import { calculateAge, formatDate } from '../services/patientManagementService';

const PatientDetails = ({
  patient,
  onEdit,
  onViewHistory,
  onRegisterOPD,
  onRegisterIPD,
  visitCount,
}) => {
  if (!patient) {
    return <div className="no-data">Please select a patient</div>;
  }

  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="patient-details-container">
      <div className="details-header">
        <div className="patient-name">
          <h2>
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="patient-id-badge">{patient.id}</p>
        </div>
        <div className="action-buttons-top">
          <button className="btn-primary" onClick={onEdit}>
            ✏️ Edit Patient
          </button>
          <button className="btn-secondary" onClick={onViewHistory}>
            📜 View History
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="details-card">
        <h3>👤 Personal Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Date of Birth</label>
            <p>{formatDate(patient.dateOfBirth)}</p>
          </div>
          <div className="info-item">
            <label>Age</label>
            <p>{age} years</p>
          </div>
          <div className="info-item">
            <label>Gender</label>
            <p>{patient.gender}</p>
          </div>
          <div className="info-item">
            <label>Blood Group</label>
            <p>
              <span className="blood-group-badge">{patient.bloodGroup}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="details-card">
        <h3>📞 Contact Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Phone</label>
            <p>{patient.phone}</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{patient.email}</p>
          </div>
          <div className="info-item full-width">
            <label>Address</label>
            <p>
              {patient.address}, {patient.city}, {patient.state} {patient.zipCode}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="details-card">
        <h3>🆘 Emergency Contact</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Name</label>
            <p>{patient.emergencyContact}</p>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <p>{patient.emergencyPhone}</p>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="details-card">
        <h3>⚕️ Medical Information</h3>
        <div className="info-grid">
          <div className="info-item full-width">
            <label>Medical History</label>
            <p>{patient.medicalHistory || 'None'}</p>
          </div>
          <div className="info-item full-width">
            <label>Allergies</label>
            <p>{patient.allergies || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Visit Statistics */}
      <div className="details-card">
        <h3>📊 Visit Statistics</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-number">{visitCount}</span>
            <span className="stat-label">Total Visits</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              {Math.floor(Math.random() * 10) + 1}
            </span>
            <span className="stat-label">OPD Visits</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              {Math.floor(Math.random() * 5)}
            </span>
            <span className="stat-label">IPD Admissions</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              {Math.floor(Math.random() * 8) + 1}
            </span>
            <span className="stat-label">Lab Tests</span>
          </div>
        </div>
      </div>

      {/* Registration Date */}
      <div className="details-card">
        <h3>📅 Registration</h3>
        <p>
          <strong>Registration Date:</strong> {formatDate(patient.registrationDate)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-bottom">
        <button className="btn-action-large btn-opd" onClick={onRegisterOPD}>
          🏥 Register for OPD
        </button>
        <button className="btn-action-large btn-ipd" onClick={onRegisterIPD}>
          🛏️ Register for IPD
        </button>
        <button className="btn-action-large btn-history-large" onClick={onViewHistory}>
          📜 View Full History
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;
