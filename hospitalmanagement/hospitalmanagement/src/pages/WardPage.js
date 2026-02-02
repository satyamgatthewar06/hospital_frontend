import React, { useState, useEffect } from 'react';
import wardService from '../services/wardService';
import RoomList from '../components/Ward/RoomList';
import BedAssignment from '../components/Ward/BedAssignment';
import Admission from '../components/Ward/Admission';
import Discharge from '../components/Ward/Discharge';
import '../styles/Ward.css';

const WardManagement = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load data on mount and when refreshKey changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const roomsData = await wardService.getAllRooms();
        const admissionsData = await wardService.getAllAdmissions();
        setRooms(roomsData);
        setAdmissions(admissionsData);
      } catch (error) {
        console.error('Error loading ward data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'rooms', label: '🏥 Room Availability', icon: '🏥' },
    { id: 'assignment', label: '🛏️ Bed Assignment', icon: '🛏️' },
    { id: 'admission', label: '➕ Admission', icon: '➕' },
    { id: 'discharge', label: '➖ Discharge', icon: '➖' },
  ];

  return (
    <div className="ward-management">
      <div className="ward-header">
        <h1>🏥 Ward & Room Management</h1>
        <button onClick={handleRefresh} className="refresh-btn">🔄 Refresh</button>
      </div>

      <div className="ward-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`ward-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ward-content">
        {loading ? (
          <div className="loading">Loading ward data...</div>
        ) : (
          <>
            {activeTab === 'rooms' && <RoomList rooms={rooms} admissions={admissions} />}
            {activeTab === 'assignment' && <BedAssignment rooms={rooms} onSuccess={handleRefresh} />}
            {activeTab === 'admission' && <Admission rooms={rooms} onSuccess={handleRefresh} />}
            {activeTab === 'discharge' && <Discharge admissions={admissions} onSuccess={handleRefresh} />}
          </>
        )}
      </div>
    </div>
  );
};

export default WardManagement;
