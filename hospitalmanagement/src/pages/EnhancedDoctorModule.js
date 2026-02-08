import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/EnhancedDoctorModule.css';

const SPECIALIZATIONS = ['Cardiology', 'Neurology', 'Orthopedics', 'General', 'Pediatrics', 'ENT', 'Dermatology', 'Gynecology'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EnhancedDoctorModule = () => {
  const ctx = useContext(HospitalContext) || {};
  const doctors = ctx.doctors || [];
  const addDoctor = ctx.addDoctor || (() => { });

  const [activeTab, setActiveTab] = useState('list');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualifications: '',
    experience: '',
    registrationNumber: '',
    consultationFee: '',
  });

  const [schedules, setSchedules] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.specialization) {
      // Split name into first and last name
      const nameParts = form.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '.'; // Default last name if missing

      const doctorData = {
        doctorId: `DOC-${Date.now()}`,
        firstName: firstName,
        lastName: lastName,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,
        qualifications: form.qualifications,
        department: form.specialization, // Use specialization as department
        yearsOfExperience: form.experience ? parseInt(form.experience) : 0,
        licenseNumber: form.registrationNumber,
        availabilityStatus: 'available',
        consultationFee: form.consultationFee
      };

      addDoctor(doctorData)
        .then(() => {
          setForm({
            name: '',
            email: '',
            phone: '',
            specialization: '',
            qualifications: '',
            experience: '',
            registrationNumber: '',
            consultationFee: '',
          });
          setSchedules({});
          setActiveTab('list');
        })
        .catch(err => {
          console.error("Failed to add doctor", err);
          alert("Failed to add doctor. Please try again.");
        });
    }
  };

  const handleScheduleChange = (day, timeSlot) => {
    setSchedules(prev => ({
      ...prev,
      [day]: prev[day] === timeSlot ? null : timeSlot,
    }));
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

  const doctorStats = useMemo(() => {
    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter(d => d.status === 'Active').length,
      specializations: new Set(doctors.map(d => d.specialization)).size,
      totalAppointments: doctors.reduce((sum, d) => sum + (d.appointments || 0), 0),
    };
  }, [doctors]);

  return (
    <div className="doctor-module fade-in">
      <h1>Doctor Management System</h1>

      {/* Statistics */}
      <div className="doctor-stats card">
        <h2>Doctor Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Doctors</span>
            <span className="stat-value">{doctorStats.totalDoctors}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Doctors</span>
            <span className="stat-value">{doctorStats.activeDoctors}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Specializations</span>
            <span className="stat-value">{doctorStats.specializations}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Appointments</span>
            <span className="stat-value">{doctorStats.totalAppointments}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-navigation card">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Doctor List
        </button>
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('form');
            setForm({
              name: '',
              email: '',
              phone: '',
              specialization: '',
              qualifications: '',
              experience: '',
              registrationNumber: '',
              consultationFee: '',
            });
            setSchedules({});
          }}
        >
          Add Doctor
        </button>
      </div>

      {/* Form Tab */}
      {activeTab === 'form' && (
        <div className="form-section card">
          <h2>Register New Doctor</h2>
          <form onSubmit={handleSubmit} className="doctor-form">
            <div className="form-row">
              <div className="form-group">
                <label>Doctor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Dr. Full Name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <select name="specialization" value={form.specialization} onChange={handleInputChange} required>
                  <option value="">-- Select Specialization --</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="MCI/NMC Registration"
                />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleInputChange}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={form.consultationFee}
                  onChange={handleInputChange}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Qualifications</label>
              <textarea
                name="qualifications"
                value={form.qualifications}
                onChange={handleInputChange}
                placeholder="MBBS, MD, etc."
                rows="2"
              />
            </div>

            <div className="schedule-section">
              <h3>Availability Schedule</h3>
              <div className="schedule-grid">
                {DAYS.map(day => (
                  <div key={day} className="schedule-day">
                    <label>{day}</label>
                    <div className="time-slots">
                      <button
                        type="button"
                        className={`time-slot ${schedules[day] === 'Morning' ? 'active' : ''}`}
                        onClick={() => handleScheduleChange(day, 'Morning')}
                      >
                        9AM-1PM
                      </button>
                      <button
                        type="button"
                        className={`time-slot ${schedules[day] === 'Evening' ? 'active' : ''}`}
                        onClick={() => handleScheduleChange(day, 'Evening')}
                      >
                        3PM-7PM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Register Doctor</button>
          </form>
        </div>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="list-section card">
          <div className="list-header">
            <h2>Doctors ({filteredDoctors.length})</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, specialization, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="doctors-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, idx) => (
                <div key={doctor.id} className="doctor-card" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="doctor-header">
                    <h4>{doctor.name}</h4>
                    <span className={`status ${doctor.status?.toLowerCase()}`}>{doctor.status}</span>
                  </div>

                  <div className="doctor-details">
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    {doctor.phone && <p><strong>Phone:</strong> {doctor.phone}</p>}
                    {doctor.experience && <p><strong>Experience:</strong> {doctor.experience} years</p>}
                    {doctor.consultationFee && <p><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>}
                  </div>

                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => setSelectedDoctor(selectedDoctor?.id === doctor.id ? null : doctor)}
                  >
                    {selectedDoctor?.id === doctor.id ? 'Hide' : 'View Details'}
                  </button>

                  {selectedDoctor?.id === doctor.id && (
                    <div className="doctor-expanded">
                      {doctor.registrationNumber && (
                        <p><strong>Registration:</strong> {doctor.registrationNumber}</p>
                      )}
                      {doctor.qualifications && (
                        <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                      )}
                      {doctor.availability && Object.keys(doctor.availability).length > 0 && (
                        <div>
                          <strong>Schedule:</strong>
                          <div className="schedule-display">
                            {Object.entries(doctor.availability).map(([day, slot]) => (
                              <p key={day}>{day}: {slot}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No doctors found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDoctorModule;
