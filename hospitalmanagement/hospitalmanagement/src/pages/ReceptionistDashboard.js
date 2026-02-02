import React, { useState, useEffect } from 'react';
import '../styles/ReceptionistDashboard.css';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';

const ReceptionistDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointmentCounts, setAppointmentCounts] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
    loadAppointments();
  }, []);

  const loadDoctors = () => {
    try {
      const allDoctors = doctorService.getDoctorList() || [];
      setDoctors(allDoctors);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  };

  const loadAppointments = () => {
    try {
      const allAppointments = appointmentService.getAppointmentList() || [];
      
      // Calculate appointment counts per doctor
      const counts = {};
      allDoctors.forEach((doctor) => {
        counts[doctor.id] = allAppointments.filter(
          (apt) => apt.doctorId === doctor.id
        ).length;
      });
      setAppointmentCounts(counts);

      // Get upcoming appointments (today onwards)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = allAppointments
        .filter((apt) => new Date(apt.appointmentDate) >= today)
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 10); // Limit to 10 upcoming appointments

      setUpcomingAppointments(upcoming);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const getDoctorSpecialization = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.specialization : 'N/A';
  };

  const getPatientName = (appointmentId) => {
    try {
      const patients = JSON.parse(localStorage.getItem('hms_patients_v1') || '[]');
      const appointment = upcomingAppointments.find((a) => a.id === appointmentId);
      if (appointment) {
        const patient = patients.find((p) => p.id === appointment.patientId);
        return patient ? patient.name : 'Unknown Patient';
      }
    } catch (err) {
      console.error('Error getting patient name:', err);
    }
    return 'Unknown Patient';
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      loadDoctors();
      loadAppointments();
      setLoading(false);
    }, 500);
  };

  const getDoctorStats = () => {
    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: appointmentCounts[doctor.id] || 0,
    }));
  };

  const getTotalAppointments = () => {
    return Object.values(appointmentCounts).reduce((a, b) => a + b, 0);
  };

  const stats = getDoctorStats();
  const totalAppointments = getTotalAppointments();
  const busyDoctor = stats.length > 0 ? stats.reduce((a, b) => a.appointmentCount > b.appointmentCount ? a : b) : null;

  return (
    <div className="receptionist-dashboard">
      <h1>Receptionist Dashboard</h1>
      <p className="subtitle">Doctor Appointments & Availability</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3>Total Doctors</h3>
            <p className="stat-number">{doctors.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total Appointments</h3>
            <p className="stat-number">{totalAppointments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Upcoming (Today+)</h3>
            <p className="stat-number">{upcomingAppointments.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Busiest Doctor</h3>
            <p className="stat-number">{busyDoctor ? busyDoctor.appointmentCount : 0}</p>
            <p className="stat-subtext">{busyDoctor ? busyDoctor.name : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Doctor Appointments Count Table */}
      <div className="doctors-section">
        <div className="section-header">
          <h2>Doctor Appointment Summary</h2>
          <button className="btn-refresh" onClick={handleRefresh} disabled={loading}>
            {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
        </div>

        <div className="doctors-grid">
          {stats.map((doctor) => (
            <div
              key={doctor.id}
              className={`doctor-card ${selectedDoctorId === doctor.id ? 'selected' : ''}`}
              onClick={() => setSelectedDoctorId(selectedDoctorId === doctor.id ? null : doctor.id)}
            >
              <div className="doctor-header">
                <div className="doctor-avatar">👨‍⚕️</div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                </div>
              </div>

              <div className="appointment-count">
                <span className="count-label">Appointments:</span>
                <span className={`count-number ${doctor.appointmentCount > 5 ? 'high' : doctor.appointmentCount > 2 ? 'medium' : 'low'}`}>
                  {doctor.appointmentCount}
                </span>
              </div>

              <div className="availability">
                <span className="availability-label">Availability:</span>
                <span className="availability-text">{doctor.availability || 'N/A'}</span>
              </div>

              {doctor.email && (
                <div className="contact">
                  <span className="contact-label">📧</span>
                  <span className="contact-text">{doctor.email}</span>
                </div>
              )}

              {doctor.phone && (
                <div className="contact">
                  <span className="contact-label">📱</span>
                  <span className="contact-text">{doctor.phone}</span>
                </div>
              )}

              {doctor.appointmentCount === 0 && (
                <div className="available-badge">Available Now</div>
              )}
            </div>
          ))}
        </div>

        {stats.length === 0 && (
          <div className="empty-state">
            <p>No doctors found. Please add doctors first.</p>
          </div>
        )}
      </div>

      {/* Upcoming Appointments Section */}
      <div className="appointments-section">
        <div className="section-header">
          <h2>Upcoming Appointments (Next 10)</h2>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="appointments-list">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Patient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => {
                  const appointmentDateTime = new Date(appointment.appointmentDate);
                  const now = new Date();
                  const status = appointmentDateTime < now ? 'Completed' : 'Upcoming';

                  return (
                    <tr key={appointment.id}>
                      <td className="date-time">
                        {appointmentDateTime.toLocaleDateString()} {appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="doctor">{getDoctorName(appointment.doctorId)}</td>
                      <td className="specialization">{getDoctorSpecialization(appointment.doctorId)}</td>
                      <td className="patient">{getPatientName(appointment.id)}</td>
                      <td>
                        <span className={`status-badge status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No upcoming appointments scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
