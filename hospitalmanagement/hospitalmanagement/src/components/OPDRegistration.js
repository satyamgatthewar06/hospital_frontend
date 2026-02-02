import React, { useState } from 'react';
import '../styles/OPDRegistration.css';
import {
  validateOPDRegistration,
  generateVisitId,
  formatDate,
  formatTime,
  DEPARTMENTS,
  getDoctorsByDepartment,
} from '../services/patientManagementService';

const OPDRegistration = ({ patients, onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    id: generateVisitId(),
    patientId: '',
    department: '',
    doctor: '',
    visitReason: '',
    symptoms: '',
    notes: '',
    registrationDate: new Date().toISOString(),
    visitNumber: `OPD-${Date.now()}`,
    status: 'Registered',
    priority: 'Normal',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = patients.find((p) => p.id === patientId);

    setFormData((prev) => ({
      ...prev,
      patientId: patientId,
      department: '',
      doctor: '',
    }));
    setSelectedPatient(patient);
    setAvailableDoctors([]);
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department: department,
      doctor: '',
    }));
    setAvailableDoctors(getDoctorsByDepartment(department));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateOPDRegistration(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!selectedPatient) {
      setErrors((prev) => ({
        ...prev,
        patientId: 'Please select a patient',
      }));
      return;
    }

    const registrationData = {
      ...formData,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientAge: new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear(),
    };

    setSubmitted(true);
    onRegister(registrationData);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="opd-registration-container">
      <h2>OPD Registration</h2>

      {submitted && (
        <div className="success-message">
          ✓ OPD registration successful! Visit ID: {formData.visitNumber}
        </div>
      )}

      <form onSubmit={handleSubmit} className="opd-form">
        {/* Patient Selection */}
        <fieldset>
          <legend>Patient Information</legend>

          <div className="form-group">
            <label>Select Patient *</label>
            <select
              value={formData.patientId}
              onChange={handlePatientChange}
              className={errors.patientId ? 'error' : ''}
            >
              <option value="">Choose a patient...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} (ID: {patient.id})
                </option>
              ))}
            </select>
            {errors.patientId && <span className="error-text">{errors.patientId}</span>}
          </div>

          {selectedPatient && (
            <div className="patient-summary">
              <p>
                <strong>Age:</strong> {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years
              </p>
              <p>
                <strong>Gender:</strong> {selectedPatient.gender}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPatient.phone}
              </p>
            </div>
          )}
        </fieldset>

        {/* Department & Doctor */}
        <fieldset>
          <legend>Department & Doctor</legend>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleDepartmentChange}
                className={errors.department ? 'error' : ''}
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label>Doctor *</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className={errors.doctor ? 'error' : ''}
                disabled={availableDoctors.length === 0}
              >
                <option value="">Select doctor...</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
              </select>
              {errors.doctor && <span className="error-text">{errors.doctor}</span>}
            </div>
          </div>
        </fieldset>

        {/* Visit Details */}
        <fieldset>
          <legend>Visit Details</legend>

          <div className="form-row">
            <div className="form-group">
              <label>Visit Reason *</label>
              <input
                type="text"
                name="visitReason"
                value={formData.visitReason}
                onChange={handleChange}
                className={errors.visitReason ? 'error' : ''}
                placeholder="e.g., Regular checkup, Follow-up"
              />
              {errors.visitReason && <span className="error-text">{errors.visitReason}</span>}
            </div>

            <div className="form-group">
              <label>Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Normal</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Symptoms *</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className={errors.symptoms ? 'error' : ''}
              placeholder="Describe symptoms..."
              rows="3"
            />
            {errors.symptoms && <span className="error-text">{errors.symptoms}</span>}
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows="2"
            />
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Register for OPD
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OPDRegistration;
