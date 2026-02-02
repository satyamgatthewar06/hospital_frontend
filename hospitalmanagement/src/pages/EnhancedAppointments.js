import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/EnhancedAppointments.css';

const EnhancedAppointments = () => {
  const ctx = useContext(HospitalContext) || {};
  const appointments = ctx.appointments || [];
  const doctors = ctx.doctors || [];
  const patients = ctx.patients || [];
  const addAppointment = ctx.addAppointment || (() => {});
  const updateAppointment = ctx.updateAppointment || (() => {});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.patientName && form.doctorName && form.appointmentDate && form.appointmentTime) {
      addAppointment({
        id: Date.now(),
        ...form,
        bookedDate: new Date().toISOString().split('T')[0],
      });
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
                  placeholder="Select or enter patient name"
                  list="patientList"
                  required
                />
                <datalist id="patientList">
                  {patients.map(p => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>Doctor Name *</label>
                <input
                  type="text"
                  name="doctorName"
                  value={form.doctorName}
                  onChange={handleInputChange}
                  placeholder="Select doctor"
                  list="doctorList"
                  required
                />
                <datalist id="doctorList">
                  {doctors.map(d => (
                    <option key={d.id} value={d.name} />
                  ))}
                </datalist>
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
