import React, { useContext, useState, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/AppointmentsPage.css';

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function AppointmentsPage() {
  const { doctors, patients, appointments, addAppointment } = useContext(HospitalContext);
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: selectedDate,
    time: '09:00',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => (doctorFilter === 'all' ? true : String(a.doctorId) === String(doctorFilter)));
  }, [appointments, doctorFilter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Prepare appointment data matching backend expectations
      const appointmentData = {
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId),
        appointmentDate: `${form.appointmentDate}T${form.time}:00`,
        reason: form.reason,
        status: 'scheduled'
      };

      // Use the context's addAppointment function
      await addAppointment(appointmentData);

      setSuccess('Appointment booked successfully!');

      // Reset form
      setForm({
        patientId: '',
        doctorId: '',
        appointmentDate: selectedDate,
        time: '09:00',
        reason: ''
      });
    } catch (err) {
      console.error('Appointment booking error:', err);
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    }
  };

  const appointmentsForDay = appointments.filter(a => {
    const apptDate = a.appointmentDate ? a.appointmentDate.split('T')[0] : a.date;
    return apptDate === selectedDate && (doctorFilter === 'all' ? true : String(a.doctorId) === String(doctorFilter));
  });

  // Simple month grid for calendar view
  const today = new Date(selectedDate);
  const month = today.getMonth();
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let week = new Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }

  return (
    <div className="appointments-page fade-in">
      <h1>Appointments Management</h1>

      <div className="appointments-container">
        {/* Book Appointment Form */}
        <div className="appointment-form card">
          <h2>Book New Appointment</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleBook}>
            <div className="form-group">
              <label>Select Patient *</label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Patient --</option>
                {patients && patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} (ID: {p.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Doctor *</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors && doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName} {d.specialization ? `— ${d.specialization}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={(e) => { handleChange(e); setSelectedDate(e.target.value); }}
                required
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Reason for Visit</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter reason for visit"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">Book Appointment</button>
          </form>
        </div>

        {/* Doctors List */}
        <div className="doctors-list card">
          <h2>Available Doctors</h2>
          <div className="doctors-grid">
            {doctors && doctors.length > 0 ? (
              doctors.map((doc, idx) => (
                <div key={doc.id} className="doctor-card" style={{ animationDelay: `${idx * 50}ms` }}>
                  <h3>{doc.firstName} {doc.lastName}</h3>
                  <p className="specialty">{doc.specialization || 'General'}</p>
                </div>
              ))
            ) : (
              <p className="empty-state">No doctors available</p>
            )}
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-list card">
          <h2>Scheduled Appointments ({appointments.length})</h2>
          {appointments.length === 0 ? (
            <p className="empty-state">No appointments scheduled yet.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => {
                    const apptDate = a.appointmentDate || a.date || '';
                    const dateOnly = apptDate.split('T')[0];
                    const timeOnly = apptDate.includes('T') ? apptDate.split('T')[1].substring(0, 5) : (a.time || '--');

                    return (
                      <tr key={a.id} className="fade-in">
                        <td>{a.patientFirstName} {a.patientLastName}</td>
                        <td>{a.doctorFirstName} {a.doctorLastName}</td>
                        <td>{dateOnly}</td>
                        <td>{timeOnly}</td>
                        <td>{a.reason || '--'}</td>
                        <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentsPage;
