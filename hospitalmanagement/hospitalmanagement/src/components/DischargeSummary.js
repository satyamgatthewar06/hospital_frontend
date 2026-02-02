import React, { useState } from 'react';
import '../styles/DischargeSummary.css';
import {
  validateDischargeSummary,
  formatDate,
  formatTime,
} from '../services/patientManagementService';

const DischargeSummary = ({ patient, ipdRegistration, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    dischargeDate: new Date().toISOString().split('T')[0],
    dischargeTime: new Date().toTimeString().slice(0, 5),
    diagnosis: '',
    treatment: '',
    medicines: '',
    followUpDate: '',
    restrictions: '',
    notes: '',
    doctorSignature: 'Dr. [Name]',
    condition: 'Improved',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
    const formErrors = validateDischargeSummary(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const summaryData = {
      ...formData,
      patientId: patient?.id,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
      ipdRegistrationId: ipdRegistration?.id,
      summaryDate: new Date().toISOString(),
    };

    setSubmitted(true);
    onSubmit(summaryData);
    setTimeout(() => setSubmitted(false), 2000);
  };

  if (!patient) {
    return (
      <div className="discharge-summary-container">
        <p className="no-data">Please select a patient first</p>
      </div>
    );
  }

  return (
    <div className="discharge-summary-container">
      <h2>Discharge Summary</h2>

      {submitted && (
        <div className="success-message">
          ✓ Discharge summary saved successfully!
        </div>
      )}

      <div className="patient-header">
        <h3>
          {patient.firstName} {patient.lastName}
        </h3>
        <p>Patient ID: {patient.id}</p>
        {ipdRegistration && (
          <p>IPD Registration: {ipdRegistration.registrationNumber}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="discharge-form">
        {/* Discharge Details */}
        <fieldset>
          <legend>Discharge Information</legend>

          <div className="form-row">
            <div className="form-group">
              <label>Discharge Date</label>
              <input
                type="date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Discharge Time</label>
              <input
                type="time"
                name="dischargeTime"
                value={formData.dischargeTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Patient Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option>Improved</option>
                <option>Stable</option>
                <option>Against Medical Advice</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Medical Information */}
        <fieldset>
          <legend>Medical Information</legend>

          <div className="form-group">
            <label>Primary Diagnosis *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className={errors.diagnosis ? 'error' : ''}
              placeholder="Enter primary diagnosis..."
              rows="3"
            />
            {errors.diagnosis && <span className="error-text">{errors.diagnosis}</span>}
          </div>

          <div className="form-group">
            <label>Treatment Provided *</label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              className={errors.treatment ? 'error' : ''}
              placeholder="Describe treatment provided during admission..."
              rows="3"
            />
            {errors.treatment && <span className="error-text">{errors.treatment}</span>}
          </div>

          <div className="form-group">
            <label>Medications/Prescriptions *</label>
            <textarea
              name="medicines"
              value={formData.medicines}
              onChange={handleChange}
              className={errors.medicines ? 'error' : ''}
              placeholder="List medications prescribed and dosage..."
              rows="3"
            />
            {errors.medicines && <span className="error-text">{errors.medicines}</span>}
          </div>
        </fieldset>

        {/* Post-Discharge Instructions */}
        <fieldset>
          <legend>Post-Discharge Instructions</legend>

          <div className="form-row">
            <div className="form-group">
              <label>Follow-up Date *</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className={errors.followUpDate ? 'error' : ''}
              />
              {errors.followUpDate && <span className="error-text">{errors.followUpDate}</span>}
            </div>

            <div className="form-group">
              <label>Activity Restrictions *</label>
              <input
                type="text"
                name="restrictions"
                value={formData.restrictions}
                onChange={handleChange}
                className={errors.restrictions ? 'error' : ''}
                placeholder="e.g., No heavy lifting for 2 weeks"
              />
              {errors.restrictions && <span className="error-text">{errors.restrictions}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Additional Notes/Instructions</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional instructions for the patient..."
              rows="3"
            />
          </div>
        </fieldset>

        {/* Doctor Signature */}
        <fieldset>
          <legend>Doctor Signature</legend>

          <div className="form-group">
            <label>Doctor Name & Signature</label>
            <input
              type="text"
              name="doctorSignature"
              value={formData.doctorSignature}
              onChange={handleChange}
              placeholder="Dr. [Name]"
            />
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save & Generate Discharge Summary
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DischargeSummary;
