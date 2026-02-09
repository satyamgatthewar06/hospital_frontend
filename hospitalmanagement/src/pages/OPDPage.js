import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/OPDPage.css';

const OPD_DEPARTMENTS = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'ENT', 'General Medicine', 'Pediatrics'];

const OPDPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const opdRecords = ctx.opdRecords || [];
  const doctors = ctx.doctors || [];
  const addOPDRecord = ctx.addOPDRecord || (() => { });

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
    <div className="opd-page fade-in container-fluid px-3 px-md-4">
      <h1 className="mb-4">Out-Patient Department (OPD)</h1>

      {/* OPD Statistics */}
      <div className="opd-stats card mb-4">
        <h2 className="mb-3">OPD Overview</h2>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="stat-item">
              <span className="stat-label d-block">Total Visits</span>
              <span className="stat-value d-block">{opdStats.totalVisits}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-item">
              <span className="stat-label d-block">Today's Visits</span>
              <span className="stat-value d-block">{opdStats.todayVisits}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-item">
              <span className="stat-label d-block">Completed</span>
              <span className="stat-value d-block">{opdStats.completedVisits}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-item">
              <span className="stat-label d-block">Total Revenue</span>
              <span className="stat-value d-block">₹{opdStats.totalRevenue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add OPD Record Form */}
      <div className="add-opd-form card mb-4">
        <h2 className="mb-3">Register OPD Visit</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  className="form-control"
                  value={form.patientName}
                  onChange={handleChange}
                  placeholder="Patient full name"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Patient ID *</label>
                <input
                  type="text"
                  name="patientId"
                  className="form-control"
                  value={form.patientId}
                  onChange={handleChange}
                  placeholder="P-12345"
                  required
                />
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Visit Date *</label>
                <input
                  type="date"
                  name="visitDate"
                  className="form-control"
                  value={form.visitDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" className="form-select" value={form.department} onChange={handleChange}>
                  <option value="">-- Select Department --</option>
                  {OPD_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Consulting Doctor</label>
                <select
                  name="doctorName"
                  className="form-select"
                  value={form.doctorName}
                  onChange={handleChange}
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={`${doc.firstName} ${doc.lastName}`}>
                      {doc.firstName} {doc.lastName} {doc.specialization ? `(${doc.specialization})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="consultationFee"
                  className="form-control"
                  value={form.consultationFee}
                  onChange={handleChange}
                  placeholder="500"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-group">
              <label className="form-label">Symptoms/Chief Complaint</label>
              <textarea
                name="symptoms"
                className="form-control"
                value={form.symptoms}
                onChange={handleChange}
                placeholder="Patient symptoms"
                rows="2"
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  className="form-control"
                  value={form.diagnosis}
                  onChange={handleChange}
                  placeholder="Medical diagnosis"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Referred">Referred</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-group">
              <label className="form-label">Treatment/Prescription</label>
              <textarea
                name="treatment"
                className="form-control"
                value={form.treatment}
                onChange={handleChange}
                placeholder="Treatment plan and medicines"
                rows="3"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 w-md-auto">Register Visit</button>
        </form>
      </div>

      {/* OPD Records List */}
      <div className="opd-records card mb-4">
        <h2 className="mb-3">OPD Records ({opdRecords.length})</h2>
        <div className="row g-3">
          {opdRecords.length > 0 ? (
            opdRecords.map((record, idx) => (
              <div key={record.id} className="col-12 col-md-6 col-lg-4" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="record-card h-100">
                  <div className="record-header d-flex justify-content-between align-items-start mb-2">
                    <h4 className="mb-0">{record.patientName}</h4>
                    <span className={`status badge ${record.status?.toLowerCase()}`}>{record.status}</span>
                  </div>

                  <div className="record-details mb-3">
                    <p className="mb-1"><strong>Patient ID:</strong> {record.patientId}</p>
                    <p className="mb-1"><strong>Visit Date:</strong> {record.visitDate}</p>
                    {record.department && <p className="mb-1"><strong>Department:</strong> {record.department}</p>}
                    {record.consultationFee && <p className="mb-1"><strong>Fee:</strong> ₹{record.consultationFee}</p>}
                  </div>

                  <button
                    className="btn btn-secondary btn-small w-100"
                    onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                  >
                    {expandedRecord === record.id ? 'Hide Details' : 'View Details'}
                  </button>

                  {expandedRecord === record.id && (
                    <div className="record-expanded mt-3">
                      {record.doctorName && <p className="mb-1"><strong>Doctor:</strong> {record.doctorName}</p>}
                      {record.symptoms && <p className="mb-1"><strong>Symptoms:</strong> {record.symptoms}</p>}
                      {record.diagnosis && <p className="mb-1"><strong>Diagnosis:</strong> {record.diagnosis}</p>}
                      {record.treatment && <p className="mb-1"><strong>Treatment:</strong> {record.treatment}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="no-data text-center">No OPD records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OPDPage;
