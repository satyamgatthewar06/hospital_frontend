import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/EnhancedPatientManagement.css';

const EnhancedPatientManagement = () => {
  const ctx = useContext(HospitalContext) || {};
  const patients = ctx.patients || [];
  const addPatient = ctx.addPatient || (() => {});
  const updatePatient = ctx.updatePatient || (() => {});

  const [activeTab, setActiveTab] = useState('list');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    registrationDate: new Date().toISOString().split('T')[0],
  });

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.phone) {
      if (editingPatient) {
        updatePatient(editingPatient.id, form);
        setEditingPatient(null);
      } else {
        addPatient({
          id: Date.now(),
          ...form,
          status: 'Active',
          visits: [],
          discharges: [],
        });
      }
      setForm({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        bloodGroup: '',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        allergies: '',
        registrationDate: new Date().toISOString().split('T')[0],
      });
      setActiveTab('list');
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setForm(patient);
    setActiveTab('form');
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const patientStats = useMemo(() => {
    return {
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status === 'Active').length,
      totalVisits: patients.reduce((sum, p) => sum + (p.visits?.length || 0), 0),
      dischargedToday: patients.filter(p => p.status === 'Discharged').length,
    };
  }, [patients]);

  return (
    <div className="enhanced-patient-page fade-in">
      <h1>Patient Management System</h1>

      {/* Statistics */}
      <div className="patient-stats card">
        <h2>Patient Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Patients</span>
            <span className="stat-value">{patientStats.totalPatients}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Patients</span>
            <span className="stat-value">{patientStats.activePatients}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Visits</span>
            <span className="stat-value">{patientStats.totalVisits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Discharged</span>
            <span className="stat-value">{patientStats.dischargedToday}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation card">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Patient List
        </button>
        <button 
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('form');
            setEditingPatient(null);
            setForm({
              name: '',
              email: '',
              phone: '',
              age: '',
              gender: '',
              bloodGroup: '',
              address: '',
              emergencyContact: '',
              medicalHistory: '',
              allergies: '',
              registrationDate: new Date().toISOString().split('T')[0],
            });
          }}
        >
          {editingPatient ? 'Edit Patient' : 'Register Patient'}
        </button>
      </div>

      {/* Form Tab */}
      {activeTab === 'form' && (
        <div className="form-section card">
          <h2>{editingPatient ? 'Edit Patient Information' : 'Register New Patient'}</h2>
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleInputChange}>
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleInputChange}>
                  <option value="">-- Select Blood Group --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Full residential address"
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Emergency contact number"
                />
              </div>
              <div className="form-group">
                <label>Registration Date</label>
                <input
                  type="date"
                  name="registrationDate"
                  value={form.registrationDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={form.medicalHistory}
                onChange={handleInputChange}
                placeholder="Previous surgeries, chronic conditions, etc."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Allergies</label>
              <textarea
                name="allergies"
                value={form.allergies}
                onChange={handleInputChange}
                placeholder="Known allergies to medicines, food, etc."
                rows="2"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingPatient ? 'Update Patient' : 'Register Patient'}
              </button>
              {editingPatient && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingPatient(null);
                    setActiveTab('list');
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="list-section card">
          <div className="list-header">
            <h2>Registered Patients ({filteredPatients.length})</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="patients-grid">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, idx) => (
                <div key={patient.id} className="patient-card" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="patient-header">
                    <h4>{patient.name}</h4>
                    <span className={`status ${patient.status?.toLowerCase()}`}>{patient.status}</span>
                  </div>

                  <div className="patient-details">
                    <p><strong>Phone:</strong> {patient.phone}</p>
                    {patient.email && <p><strong>Email:</strong> {patient.email}</p>}
                    {patient.age && <p><strong>Age:</strong> {patient.age}</p>}
                    {patient.bloodGroup && <p><strong>Blood:</strong> {patient.bloodGroup}</p>}
                    <p><strong>Registered:</strong> {patient.registrationDate}</p>
                  </div>

                  <div className="patient-actions">
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                    >
                      {selectedPatient?.id === patient.id ? 'Hide' : 'View Details'}
                    </button>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleEditPatient(patient)}
                    >
                      Edit
                    </button>
                  </div>

                  {selectedPatient?.id === patient.id && (
                    <div className="patient-expanded">
                      {patient.address && (
                        <div className="detail-row">
                          <strong>Address:</strong>
                          <p>{patient.address}</p>
                        </div>
                      )}
                      {patient.emergencyContact && (
                        <div className="detail-row">
                          <strong>Emergency Contact:</strong>
                          <p>{patient.emergencyContact}</p>
                        </div>
                      )}
                      {patient.medicalHistory && (
                        <div className="detail-row">
                          <strong>Medical History:</strong>
                          <p>{patient.medicalHistory}</p>
                        </div>
                      )}
                      {patient.allergies && (
                        <div className="detail-row">
                          <strong>Allergies:</strong>
                          <p>{patient.allergies}</p>
                        </div>
                      )}
                      {patient.visits && patient.visits.length > 0 && (
                        <div className="detail-row">
                          <strong>Visit History:</strong>
                          <div className="visits-list">
                            {patient.visits.map((visit, i) => (
                              <div key={i} className="visit-item">
                                <p>{visit.date} - {visit.type}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No patients found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPatientManagement;
