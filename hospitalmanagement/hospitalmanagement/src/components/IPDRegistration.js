import React, { useState } from 'react';
import '../styles/IPDRegistration.css';
import {
  validateIPDRegistration,
  generateVisitId,
  formatDate,
  DEPARTMENTS,
  getDoctorsByDepartment,
} from '../services/patientManagementService';

const IPDRegistration = ({ patients, onRegister, onCancel }) => {
  const WARDS = ['General Ward', 'Private Ward', 'ICU', 'CCU', 'Pediatric Ward', 'Maternity Ward'];

  const [formData, setFormData] = useState({
    id: generateVisitId(),
    patientId: '',
    department: '',
    doctor: '',
    admissionReason: '',
    ward: '',
    bedNumber: '',
    estimatedStay: '',
    admissionDate: new Date().toISOString(),
    admissionTime: new Date().toTimeString().slice(0, 5),
    status: 'Admitted',
    registrationNumber: `IPD-${Date.now()}`,
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
    const formErrors = validateIPDRegistration(formData);

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
    <div className="ipd-registration-container">
      <h2>IPD (Inpatient) Registration</h2>

      {submitted && (
        <div className="success-message">
          ✓ IPD registration successful! Registration Number: {formData.registrationNumber}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ipd-form">
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
                <strong>Blood Group:</strong> {selectedPatient.bloodGroup || 'Not specified'}
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
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
              {errors.doctor && <span className="error-text">{errors.doctor}</span>}
            </div>
          </div>
        </fieldset>

        {/* Admission Details */}
        <fieldset>
          <legend>Admission Details</legend>

          <div className="form-group">
            <label>Admission Reason *</label>
            <textarea
              name="admissionReason"
              value={formData.admissionReason}
              onChange={handleChange}
              className={errors.admissionReason ? 'error' : ''}
              placeholder="Describe reason for admission..."
              rows="3"
            />
            {errors.admissionReason && <span className="error-text">{errors.admissionReason}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ward *</label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className={errors.ward ? 'error' : ''}
              >
                <option value="">Select ward...</option>
                {WARDS.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
              {errors.ward && <span className="error-text">{errors.ward}</span>}
            </div>

            <div className="form-group">
              <label>Bed Number *</label>
              <input
                type="text"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
                className={errors.bedNumber ? 'error' : ''}
                placeholder="e.g., A-101"
              />
              {errors.bedNumber && <span className="error-text">{errors.bedNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate.split('T')[0]}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Admission Time</label>
              <input
                type="time"
                name="admissionTime"
                value={formData.admissionTime}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Estimated Stay (Days) *</label>
              <input
                type="number"
                name="estimatedStay"
                value={formData.estimatedStay}
                onChange={handleChange}
                className={errors.estimatedStay ? 'error' : ''}
                placeholder="e.g., 5"
                min="1"
              />
              {errors.estimatedStay && <span className="error-text">{errors.estimatedStay}</span>}
            </div>
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Register for IPD
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IPDRegistration;
