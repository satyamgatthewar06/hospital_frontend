import React, { useEffect, useState, useContext } from 'react';
import { fetchDoctors } from '../services/doctorService';
import { fetchPatients } from '../services/patientService';
import { fetchAppointments, addAppointment, deleteAppointment, fetchAppointmentsByDoctor } from '../services/appointmentService';
import { AuthContext } from '../context/AuthContext';
import '../styles/AppointmentsPage.css';

const AppointmentsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ doctorId: '', patientId: '', datetime: '', reason: '' });
  const [filterDoctor, setFilterDoctor] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const auth = useContext(AuthContext);
  const isDoctorUser = auth?.user?.role === 'DOCTOR';

  useEffect(() => {
    const load = async () => {
      const d = await fetchDoctors();
      const p = await fetchPatients();
      let a = [];
      if (isDoctorUser) {
        const myDoc = (d || []).find(doc => String(doc.name).trim() === String(auth?.user?.name).trim());
        if (myDoc) {
          a = await fetchAppointmentsByDoctor(myDoc.id);
        } else {
          a = [];
        }
      } else {
        a = await fetchAppointments();
      }

      setDoctors(d || []);
      setPatients(p || []);
      setAppointments(a || []);
    };
    load();
  }, [isDoctorUser, auth]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.doctorId || !form.patientId || !form.datetime) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    const selectedDate = new Date(form.datetime);
    if (selectedDate < new Date()) {
      setErrorMessage('Cannot schedule appointment in the past');
      return;
    }

    const newAppt = await addAppointment(form);
    setAppointments((s) => [newAppt, ...s]);
    setForm({ doctorId: '', patientId: '', datetime: '', reason: '' });
    setShowForm(false);
    setSuccessMessage('✓ Appointment scheduled successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    await deleteAppointment(id);
    setAppointments((s) => s.filter((a) => a.id !== id));
    setSuccessMessage('✓ Appointment cancelled');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Filter and sort appointments
  let filteredAppointments = appointments.filter((a) => {
    const matchDoctor = !filterDoctor || a.doctorId === parseInt(filterDoctor);
    const patientData = patients.find((p) => p.id === a.patientId);
    const patientName = patientData ? `${patientData.firstName} ${patientData.lastName}`.toLowerCase() : '';
    const matchPatient = !searchPatient || patientName.includes(searchPatient.toLowerCase());
    return matchDoctor && matchPatient;
  });

  filteredAppointments.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.datetime) - new Date(b.datetime);
    } else if (sortBy === 'doctor') {
      const docA = doctors.find((d) => d.id === a.doctorId)?.name || '';
      const docB = doctors.find((d) => d.id === b.doctorId)?.name || '';
      return docA.localeCompare(docB);
    }
    return 0;
  });

  const getAppointmentStatus = (appointmentDate) => {
    const now = new Date();
    const apptDate = new Date(appointmentDate);
    const diffHours = (apptDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) return { status: 'Completed', color: 'completed' };
    if (diffHours < 1) return { status: 'Happening Now', color: 'happening' };
    if (diffHours < 24) return { status: 'Today', color: 'today' };
    if (diffHours < 168) return { status: 'This Week', color: 'week' };
    return { status: 'Scheduled', color: 'scheduled' };
  };

  const upcomingCount = filteredAppointments.filter(
    (a) => new Date(a.datetime) > new Date()
  ).length;

  const doctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const patientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>📅 Appointments Management</h1>
        <p className="page-subtitle">Schedule and manage patient appointments</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <div className="appointments-container">
        {/* Schedule New Appointment Form */}
        <div className="form-section">
          <div className="form-header">
            <h2>Schedule New Appointment</h2>
            {!isDoctorUser && (
              <button
                className={`btn-toggle-form ${showForm ? 'active' : ''}`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '✕ Cancel' : '+ New Appointment'}
              </button>
            )}
          </div>

          {showForm && !isDoctorUser && (
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select a doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Patient *</label>
                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select a patient...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={form.datetime}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Reason/Notes</label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Reason for appointment, symptoms, etc."
                    className="form-input"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Schedule Appointment
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ doctorId: '', patientId: '', datetime: '', reason: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">Total Appointments</span>
            <span className="stat-value">{filteredAppointments.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Upcoming</span>
            <span className="stat-value">{upcomingCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{filteredAppointments.length - upcomingCount}</span>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Filter by Doctor:</label>
            <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} className="form-input">
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search Patient:</label>
            <input
              type="text"
              placeholder="Enter patient name..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input">
              <option value="date">Date</option>
              <option value="doctor">Doctor Name</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-list-section">
          <h2>All Appointments</h2>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📋</p>
              <p className="empty-text">No appointments found</p>
              <p className="empty-subtext">
                {appointments.length === 0
                  ? 'Schedule your first appointment to get started'
                  : 'Adjust your filters to see appointments'}
              </p>
            </div>
          ) : (
            <div className="appointments-cards">
              {filteredAppointments.map((appointment) => {
                const statusInfo = getAppointmentStatus(appointment.datetime);
                const doctor = doctors.find((d) => d.id === appointment.doctorId) || {};
                const patient = patients.find((p) => p.id === appointment.patientId) || {};

                return (
                  <div key={appointment.id} className={`appointment-card status-${statusInfo.color}`}>
                    <div className="card-header">
                      <div className="card-title">
                        <h3>{doctorName(appointment.doctorId)}</h3>
                        <p className="specialization">{doctor.specialization}</p>
                      </div>
                      <span className={`status-badge ${statusInfo.color}`}>{statusInfo.status}</span>
                    </div>

                    <div className="card-content">
                      <div className="appointment-detail">
                        <span className="detail-icon">👥</span>
                        <div>
                          <p className="detail-label">Patient</p>
                          <p className="detail-value">{patientName(appointment.patientId)}</p>
                        </div>
                      </div>

                      <div className="appointment-detail">
                        <span className="detail-icon">📅</span>
                        <div>
                          <p className="detail-label">Date & Time</p>
                          <p className="detail-value">
                            {new Date(appointment.datetime).toLocaleDateString()} at{' '}
                            {new Date(appointment.datetime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="appointment-detail">
                          <span className="detail-icon">📝</span>
                          <div>
                            <p className="detail-label">Reason</p>
                            <p className="detail-value">{appointment.reason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      {!isDoctorUser && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleDelete(appointment.id)}
                          title="Cancel appointment"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
