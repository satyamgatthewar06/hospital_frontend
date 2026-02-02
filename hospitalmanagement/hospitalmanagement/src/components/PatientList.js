import React from 'react';
import '../styles/PatientList.css';
import { calculateAge } from '../services/patientManagementService';

const PatientList = ({
  patients,
  searchTerm,
  onSearch,
  onViewDetails,
  onEdit,
  onDelete,
  onViewHistory,
  getPatientVisits,
}) => {
  return (
    <div className="patient-list-container">
      <div className="list-header">
        <h2>Patients List</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="no-patients">
          <p>No patients found</p>
          {searchTerm && <p className="search-hint">Try different search terms</p>}
        </div>
      ) : (
        <div className="patients-table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Visits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="patient-row">
                  <td>
                    <span className="patient-id">{patient.id}</span>
                  </td>
                  <td>
                    <strong>
                      {patient.firstName} {patient.lastName}
                    </strong>
                  </td>
                  <td>{calculateAge(patient.dateOfBirth)} years</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <span className="blood-group">{patient.bloodGroup}</span>
                  </td>
                  <td>
                    <span className="visit-count">
                      {getPatientVisits(patient.id).length}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-view"
                        onClick={() => onViewDetails(patient)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(patient)}
                        title="Edit Patient"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-history"
                        onClick={() => onViewHistory(patient)}
                        title="View History"
                      >
                        📜
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(patient.id)}
                        title="Delete Patient"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="list-footer">
        <p>
          Total Patients: <strong>{patients.length}</strong>
        </p>
      </div>
    </div>
  );
};

export default PatientList;
