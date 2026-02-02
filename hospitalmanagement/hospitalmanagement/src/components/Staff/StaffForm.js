import React, { useState, useEffect } from 'react';

const StaffForm = ({ initialData, onSubmit, onCancel, staffRoles }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'NURSE',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    specialization: '',
    joinDate: new Date().toISOString().split('T')[0],
    license: '',
    experience: 0,
    status: 'active',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.email || !formData.phone || !formData.department) {
      setMessage('❌ Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('❌ Invalid email address');
      return;
    }

    const phoneRegex = /^[\d\s\-\+()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage('❌ Invalid phone number');
      return;
    }

    try {
      onSubmit(formData);
      setMessage(`✅ ${initialData ? 'Staff member updated' : 'Staff member added'} successfully!`);
      setFormData({
        name: '',
        role: 'NURSE',
        email: '',
        phone: '',
        department: '',
        qualification: '',
        specialization: '',
        joinDate: new Date().toISOString().split('T')[0],
        license: '',
        experience: 0,
        status: 'active',
      });
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Error saving staff member');
    }
  };

  const departments = [
    'General',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Obstetrics',
    'ICU',
    'Ward',
    'Front Desk',
    'Finance',
    'Administration',
    'Laboratory',
    'Pharmacy',
  ];

  return (
    <div className="staff-form-container">
      <div className="staff-form-box">
        <h2>{initialData ? '✏️ Edit Staff Member' : '➕ Add New Staff Member'}</h2>

        <form onSubmit={handleSubmit} className="staff-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Role --</option>
                {Object.entries(staffRoles).map(([key, role]) => (
                  <option key={key} value={key}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., B.Sc Nursing, MBBS, MBA"
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                max="60"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Specialization/License</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Cardiac Surgery"
              />
            </div>
            <div className="form-group">
              <label>License Number</label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder="e.g., MCI-12345"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Joining Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {initialData ? '✏️ Update Staff Member' : '➕ Add Staff Member'}
            </button>
            {onCancel && (
              <button type="button" className="btn-cancel" onClick={onCancel}>
                ✕ Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffForm;
