import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/PatientManagement.css';

const DOCTORS = [
  { id: 1, name: 'Dr. P V Gadewar', specialty: 'Gynecology' },
  { id: 2, name: 'Dr. P G Gadewar', specialty: 'Orthopedics' },
  { id: 3, name: 'Dr. Rahul Kotalwar', specialty: 'General Physician' },
  { id: 4, name: 'Dr. Satyam Kalambkar', specialty: 'General Surgery' },
  { id: 5, name: 'Dr. Rajesh Tagadpallewar', specialty: 'Anesthesia' },
  { id: 6, name: 'Dr. Sumeet Amilkanthawar', specialty: 'Anesthesia' },
];

const PatientManagement = () => {
  const { patients, addPatient } = useContext(HospitalContext) || { patients: [], addPatient: () => {} };
  const [form, setForm] = useState({ name: '', age: '', gender: '', doctor: '', contact: '', diagnosis: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.age && form.gender && form.doctor) {
      addPatient({
        id: Date.now(),
        ...form,
        dateAdmitted: new Date().toLocaleDateString(),
      });
      setForm({ name: '', age: '', gender: '', doctor: '', contact: '', diagnosis: '' });
    }
  };

  // Calculate patient statistics
  const stats = useMemo(() => {
    const byDoctor = {};
    DOCTORS.forEach(doc => {
      byDoctor[doc.id] = {
        name: doc.name,
        specialty: doc.specialty,
        count: patients.filter(p => p.doctor === doc.name).length,
      };
    });
    return byDoctor;
  }, [patients]);

  const totalPatients = patients.length;
  const maxPatients = Math.max(...Object.values(stats).map(s => s.count), 1);

  return (
    <div className="patient-management fade-in">
      <h1>Patient Management</h1>

      {/* Dashboard Stats */}
      <div className="dashboard-stats card">
        <h2>Patient Statistics</h2>
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-label">Total Patients</span>
            <span className="stat-value">{totalPatients}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Doctors</span>
            <span className="stat-value">{DOCTORS.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg. per Doctor</span>
            <span className="stat-value">{(totalPatients / DOCTORS.length).toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Doctor Patient Distribution Chart */}
      <div className="chart-section card">
        <h2>Patients by Doctor</h2>
        <div className="bar-chart">
          {Object.entries(stats).map(([docId, stat], idx) => (
            <div key={docId} className="bar-item" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ 
                    width: `${(stat.count / maxPatients) * 100}%`,
                    animationDelay: `${idx * 80}ms`
                  }}
                >
                  <span className="bar-value">{stat.count}</span>
                </div>
              </div>
              <div className="bar-label">
                <span className="doctor-name">{stat.name}</span>
                <span className="specialty">{stat.specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Patient Form */}
      <div className="add-patient-form card">
        <h2>Add New Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Doctor *</label>
              <select name="doctor" value={form.doctor} onChange={handleChange} required>
                <option value="">-- Select Doctor --</option>
                {DOCTORS.map(doc => (
                  <option key={doc.id} value={doc.name}>{doc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact</label>
              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label>Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Diagnosis"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">Add Patient</button>
        </form>
      </div>

      {/* Patients List */}
      <div className="patients-list card">
        <h2>Registered Patients ({patients.length})</h2>
        {patients.length === 0 ? (
          <p className="empty-state">No patients registered yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Doctor</th>
                  <th>Contact</th>
                  <th>Diagnosis</th>
                  <th>Date Admitted</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id} className="fade-in">
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.doctor}</td>
                    <td>{patient.contact || '--'}</td>
                    <td>{patient.diagnosis || '--'}</td>
                    <td>{patient.dateAdmitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;