import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/EnhancedStaffManagement.css';

const EnhancedStaffManagement = () => {
  const { hospitalData, setHospitalData } = useContext(HospitalContext);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Nurse',
    department: 'General',
    joiningDate: new Date().toISOString().split('T')[0],
    qualification: '',
    status: 'Active',
    salary: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const staff = hospitalData.staff || [];
  const roles = ['Doctor', 'Nurse', 'Receptionist', 'Technician', 'Pharmacist', 'Admin'];
  const departments = ['General', 'Cardiology', 'Orthopedics', 'Neurology', 'Surgery', 'Pediatrics', 'ICU', 'Emergency'];

  const stats = useMemo(() => {
    const roleCount = {};
    staff.forEach(s => {
      roleCount[s.role] = (roleCount[s.role] || 0) + 1;
    });
    return {
      total: staff.length,
      active: staff.filter(s => s.status === 'Active').length,
      roles: Object.keys(roleCount).map(role => ({ role, count: roleCount[role] }))
    };
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterRole === 'All' || member.role === filterRole;
      return matchesSearch && matchesFilter;
    });
  }, [staff, searchTerm, filterRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      id: Date.now(),
      ...formData,
      salary: parseFloat(formData.salary)
    };

    setHospitalData(prev => ({
      ...prev,
      staff: [...(prev.staff || []), newMember]
    }));

    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Nurse',
      department: 'General',
      joiningDate: new Date().toISOString().split('T')[0],
      qualification: '',
      status: 'Active',
      salary: 0
    });
    setActiveTab('list');
  };

  const handleDeleteStaff = (id) => {
    setHospitalData(prev => ({
      ...prev,
      staff: prev.staff.filter(member => member.id !== id)
    }));
  };

  const handleUpdateStatus = (id, newStatus) => {
    setHospitalData(prev => ({
      ...prev,
      staff: prev.staff.map(member => member.id === id ? { ...member, status: newStatus } : member)
    }));
  };

  const getRoleColor = (role) => {
    const colors = {
      'Doctor': '#667eea',
      'Nurse': '#f5576c',
      'Receptionist': '#4facfe',
      'Technician': '#fa709a',
      'Pharmacist': '#fee140',
      'Admin': '#43e97b'
    };
    return colors[role] || '#999';
  };

  return (
    <div className="staff-management">
      <h1>👥 Staff Management</h1>

      <div className="staff-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Staff</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active</span>
            <span className="stat-value">{stats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Roles</span>
            <span className="stat-value">{stats.roles.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Departments</span>
            <span className="stat-value">{new Set(staff.map(s => s.department)).size}</span>
          </div>
        </div>
      </div>

      {stats.roles.length > 0 && (
        <div className="role-breakdown">
          <h3>Staff Distribution by Role</h3>
          <div className="role-grid">
            {stats.roles.map(item => (
              <div key={item.role} className="role-item">
                <span style={{color: getRoleColor(item.role)}} className="role-name">{item.role}</span>
                <span className="role-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tabs-navigation">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          📋 Staff List
        </button>
        <button className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
          ➕ Add Staff
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="form-section">
          <h2>Add New Staff Member</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  {roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  placeholder="e.g., B.Sc Nursing"
                />
              </div>
              <div className="form-group">
                <label>Monthly Salary (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Staff Member</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="list-section">
          <div className="list-header">
            <h2>Staff Directory</h2>
            <div style={{display: 'flex', gap: '1rem'}}>
              <input
                type="text"
                placeholder="Search staff..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="All">All Roles</option>
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <div className="no-data">No staff members found</div>
          ) : (
            <div className="staff-grid">
              {filteredStaff.map((member, idx) => (
                <div key={idx} className="staff-card">
                  <div className="staff-header">
                    <h4>{member.name}</h4>
                    <span className={`status ${member.status.toLowerCase()}`}>{member.status}</span>
                  </div>
                  <div className="staff-details">
                    <p><strong>Role:</strong> <span style={{color: getRoleColor(member.role)}}>{member.role}</span></p>
                    <p><strong>Department:</strong> {member.department}</p>
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>Phone:</strong> {member.phone}</p>
                    <p><strong>Qualification:</strong> {member.qualification || '-'}</p>
                    <p><strong>Salary:</strong> ₹{member.salary.toLocaleString()}</p>
                    <p><strong>Joined:</strong> {member.joiningDate}</p>
                  </div>
                  <div className="staff-actions">
                    <select
                      value={member.status}
                      onChange={(e) => handleUpdateStatus(member.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteStaff(member.id)}>🗑️ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedStaffManagement;
