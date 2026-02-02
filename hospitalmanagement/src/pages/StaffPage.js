import React, { useState, useContext, useMemo, useEffect } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import RoleGuard from '../components/RoleGuard';
import AdminUsers from '../components/Staff/AdminUsers';
import '../styles/StaffPage.css';

const DEPARTMENTS = [
  'General Ward',
  'ICU',
  'Operation Theatre (OT)',
  'X-Ray',
  'Laboratory',
  'Maternity',
  'Emergency',
  'Administration',
];

const STAFF_ROLES = {
  'General Ward': ['Staff Nurse', 'Nurse Assistant', 'Ward Attendant'],
  'ICU': ['ICU Nurse', 'ICU Technician', 'Respiratory Therapist'],
  'Operation Theatre (OT)': ['OT Nurse', 'OT Technician', 'Anesthetist Assistant'],
  'X-Ray': ['X-Ray Technician', 'Radiologist Assistant'],
  'Laboratory': ['Lab Technician', 'Pathologist Assistant'],
  'Maternity': ['Maternity Nurse', 'Midwife', 'OB/GYN Assistant'],
  'Emergency': ['Emergency Nurse', 'Trauma Technician', 'Paramedic'],
  'Administration': ['Administrator', 'Receptionist', 'Data Entry Operator'],
};

const SHIFTS = [
  { id: 'morning', name: 'Morning', time: '8:00 AM - 2:00 PM' },
  { id: 'evening', name: 'Evening', time: '2:00 PM - 8:00 PM' },
  { id: 'night', name: 'Night', time: '8:00 PM - 8:00 AM' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StaffPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const contextStaff = ctx.staff || [];
  const addStaff = ctx.addStaff || (() => {});

  const [localStaff, setLocalStaff] = useState([]);
  useEffect(() => {
    if (contextStaff && contextStaff.length > 0) {
      setLocalStaff(contextStaff);
    }
  }, [contextStaff]);

  const staff = localStaff || [];

  const [form, setForm] = useState({
    name: '',
    role: '',
    department: '',
    contact: '',
    email: '',
    joinDate: '',
    experience: '',
  });

  const [duties, setDuties] = useState({});
  const [selectedDept, setSelectedDept] = useState('General Ward');
  const [expandedStaff, setExpandedStaff] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.role && form.department) {
      const newStaff = {
        id: Date.now(),
        ...form,
        status: 'Active',
      };
      setLocalStaff([...localStaff, newStaff]);
      setForm({ name: '', role: '', department: '', contact: '', email: '', joinDate: '', experience: '' });
    }
  };

  const handleDutyChange = (staffId, day, shift) => {
    setDuties(prev => {
      const key = `${staffId}-${day}`;
      const current = prev[key];
      return {
        ...prev,
        [key]: current === shift ? null : shift,
      };
    });
  };

  const deptStaff = useMemo(() => {
    return staff.filter(s => s.department === selectedDept);
  }, [staff, selectedDept]);

  const staffStats = useMemo(() => {
    const stats = {};
    DEPARTMENTS.forEach(dept => {
      stats[dept] = staff.filter(s => s.department === dept).length;
    });
    return stats;
  }, [staff]);

  return (
    <div className="staff-page fade-in">
      <h1>Staff Management</h1>

      {/* Admin-only user management */}
      <RoleGuard allowed={["admin"]}>
        <AdminUsers />
      </RoleGuard>

      {/* Department Stats */}
      <div className="dept-stats card">
        <h2>Staff by Department</h2>
        <div className="stats-grid">
          {DEPARTMENTS.map((dept, idx) => (
            <div key={dept} className="stat-item" style={{ animationDelay: `${idx * 50}ms` }}>
              <span className="stat-dept">{dept}</span>
              <span className="stat-count">{staffStats[dept]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Form */}
      <div className="add-staff-form card">
        <h2>Add New Staff Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Staff Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter staff name"
                required
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">-- Select Department --</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role/Designation *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Role --</option>
                {form.department && STAFF_ROLES[form.department]?.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Years"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">Add Staff</button>
        </form>
      </div>

      {/* Department Staff List */}
      <div className="staff-list-container card">
        <div className="dept-selector">
          <h2>Staff Directory</h2>
          <div className="dept-tabs">
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                className={`dept-tab ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {deptStaff.length === 0 ? (
          <p className="empty-state">No staff assigned to {selectedDept} yet.</p>
        ) : (
          <div className="staff-cards">
            {deptStaff.map(staffMember => (
              <div key={staffMember.id} className="staff-card">
                <div className="staff-header">
                  <div className="staff-info">
                    <h3>{staffMember.name}</h3>
                    <p className="role">{staffMember.role}</p>
                    <p className="dept">{staffMember.department}</p>
                  </div>
                  <div className="status-badge active">Active</div>
                </div>

                <div className="staff-details">
                  {staffMember.experience && <span>📊 Exp: {staffMember.experience} yrs</span>}
                  {staffMember.contact && <span>📞 {staffMember.contact}</span>}
                  {staffMember.email && <span>✉️ {staffMember.email}</span>}
                  {staffMember.joinDate && <span>📅 Joined: {staffMember.joinDate}</span>}
                </div>

                <button
                  className="btn-duties"
                  onClick={() => setExpandedStaff(expandedStaff === staffMember.id ? null : staffMember.id)}
                >
                  {expandedStaff === staffMember.id ? '❌ Close Duties' : '📋 View Duties'}
                </button>

                {expandedStaff === staffMember.id && (
                  <div className="duties-schedule">
                    <h4>Weekly Duty Schedule</h4>
                    <div className="duty-table">
                      <div className="duty-header">
                        <span className="day-col">Day</span>
                        {SHIFTS.map(shift => (
                          <span key={shift.id} className="shift-col">
                            {shift.name}<br/><small>{shift.time}</small>
                          </span>
                        ))}
                      </div>
                      {DAYS.map(day => (
                        <div key={day} className="duty-row">
                          <span className="day-col">{day}</span>
                          {SHIFTS.map(shift => {
                            const key = `${staffMember.id}-${day}`;
                            const isSelected = duties[key] === shift.id;
                            return (
                              <button
                                key={shift.id}
                                className={`shift-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleDutyChange(staffMember.id, day, shift.id)}
                                title={`${shift.name}: ${shift.time}`}
                              >
                                {isSelected ? '✓' : ''}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Staff Table */}
      {staff.length > 0 && (
        <div className="all-staff-table card">
          <h2>All Staff Members ({staff.length})</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Contact</th>
                  <th>Join Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(staffMember => (
                  <tr key={staffMember.id} className="fade-in">
                    <td className="staff-name">{staffMember.name}</td>
                    <td>{staffMember.role}</td>
                    <td>{staffMember.department}</td>
                    <td>{staffMember.experience ? `${staffMember.experience} yrs` : '--'}</td>
                    <td>{staffMember.contact || '--'}</td>
                    <td>{staffMember.joinDate || '--'}</td>
                    <td><span className="status active">{staffMember.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;