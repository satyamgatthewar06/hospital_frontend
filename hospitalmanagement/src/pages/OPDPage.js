import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/OPDPage.css';

const OPD_DEPARTMENTS = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'ENT', 'General Medicine', 'Pediatrics'];

const OPDPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const opdRecords = ctx.opdRecords || [];
  const addOPDRecord = ctx.addOPDRecord || (() => {});

  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    visitDate: '',
    department: '',
    doctorName: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    consultationFee: '',
    status: 'Completed',
  });

  const [expandedRecord, setExpandedRecord] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.patientName && form.patientId && form.visitDate) {
      addOPDRecord({
        id: Date.now(),
        ...form,
      });
      setForm({
        patientName: '',
        patientId: '',
        visitDate: '',
        department: '',
        doctorName: '',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        consultationFee: '',
        status: 'Completed',
      });
    }
  };

  const opdStats = useMemo(() => {
    return {
      totalVisits: opdRecords.length,
      todayVisits: opdRecords.filter(r => r.visitDate === new Date().toISOString().split('T')[0]).length,
      completedVisits: opdRecords.filter(r => r.status === 'Completed').length,
      totalRevenue: opdRecords.reduce((sum, r) => sum + (parseInt(r.consultationFee) || 0), 0),
    };
  }, [opdRecords]);

  return (
    <div className="opd-page fade-in">
      <h1>Out-Patient Department (OPD)</h1>

      {/* OPD Statistics */}
      <div className="opd-stats card">
        <h2>OPD Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Visits</span>
            <span className="stat-value">{opdStats.totalVisits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Today's Visits</span>
            <span className="stat-value">{opdStats.todayVisits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{opdStats.completedVisits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{opdStats.totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Add OPD Record Form */}
      <div className="add-opd-form card">
        <h2>Register OPD Visit</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Patient full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Patient ID *</label>
              <input
                type="text"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                placeholder="P-12345"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Visit Date *</label>
              <input
                type="date"
                name="visitDate"
                value={form.visitDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange}>
                <option value="">-- Select Department --</option>
                {OPD_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Consulting Doctor</label>
              <input
                type="text"
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                placeholder="Dr. Name"
              />
            </div>
            <div className="form-group">
              <label>Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                value={form.consultationFee}
                onChange={handleChange}
                placeholder="500"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Symptoms/Chief Complaint</label>
            <textarea
              name="symptoms"
              value={form.symptoms}
              onChange={handleChange}
              placeholder="Patient symptoms"
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Medical diagnosis"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Referred">Referred</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Treatment/Prescription</label>
            <textarea
              name="treatment"
              value={form.treatment}
              onChange={handleChange}
              placeholder="Treatment plan and medicines"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">Register Visit</button>
        </form>
      </div>

      {/* OPD Records List */}
      <div className="opd-records card">
        <h2>OPD Records ({opdRecords.length})</h2>
        <div className="records-grid">
          {opdRecords.length > 0 ? (
            opdRecords.map((record, idx) => (
              <div key={record.id} className="record-card" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="record-header">
                  <h4>{record.patientName}</h4>
                  <span className={`status ${record.status?.toLowerCase()}`}>{record.status}</span>
                </div>

                <div className="record-details">
                  <p><strong>Patient ID:</strong> {record.patientId}</p>
                  <p><strong>Visit Date:</strong> {record.visitDate}</p>
                  {record.department && <p><strong>Department:</strong> {record.department}</p>}
                  {record.consultationFee && <p><strong>Fee:</strong> ₹{record.consultationFee}</p>}
                </div>

                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                >
                  {expandedRecord === record.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedRecord === record.id && (
                  <div className="record-expanded">
                    {record.doctorName && <p><strong>Doctor:</strong> {record.doctorName}</p>}
                    {record.symptoms && <p><strong>Symptoms:</strong> {record.symptoms}</p>}
                    {record.diagnosis && <p><strong>Diagnosis:</strong> {record.diagnosis}</p>}
                    {record.treatment && <p><strong>Treatment:</strong> {record.treatment}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No OPD records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OPDPage;
