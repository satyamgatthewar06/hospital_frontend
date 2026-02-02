import React from 'react';
import '../styles/VisitHistory.css';
import { formatDate, formatTime } from '../services/patientManagementService';

const VisitHistory = ({ patient, visits = [] }) => {
  if (!patient) {
    return (
      <div className="visit-history-container">
        <p className="no-data">Please select a patient first</p>
      </div>
    );
  }

  const getVisitTypeIcon = (type) => {
    switch (type) {
      case 'OPD':
        return '🏥';
      case 'IPD':
        return '🛏️';
      case 'Laboratory':
        return '🔬';
      case 'Discharge':
        return '✓';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Discharged':
        return 'status-completed';
      case 'Admitted':
      case 'Registered':
        return 'status-active';
      case 'Pending':
        return 'status-pending';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const calculateStayDays = (admission, discharge) => {
    const start = new Date(admission);
    const end = new Date(discharge);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 'Ongoing';
  };

  const sortedVisits = [...visits].sort(
    (a, b) => new Date(b.date || b.registrationDate) - new Date(a.date || a.registrationDate)
  );

  return (
    <div className="visit-history-container">
      <h2>Visit History</h2>

      <div className="patient-info-banner">
        <div>
          <h3>
            {patient.firstName} {patient.lastName}
          </h3>
          <p>ID: {patient.id}</p>
        </div>
        <div>
          <p>
            <strong>Total Visits:</strong> {visits.length}
          </p>
          <p>
            <strong>Phone:</strong> {patient.phone}
          </p>
        </div>
      </div>

      {visits.length === 0 ? (
        <div className="no-visits">
          <p>No visit history available for this patient</p>
        </div>
      ) : (
        <div className="visits-timeline">
          {sortedVisits.map((visit, index) => (
            <div key={index} className="visit-card">
              <div className="visit-timeline-marker">
                <div className="visit-icon">{getVisitTypeIcon(visit.type || visit.visitType)}</div>
              </div>

              <div className="visit-content">
                {/* Visit Type Badge */}
                <div className="visit-header">
                  <span className="visit-type-badge">
                    {visit.type || visit.visitType || 'Visit'}
                  </span>
                  <span className={`visit-status ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </span>
                </div>

                {/* Visit Details */}
                <div className="visit-details">
                  {/* OPD Details */}
                  {(visit.type === 'OPD' || visit.visitReason) && (
                    <div className="detail-section">
                      <h4>OPD Visit</h4>
                      <p>
                        <strong>Date:</strong> {formatDate(visit.registrationDate || visit.date)}
                      </p>
                      <p>
                        <strong>Department:</strong> {visit.department}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {visit.doctor}
                      </p>
                      <p>
                        <strong>Reason:</strong> {visit.visitReason}
                      </p>
                      {visit.symptoms && (
                        <p>
                          <strong>Symptoms:</strong> {visit.symptoms}
                        </p>
                      )}
                      {visit.priority && (
                        <p>
                          <strong>Priority:</strong> <span className={`priority-${visit.priority.toLowerCase()}`}>{visit.priority}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* IPD Details */}
                  {(visit.type === 'IPD' || visit.admissionReason) && (
                    <div className="detail-section">
                      <h4>IPD Admission</h4>
                      <p>
                        <strong>Admission Date:</strong>{' '}
                        {formatDate(visit.admissionDate || visit.registrationDate)}
                      </p>
                      <p>
                        <strong>Department:</strong> {visit.department}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {visit.doctor}
                      </p>
                      <p>
                        <strong>Ward:</strong> {visit.ward}
                      </p>
                      <p>
                        <strong>Bed Number:</strong> {visit.bedNumber}
                      </p>
                      <p>
                        <strong>Reason for Admission:</strong> {visit.admissionReason}
                      </p>
                      {visit.dischargeDate && (
                        <>
                          <p>
                            <strong>Discharge Date:</strong> {formatDate(visit.dischargeDate)}
                          </p>
                          <p>
                            <strong>Total Stay:</strong>{' '}
                            {calculateStayDays(visit.admissionDate, visit.dischargeDate)} days
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Discharge Details */}
                  {visit.diagnosis && (
                    <div className="detail-section">
                      <h4>Discharge Summary</h4>
                      <p>
                        <strong>Discharge Date:</strong> {formatDate(visit.dischargeDate || visit.date)}
                      </p>
                      <p>
                        <strong>Diagnosis:</strong> {visit.diagnosis}
                      </p>
                      <p>
                        <strong>Condition:</strong> {visit.condition}
                      </p>
                      {visit.followUpDate && (
                        <p>
                          <strong>Follow-up Date:</strong> {formatDate(visit.followUpDate)}
                        </p>
                      )}
                      {visit.restrictions && (
                        <p>
                          <strong>Restrictions:</strong> {visit.restrictions}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Additional Notes */}
                  {visit.notes && (
                    <div className="detail-section">
                      <p>
                        <strong>Notes:</strong> {visit.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      {visits.length > 0 && (
        <div className="visits-summary">
          <div className="summary-card">
            <h4>Total Visits</h4>
            <p className="summary-value">{visits.length}</p>
          </div>
          <div className="summary-card">
            <h4>OPD Visits</h4>
            <p className="summary-value">
              {visits.filter((v) => v.type === 'OPD' || v.visitReason).length}
            </p>
          </div>
          <div className="summary-card">
            <h4>IPD Admissions</h4>
            <p className="summary-value">
              {visits.filter((v) => v.type === 'IPD' || v.admissionReason).length}
            </p>
          </div>
          <div className="summary-card">
            <h4>Last Visit</h4>
            <p className="summary-value">
              {sortedVisits.length > 0
                ? formatDate(
                    sortedVisits[0].registrationDate ||
                      sortedVisits[0].admissionDate ||
                      sortedVisits[0].date
                  )
                : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitHistory;
