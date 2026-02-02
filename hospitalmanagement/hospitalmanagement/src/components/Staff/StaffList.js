import React from 'react';

const StaffList = ({ staff, staffRoles, onEdit, onDelete }) => {
  const getRoleInfo = (role) => {
    return staffRoles[role] || { label: role, icon: '👤', color: '#6b7280' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'on-leave':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return '✓ Active';
      case 'inactive':
        return '✗ Inactive';
      case 'on-leave':
        return '⊕ On Leave';
      default:
        return status;
    }
  };

  return (
    <div className="staff-list">
      {staff.length === 0 ? (
        <div className="no-staff">
          <p>📋 No staff members to display</p>
        </div>
      ) : (
        <div className="staff-grid">
          {staff.map(member => {
            const roleInfo = getRoleInfo(member.role);
            return (
              <div key={member.id} className="staff-card">
                <div className="staff-card-header">
                  <div className="staff-avatar">
                    <span className="avatar-icon">{roleInfo.icon}</span>
                  </div>
                  <div className="staff-name-section">
                    <h3 className="staff-name">{member.name}</h3>
                    <p className="staff-role" style={{ color: roleInfo.color }}>
                      {roleInfo.label}
                    </p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(member.status) }}
                  >
                    {getStatusLabel(member.status)}
                  </span>
                </div>

                <div className="staff-details">
                  <div className="detail-item">
                    <span className="detail-label">📧 Email:</span>
                    <span className="detail-value">{member.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📱 Phone:</span>
                    <span className="detail-value">{member.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🏥 Department:</span>
                    <span className="detail-value">{member.department}</span>
                  </div>

                  {member.qualification && (
                    <div className="detail-item">
                      <span className="detail-label">🎓 Qualification:</span>
                      <span className="detail-value">{member.qualification}</span>
                    </div>
                  )}

                  {member.specialization && (
                    <div className="detail-item">
                      <span className="detail-label">⭐ Specialization:</span>
                      <span className="detail-value">{member.specialization}</span>
                    </div>
                  )}

                  {member.experience !== undefined && (
                    <div className="detail-item">
                      <span className="detail-label">⏱️ Experience:</span>
                      <span className="detail-value">{member.experience} years</span>
                    </div>
                  )}

                  {member.license && (
                    <div className="detail-item">
                      <span className="detail-label">🔐 License:</span>
                      <span className="detail-value">{member.license}</span>
                    </div>
                  )}

                  {member.joinDate && (
                    <div className="detail-item">
                      <span className="detail-label">📅 Joined:</span>
                      <span className="detail-value">{member.joinDate}</span>
                    </div>
                  )}
                </div>

                <div className="staff-card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(member)}
                    title="Edit staff member"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(member.id)}
                    title="Delete staff member"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffList;