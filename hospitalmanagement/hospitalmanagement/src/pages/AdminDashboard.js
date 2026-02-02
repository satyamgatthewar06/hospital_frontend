import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminDashboard.css';
import authService, { ROLES } from '../services/authService';
import staffService from '../services/staffService';
import doctorService from '../services/doctorService';

const AdminDashboard = () => {
  const authContext = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
    loadStaff();
    loadDoctors();
  }, []);

  const loadUsers = () => {
    try {
      const allUsers = authService.getAllUsers(authContext.user?.role);
      setUsers(allUsers || []);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const loadStaff = () => {
    try {
      const allStaff = staffService.getStaffList();
      setStaff(allStaff || []);
    } catch (err) {
      setError('Failed to load staff');
    }
  };

  const loadDoctors = () => {
    try {
      const allDoctors = doctorService.getDoctorList();
      setDoctors(allDoctors || []);
    } catch (err) {
      setError('Failed to load doctors');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password || !formData.role) {
        setError('Please fill all fields');
        setLoading(false);
        return;
      }

      if (editingId) {
        authService.updateUser(editingId, formData, authContext.user?.role);
        setSuccess('User updated successfully');
      } else {
        authService.registerUser(formData, authContext.user?.role);
        setSuccess('User created successfully');
      }

      setFormData({});
      setEditingId(null);
      setShowUserForm(false);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.role) {
        setError('Please fill required fields');
        setLoading(false);
        return;
      }

      if (editingId) {
        staffService.updateStaff(editingId, formData);
        setSuccess('Staff member updated successfully');
      } else {
        staffService.addStaff(formData);
        setSuccess('Staff member added successfully');
      }

      setFormData({});
      setEditingId(null);
      setShowStaffForm(false);
      loadStaff();
    } catch (err) {
      setError(err.message || 'Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.specialization) {
        setError('Please fill required fields');
        setLoading(false);
        return;
      }

      if (editingId) {
        doctorService.updateDoctor(editingId, formData);
        setSuccess('Doctor updated successfully');
      } else {
        doctorService.addDoctor(formData);
        setSuccess('Doctor added successfully');
      }

      setFormData({});
      setEditingId(null);
      setShowDoctorForm(false);
      loadDoctors();
    } catch (err) {
      setError(err.message || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        authService.deleteUser(userId, authContext.user?.role);
        setSuccess('User deleted successfully');
        loadUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        staffService.deleteStaff(staffId);
        setSuccess('Staff member deleted successfully');
        loadStaff();
      } catch (err) {
        setError('Failed to delete staff');
      }
    }
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        doctorService.deleteDoctor(doctorId);
        setSuccess('Doctor deleted successfully');
        loadDoctors();
      } catch (err) {
        setError('Failed to delete doctor');
      }
    }
  };

  const handleEdit = (item, type) => {
    setFormData(item);
    setEditingId(item.id);
    if (type === 'user') setShowUserForm(true);
    else if (type === 'staff') setShowStaffForm(true);
    else if (type === 'doctor') setShowDoctorForm(true);
  };

  const handleReset = () => {
    setFormData({});
    setEditingId(null);
    setShowUserForm(false);
    setShowStaffForm(false);
    setShowDoctorForm(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Manage Users, Staff, and Doctors</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('users');
            handleReset();
          }}
        >
          📋 Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('staff');
            handleReset();
          }}
        >
          👥 Staff ({staff.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('doctors');
            handleReset();
          }}
        >
          🩺 Doctors ({doctors.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>User Management</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setFormData({});
                setEditingId(null);
                setShowUserForm(!showUserForm);
              }}
            >
              {showUserForm ? '✕ Cancel' : '+ Add User'}
            </button>
          </div>

          {showUserForm && (
            <form className="admin-form" onSubmit={handleUserSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@hospital.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Role</option>
                    {Object.values(ROLES).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update User' : 'Add User'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.fullName || 'N/A'}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(user, 'user')}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Staff Management</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setFormData({});
                setEditingId(null);
                setShowStaffForm(!showStaffForm);
              }}
            >
              {showStaffForm ? '✕ Cancel' : '+ Add Staff'}
            </button>
          </div>

          {showStaffForm && (
            <form className="admin-form" onSubmit={handleStaffSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Staff Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Admin">Admin</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Lab Technician">Lab Technician</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@hospital.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="Department"
                  />
                </div>
                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, qualification: e.target.value })
                    }
                    placeholder="Qualification"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Staff' : 'Add Staff'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="staff-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>{member.email || 'N/A'}</td>
                    <td>{member.phone || 'N/A'}</td>
                    <td>{member.department || 'N/A'}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(member, 'staff')}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteStaff(member.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Doctor Management</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setFormData({});
                setEditingId(null);
                setShowDoctorForm(!showDoctorForm);
              }}
            >
              {showDoctorForm ? '✕ Cancel' : '+ Add Doctor'}
            </button>
          </div>

          {showDoctorForm && (
            <form className="admin-form" onSubmit={handleDoctorSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Doctor Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Specialization *</label>
                  <input
                    type="text"
                    value={formData.specialization || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, specialization: e.target.value })
                    }
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="doctor@hospital.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Availability</label>
                  <input
                    type="text"
                    value={formData.availability || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Doctor' : 'Add Doctor'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="doctors-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.email || 'N/A'}</td>
                    <td>{doctor.phone || 'N/A'}</td>
                    <td>{doctor.availability || 'N/A'}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(doctor, 'doctor')}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default AdminDashboard;
