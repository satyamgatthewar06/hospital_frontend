import React, { useState, useEffect } from 'react';
import wardService from '../../services/wardService';

const Discharge = ({ admissions, onSuccess }) => {
  const [activeAdmissions, setActiveAdmissions] = useState([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState('');
  const [dischargeReason, setDischargeReason] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [daysInfo, setDaysInfo] = useState(null);

  useEffect(() => {
    const active = admissions.filter(a => a.status === 'admitted');
    setActiveAdmissions(active);
  }, [admissions]);

  const selectedAdmission = activeAdmissions.find(a => a.id === selectedAdmissionId);

  // Calculate days stayed and charges when admission is selected
  useEffect(() => {
    if (selectedAdmission) {
      const admitDate = new Date(selectedAdmission.admissionDate);
      const today = new Date();
      const daysStayed = Math.max(1, Math.ceil((today - admitDate) / (1000 * 60 * 60 * 24)));
      
      const roomType = selectedAdmission.roomType || 'GENERAL';
      const roomTypeDetails = wardService.getRoomTypeDetails(roomType);
      const dailyRate = roomTypeDetails.dailyRate;
      const totalCharges = dailyRate * daysStayed;
      
      setDaysInfo({
        daysStayed,
        dailyRate,
        totalCharges,
        roomType
      });
    }
  }, [selectedAdmissionId]);

  const handleDischarge = (e) => {
    e.preventDefault();

    if (!selectedAdmissionId) {
      setMessage('❌ Please select a patient to discharge');
      return;
    }

    if (!dischargeReason) {
      setMessage('❌ Please enter discharge reason');
      return;
    }

    try {
      const discharged = wardService.dischargePatient(selectedAdmissionId);
      if (discharged) {
        setMessage(`✅ Patient discharged successfully! Discharge ID: ${discharged.id}. Discharge charges (₹${daysInfo?.totalCharges}) have been added to billing.`);
        setSelectedAdmissionId('');
        setDischargeReason('');
        setNotes('');
        setDaysInfo(null);
        setTimeout(() => {
          setMessage('');
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      setMessage('❌ Error discharging patient');
    }
  };

  return (
    <div className="discharge">
      <div className="discharge-container">
        <h2>➖ Discharge Patient from Ward</h2>

        {activeAdmissions.length === 0 ? (
          <div className="no-data">
            <p>📋 No admitted patients to discharge</p>
          </div>
        ) : (
          <div className="discharge-form-wrapper">
            <form onSubmit={handleDischarge} className="discharge-form">
              <div className="form-group">
                <label>Select Patient to Discharge *</label>
                <select
                  value={selectedAdmissionId}
                  onChange={(e) => setSelectedAdmissionId(e.target.value)}
                  required
                >
                  <option value="">-- Select a patient --</option>
                  {activeAdmissions.map(admission => (
                    <option key={admission.id} value={admission.id}>
                      {admission.patientName} ({admission.patientId}) - Room {admission.roomId?.replace(/[A-Z-]/g, '')} - Admitted {admission.admissionDate}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAdmission && (
                <div className="admission-info">
                  <div className="info-row">
                    <span className="label">Patient Name:</span>
                    <span className="value">{selectedAdmission.patientName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Patient ID:</span>
                    <span className="value">{selectedAdmission.patientId}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Room:</span>
                    <span className="value">{selectedAdmission.roomId}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Bed:</span>
                    <span className="value">{selectedAdmission.bedNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Admission Date:</span>
                    <span className="value">{selectedAdmission.admissionDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Diagnosis:</span>
                    <span className="value">{selectedAdmission.diagnosis}</span>
                  </div>
                </div>
              )}

              {daysInfo && (
                <div className="discharge-charges">
                  <h4>💰 Discharge Charges Summary</h4>
                  <div className="charge-row">
                    <span className="charge-label">Room Type:</span>
                    <span className="charge-value">{daysInfo.roomType}</span>
                  </div>
                  <div className="charge-row">
                    <span className="charge-label">Days Stayed:</span>
                    <span className="charge-value">{daysInfo.daysStayed} day(s)</span>
                  </div>
                  <div className="charge-row">
                    <span className="charge-label">Daily Rate:</span>
                    <span className="charge-value">₹{daysInfo.dailyRate}</span>
                  </div>
                  <div className="charge-row total">
                    <span className="charge-label">Total Charges:</span>
                    <span className="charge-value">₹{daysInfo.totalCharges}</span>
                  </div>
                  <p className="charge-note">⚠️ This amount will be added to the patient's billing account upon discharge</p>
                </div>
              )}

              <div className="form-group">
                <label>Discharge Reason *</label>
                <select
                  value={dischargeReason}
                  onChange={(e) => setDischargeReason(e.target.value)}
                  required
                >
                  <option value="">-- Select reason --</option>
                  <option value="recovered">Recovered</option>
                  <option value="improved">Improved - Advise Outpatient Follow-up</option>
                  <option value="referred">Referred to Other Hospital</option>
                  <option value="against-advice">Discharged Against Medical Advice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Discharge Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter discharge instructions, medications, follow-up advice, etc."
                  rows="5"
                />
              </div>

              <button type="submit" className="btn-discharge">
                ➖ Discharge Patient
              </button>
            </form>

            {message && (
              <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        )}

        <div className="active-admissions">
          <h3>Currently Admitted Patients</h3>
          <div className="admissions-table">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Patient ID</th>
                  <th>Room</th>
                  <th>Bed</th>
                  <th>Admission Date</th>
                  <th>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {activeAdmissions.map(admission => (
                  <tr
                    key={admission.id}
                    className={selectedAdmissionId === admission.id ? 'selected' : ''}
                    onClick={() => setSelectedAdmissionId(admission.id)}
                  >
                    <td>{admission.patientName}</td>
                    <td>{admission.patientId}</td>
                    <td>{admission.roomId}</td>
                    <td>{admission.bedNumber}</td>
                    <td>{admission.admissionDate}</td>
                    <td>{admission.diagnosis.substring(0, 50)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discharge;
