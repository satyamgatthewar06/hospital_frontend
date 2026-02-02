import React, { useContext, useState, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/AppointmentsPage.css';

const DOCTORS = [
  { id: 1, name: 'Dr. P V Gadewar', specialty: 'Gynecology' },
  { id: 2, name: 'Dr. P G Gadewar', specialty: 'Orthopedics' },
  { id: 3, name: 'Dr. Rahul Kotalwar', specialty: 'General Physician' },
  { id: 4, name: 'Dr. Satyam Kalambkar', specialty: 'General Surgery' },
  { id: 5, name: 'Dr. Rajesh Tagadpallewar', specialty: 'Anesthesia' },
  { id: 6, name: 'Dr. Sumeet Amilkanthawar', specialty: 'Anesthesia' },
];

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function AppointmentsPage() {
  const { doctors, appointments, setAppointments } = useContext(HospitalContext);
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [form, setForm] = useState({ patientName: '', contact: '', email: '', doctorId: doctors[0]?.id || '', date: selectedDate, time: '09:00', reason: '' });

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => (doctorFilter === 'all' ? true : String(a.doctorId) === String(doctorFilter)));
  }, [appointments, doctorFilter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    const doctor = DOCTORS.find(d => String(d.id) === String(form.doctorId));
    const newAppt = { id: Date.now(), ...form, doctor: doctor?.name || '', doctorId: form.doctorId };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppt)
      });
      if (res.ok) {
        const saved = await res.json();
        setAppointments([ ...appointments, saved ]);
      } else {
        // fallback to local state if server fails
        setAppointments([ ...appointments, newAppt ]);
      }
    } catch (err) {
      setAppointments([ ...appointments, newAppt ]);
    }

    setForm({ patientName: '', contact: '', email: '', doctorId: doctors[0]?.id || '', date: selectedDate, time: '09:00', reason: '' });
  };

  const appointmentsForDay = appointments.filter(a => a.date === selectedDate && (doctorFilter === 'all' ? true : String(a.doctorId) === String(doctorFilter)));

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
          <form onSubmit={handleBook}>
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email (for confirmation)</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="patient@example.com"
              />
            </div>

            <div className="form-group">
              <label>Select Doctor</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={(e) => { handleChange(e); setSelectedDate(e.target.value); }}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
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
              <input
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
            {DOCTORS.map((doc, idx) => (
              <div key={doc.id} className="doctor-card" style={{ animationDelay: `${idx * 50}ms` }}>
                <h3>{doc.name}</h3>
                <p className="specialty">{doc.specialty}</p>
              </div>
            ))}
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
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} className="fade-in">
                      <td>{a.patientName}</td>
                      <td>{a.doctor}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.reason || '--'}</td>
                    </tr>
                  ))}
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
