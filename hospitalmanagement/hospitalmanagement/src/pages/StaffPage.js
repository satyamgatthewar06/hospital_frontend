import React, { useEffect, useState, useContext } from 'react';
import staffService, { STAFF_ROLES } from '../services/staffService';
import StaffList from '../components/Staff/StaffList';
import StaffForm from '../components/Staff/StaffForm';
import '../styles/Staff.css';
import { AuthContext } from '../context/AuthContext';

const StaffPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allStaff, setAllStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Load staff data
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const data = await staffService.getAllStaff();
        setAllStaff(data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [refreshKey]);

  const auth = useContext(AuthContext);
  const isAdmin = auth?.user?.role === 'ADMIN';

  // Filter staff based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredStaff(allStaff);
    } else {
      setFilteredStaff(allStaff.filter(s => s.role === activeTab));
    }
  }, [activeTab, allStaff]);

  const handleAddStaff = (formData) => {
    staffService.addStaffMember(formData);
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditStaff = (staffId, formData) => {
    staffService.updateStaffMember(staffId, formData);
    setEditingStaff(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      staffService.deleteStaffMember(staffId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const tabs = [
    { id: 'all', label: '👥 All Staff', count: allStaff.length },
    { id: 'DOCTOR', label: '👨‍⚕️ Doctors', count: allStaff.filter(s => s.role === 'DOCTOR').length },
    { id: 'NURSE', label: '👩‍⚕️ Nurses', count: allStaff.filter(s => s.role === 'NURSE').length },
    { id: 'RECEPTIONIST', label: '👩‍💼 Receptionists', count: allStaff.filter(s => s.role === 'RECEPTIONIST').length },
    { id: 'ACCOUNTANT', label: '📊 Accountants', count: allStaff.filter(s => s.role === 'ACCOUNTANT').length },
    { id: 'ADMIN', label: '👨‍💻 Admin', count: allStaff.filter(s => s.role === 'ADMIN').length },
    { id: 'PHARMACIST', label: '💊 Pharmacists', count: allStaff.filter(s => s.role === 'PHARMACIST').length },
    { id: 'LAB_TECHNICIAN', label: '🧪 Lab Technicians', count: allStaff.filter(s => s.role === 'LAB_TECHNICIAN').length },
  ];

  return (
    <div className="staff-management">
      <div className="staff-header">
        <h1>👥 Staff Management</h1>
        {isAdmin && (
          <button
            className="btn-add-staff"
            onClick={() => {
              setEditingStaff(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? '✕ Cancel' : '➕ Add Staff Member'}
          </button>
        )}
      </div>

      {showForm && isAdmin ? (
        <StaffForm
          onSubmit={handleAddStaff}
          staffRoles={STAFF_ROLES}
        />
      ) : editingStaff && isAdmin ? (
        <StaffForm
          initialData={editingStaff}
          onSubmit={(data) => handleEditStaff(editingStaff.id, data)}
          staffRoles={STAFF_ROLES}
          onCancel={() => setEditingStaff(null)}
        />
      ) : (
        <>
          <div className="staff-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`staff-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <span className="count-badge">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="staff-content">
            {loading ? (
              <div className="loading">Loading staff data...</div>
            ) : filteredStaff.length === 0 ? (
              <div className="no-data">
                <p>📋 No staff members found for this category</p>
              </div>
            ) : (
              <StaffList
                staff={filteredStaff}
                staffRoles={STAFF_ROLES}
                onEdit={isAdmin ? (staff) => { setEditingStaff(staff); setShowForm(false); } : undefined}
                onDelete={isAdmin ? handleDeleteStaff : undefined}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StaffPage;