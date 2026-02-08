import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/IPDPage.css';
import IPDDetailView from '../components/IPD/IPDDetailView';

const IPDPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const ipdRecords = ctx.ipdRecords || [];
  const opdRecords = ctx.opdRecords || []; // Fetch OPD records
  const addIPDRecord = ctx.addIPDRecord || (() => { });
  const WARD_TYPES = ['General Ward', 'ICU', 'HDU', 'Private Ward', 'Pediatric Ward', 'Maternity Ward'];
  const wards = ctx.wards || [];
  const doctors = ctx.doctors || [];

  // Extract unique OPD patients
  const uniqueOpdPatients = useMemo(() => {
    const patients = [];
    const seen = new Set();
    opdRecords.forEach(r => {
      if (!seen.has(r.patientName)) {
        seen.add(r.patientName);
        patients.push({ name: r.patientName, id: r.patientId });
      }
    });
    return patients;
  }, [opdRecords]);

  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    admissionDate: '',
    ward: '',
    bedNumber: '',
    diagnosis: '',
    doctorName: '',
    status: 'Active',
  });

  const [expandedRecord, setExpandedRecord] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientChange = (e) => {
    const selectedName = e.target.value;
    const patient = uniqueOpdPatients.find(p => p.name === selectedName);
    setForm(prev => ({
      ...prev,
      patientName: selectedName,
      patientId: patient ? patient.id : '' // Auto-fill ID
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.patientName && form.patientId && form.admissionDate) {
      addIPDRecord({
        id: Date.now(),
        ...form,
        admissionDays: Math.floor((new Date() - new Date(form.admissionDate)) / (1000 * 60 * 60 * 24)),
      });
      setForm({
        patientName: '',
        patientId: '',
        admissionDate: '',
        ward: '',
        bedNumber: '',
        diagnosis: '',
        doctorName: '',
        status: 'Active',
      });
    }
  };

  const ipdStats = useMemo(() => {
    return {
      totalPatients: ipdRecords.length,
      activePatients: ipdRecords.filter(r => r.status === 'Active').length,
      dischargedToday: ipdRecords.filter(r => r.status === 'Discharged').length,
      averageStay: ipdRecords.length > 0
        ? (ipdRecords.reduce((sum, r) => sum + (r.admissionDays || 0), 0) / ipdRecords.length).toFixed(1)
        : 0,
    };
  }, [ipdRecords]);

  const handleViewDetails = (record) => {
    setExpandedRecord(null); // Close expanded small view
    setSelectedPatient(record);
  };

  const [selectedPatient, setSelectedPatient] = useState(null);

  if (selectedPatient) {
    return <IPDDetailView ipdRecord={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  return (
    <div className="ipd-page fade-in">
      <h1>In-Patient Department (IPD)</h1>

      {/* IPD Statistics */}
      <div className="ipd-stats card">
        <h2>IPD Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Patients</span>
            <span className="stat-value">{ipdStats.totalPatients}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Patients</span>
            <span className="stat-value">{ipdStats.activePatients}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Discharged</span>
            <span className="stat-value">{ipdStats.dischargedToday}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Stay (days)</span>
            <span className="stat-value">{ipdStats.averageStay}</span>
          </div>
        </div>
      </div>

      {/* Add IPD Record Form */}
      <div className="add-ipd-form card">
        <h2>Add IPD Admission Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient Name *</label>
              <select
                name="patientName"
                value={form.patientName}
                onChange={handlePatientChange}
                required
              >
                <option value="">-- Select OPD Patient --</option>
                {uniqueOpdPatients.map(p => (
                  <option key={p.id + p.name} value={p.name}>{p.name} (ID: {p.id})</option>
                ))}
              </select>
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
              <label>Admission Date *</label>
              <input
                type="date"
                name="admissionDate"
                value={form.admissionDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange} required>
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
                <option value="Critical">Critical</option>
                <option value="Recovery">Recovery</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ward Type *</label>
              <select
                name="ward"
                value={form.ward}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Ward Type --</option>
                {WARD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Bed Number</label>
              <input
                type="text"
                name="bedNumber"
                value={form.bedNumber}
                onChange={handleChange}
                placeholder="Bed-10"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Medical condition"
              />
            </div>
            <div className="form-group">
              <label>Attending Doctor</label>
              <select
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={`${d.firstName} ${d.lastName}`}>
                    Dr. {d.firstName} {d.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Add IPD Record</button>
        </form>
      </div>

      {/* IPD Records List */}
      <div className="ipd-records card">
        <h2>IPD Records ({ipdRecords.length})</h2>
        <div className="records-table">
          {ipdRecords.length > 0 ? (
            ipdRecords.map((record, idx) => (
              <div key={record.id} className="record-item" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="record-header">
                  <h4>{record.patientName}</h4>
                  <span className={`status ${record.status?.toLowerCase()}`}>{record.status}</span>
                </div>

                <div className="record-details">
                  <p><strong>Patient ID:</strong> {record.patientId}</p>
                  <p><strong>Admission Date:</strong> {record.admissionDate}</p>
                  <p><strong>Days in IPD:</strong> {record.admissionDays || 0}</p>
                  {record.ward && <p><strong>Ward:</strong> {record.ward}</p>}
                  {record.bedNumber && <p><strong>Bed:</strong> {record.bedNumber}</p>}
                </div>

                <button
                  className="btn btn-primary btn-small"
                  onClick={() => handleViewDetails(record)}
                >
                  Manage Patient
                </button>
              </div>
            ))
          ) : (
            <p className="no-data">No IPD records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPDPage;
