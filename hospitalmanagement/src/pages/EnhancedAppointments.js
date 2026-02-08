import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/EnhancedAppointments.css';

const EnhancedAppointments = () => {
  const ctx = useContext(HospitalContext) || {};
  const appointments = ctx.appointments || [];
  const doctors = ctx.doctors || [];
  const patients = ctx.patients || [];
  const addAppointment = ctx.addAppointment || (() => { });
  const updateAppointment = ctx.updateAppointment || (() => { });

  const [activeTab, setActiveTab] = useState('calendar');
  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    reason: '',
    status: 'Scheduled',
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.patientName && form.doctorId && form.appointmentDate && form.appointmentTime) {

      let finalPatientId = null;

      // 1. Check if patient exists
      const existingPatient = patients.find(p => p.name.toLowerCase() === form.patientName.toLowerCase());

      if (existingPatient) {
        finalPatientId = existingPatient.id;
      } else {
        // 2. Create new patient if not found
        // Backend requires: firstName, lastName, dateOfBirth, gender
        // We will mock these for quick-add in Appointment
        try {
          const newPatientData = {
            name: form.patientName,
            dateOfBirth: '2000-01-01', // Default
            gender: 'Other',          // Default
            phone: '0000000000',      // Default
            address: 'Unknown'        // Default
          };

          // We need addPatient from context. If not available, we fail.
          if (ctx.addPatient) {
            const res = await ctx.addPatient(newPatientData);
            // Result structure might be res.data or res
            finalPatientId = res.id || res.insertId || (res.data ? res.data.id : null);
          } else {
            alert("Configuration Error: Cannot create new patient (addPatient missing).");
            return;
          }
        } catch (err) {
          console.error("Failed to auto-create patient:", err);
          alert("Failed to create new patient record. Please add patient manually first.");
          return;
        }
      }

      const selectedDoctor = doctors.find(d => String(d.id) === String(form.doctorId));

      if (!finalPatientId || !selectedDoctor) {
        alert('Error: Invalid patient or doctor selection.');
        return;
      }

      const appointmentData = {
        appointmentNumber: `APT-${Date.now()}`,
        patientId: finalPatientId, // Use the resolved ID
        doctorId: selectedDoctor.id,
        appointmentDate: `${form.appointmentDate} ${form.appointmentTime}:00`,
        appointmentType: form.department || 'General',
        reason: form.reason || 'Regular Checkup',
        status: form.status || 'Scheduled',
        notes: form.reason
      };

      addAppointment(appointmentData)
        .then(() => {
          setForm({
            patientId: '',
            patientName: '',
            doctorId: '',
            doctorName: '',
            appointmentDate: '',
            appointmentTime: '',
            department: '',
            reason: '',
            status: 'Scheduled',
          });
          setActiveTab('calendar');
        })
        .catch(err => {
          console.error("Failed to book appointment", err);
          alert("Failed to book appointment. Please try again.");
        });
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    updateAppointment(appointmentId, { status: 'Cancelled' });
  };

  const handleReschedule = (appointment) => {
    setForm(appointment);
    setActiveTab('form');
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesDoctor = !filterDoctor || a.doctorName === filterDoctor;
      const matchesDate = !filterDate || a.appointmentDate === filterDate;
      return matchesDoctor && matchesDate;
    });
  }, [appointments, filterDoctor, filterDate]);

  const appointmentStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter(a => a.appointmentDate === today).length,
      scheduledAppointments: appointments.filter(a => a.status === 'Scheduled').length,
      completedAppointments: appointments.filter(a => a.status === 'Completed').length,
      cancelledAppointments: appointments.filter(a => a.status === 'Cancelled').length,
    };
  }, [appointments]);

  return (
    <div className="enhanced-appointments fade-in">
      <h1>Appointment Management System</h1>

      {/* Statistics */}
      <div className="appointment-stats card">
        <h2>Appointment Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Appointments</span>
            <span className="stat-value">{appointmentStats.totalAppointments}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Today's Appointments</span>
            <span className="stat-value">{appointmentStats.todayAppointments}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Scheduled</span>
            <span className="stat-value">{appointmentStats.scheduledAppointments}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{appointmentStats.completedAppointments}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-navigation card">
        <button
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar View
        </button>
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Appointment List
        </button>
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('form');
            setForm({
              patientId: '',
              patientName: '',
              doctorId: '',
              doctorName: '',
              appointmentDate: '',
              appointmentTime: '',
              department: '',
              reason: '',
              status: 'Scheduled',
            });
          }}
        >
          Book Appointment
        </button>
      </div>

      {/* Book Appointment Form */}
      {activeTab === 'form' && (
        <div className="form-section card">
          <h2>Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Doctor Name *</label>
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={(e) => {
                    const docId = e.target.value;
                    const doc = doctors.find(d => String(d.id) === String(docId));
                    setForm(prev => ({
                      ...prev,
                      doctorId: docId,
                      doctorName: doc ? `${doc.firstName} ${doc.lastName}` : ''
                    }));
                  }}
                  required
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.firstName} {d.lastName} {d.specialization ? `(${d.specialization})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Appointment Time *</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={form.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleInputChange}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Appointment</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleInputChange}
                placeholder="Chief complaint or reason"
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary">Book Appointment</button>
          </form>
        </div>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <div className="calendar-section card">
          <h2>Appointment Calendar</h2>
          <div className="calendar-filters">
            <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
              <option value="">All Doctors</option>
              {doctors.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div className="appointments-timeline">
            {filteredAppointments.length > 0 ? (
              filteredAppointments
                .sort((a, b) => new Date(a.appointmentDate + ' ' + a.appointmentTime) - new Date(b.appointmentDate + ' ' + b.appointmentTime))
                .map((apt, idx) => (
                  <div key={apt.id} className="appointment-timeline-item" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="timeline-header">
                      <h4>{apt.patientName} → {apt.doctorName}</h4>
                      <span className={`status ${apt.status?.toLowerCase()}`}>{apt.status}</span>
                    </div>
                    <p><strong>Date & Time:</strong> {apt.appointmentDate} at {apt.appointmentTime}</p>
                    {apt.department && <p><strong>Department:</strong> {apt.department}</p>}
                    {apt.reason && <p><strong>Reason:</strong> {apt.reason}</p>}
                    <div className="appointment-actions">
                      <button className="btn btn-secondary btn-small" onClick={() => handleReschedule(apt)}>Reschedule</button>
                      {apt.status !== 'Cancelled' && (
                        <button className="btn btn-danger btn-small" onClick={() => handleCancelAppointment(apt.id)}>Cancel</button>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="no-data">No appointments found</p>
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {activeTab === 'list' && (
        <div className="list-section card">
          <h2>All Appointments ({filteredAppointments.length})</h2>
          <div className="appointments-list">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt, idx) => (
                <div key={apt.id} className="appointment-item" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="appointment-card">
                    <h4>{apt.patientName}</h4>
                    <p><strong>Doctor:</strong> {apt.doctorName}</p>
                    <p><strong>Date:</strong> {apt.appointmentDate} at {apt.appointmentTime}</p>
                    <span className={`status ${apt.status?.toLowerCase()}`}>{apt.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No appointments found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAppointments;
