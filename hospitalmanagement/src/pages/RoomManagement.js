import React, { useState, useContext, useMemo, useEffect } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/RoomManagement.css';

const RoomManagement = () => {
  const { wards, loading, errors } = useContext(HospitalContext);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'General Ward',
    capacity: 1,
    currentOccupancy: 0,
    status: 'Available',
    chargePerDay: 0,
    amenities: [],
    floor: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [localWards, setLocalWards] = useState([]);

  // Initialize local state from context
  useEffect(() => {
    if (wards && wards.length > 0) {
      setLocalWards(wards);
    }
  }, [wards]);

  const rooms = localWards || [];
  const roomTypes = ['General Ward', 'Private Room', 'ICU', 'Semi-Private', 'Isolation Ward', 'Pediatric'];
  const amenitiesOptions = ['AC', 'Wifi', 'TV', 'Attached Bath', 'Emergency Call', 'Oxygen Support', 'Monitoring'];

  const stats = useMemo(() => ({
    total: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length,
    maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    totalOccupancy: Math.round((rooms.reduce((sum, r) => sum + r.currentOccupancy, 0) / (rooms.reduce((sum, r) => sum + r.capacity, 0) || 1)) * 100)
  }), [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All' || room.roomType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [rooms, searchTerm, filterType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      id: Date.now(),
      ...formData,
      capacity: parseInt(formData.capacity),
      currentOccupancy: parseInt(formData.currentOccupancy),
      chargePerDay: parseFloat(formData.chargePerDay)
    };

    setLocalWards([...localWards, newRoom]);

    setFormData({
      roomNumber: '',
      roomType: 'General Ward',
      capacity: 1,
      currentOccupancy: 0,
      status: 'Available',
      chargePerDay: 0,
      amenities: [],
      floor: ''
    });
    setActiveTab('list');
  };

  const handleDeleteRoom = (id) => {
    setLocalWards(localWards.filter(room => room.id !== id));
  };

  const handleUpdateStatus = (id, newStatus) => {
    setLocalWards(localWards.map(room => room.id === id ? { ...room, status: newStatus } : room));
  };

  const handleUpdateOccupancy = (id, newOccupancy) => {
    setLocalWards(localWards.map(room => room.id === id ? { ...room, currentOccupancy: newOccupancy } : room));
  };

  return (
    <div className="room-management">
      <h1>🏥 Room & Bed Management</h1>

      <div className="room-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Rooms</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Available</span>
            <span className="stat-value">{stats.available}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Occupied</span>
            <span className="stat-value">{stats.occupied}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Occupancy %</span>
            <span className="stat-value">{stats.totalOccupancy}%</span>
          </div>
        </div>
      </div>

      <div className="tabs-navigation">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          📋 Room List
        </button>
        <button className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
          ➕ Add Room
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="form-section">
          <h2>Add New Room</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  required
                  placeholder="e.g., 101"
                />
              </div>
              <div className="form-group">
                <label>Floor</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  placeholder="e.g., 1st Floor"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Room Type</label>
                <select value={formData.roomType} onChange={(e) => setFormData({...formData, roomType: e.target.value})}>
                  {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Occupancy</label>
                <input
                  type="number"
                  min="0"
                  value={formData.currentOccupancy}
                  onChange={(e) => setFormData({...formData, currentOccupancy: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Charge Per Day (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.chargePerDay}
                  onChange={(e) => setFormData({...formData, chargePerDay: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <div className="amenities-list">
                {amenitiesOptions.map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, amenities: [...formData.amenities, amenity]});
                        } else {
                          setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                        }
                      }}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Room</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="list-section">
          <div className="list-header">
            <h2>Room Inventory</h2>
            <div style={{display: 'flex', gap: '1rem'}}>
              <input
                type="text"
                placeholder="Search rooms..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="no-data">No rooms found</div>
          ) : (
            <div className="rooms-grid">
              {filteredRooms.map((room, idx) => (
                <div key={idx} className="room-card">
                  <div className="room-header">
                    <h4>Room {room.roomNumber}</h4>
                    <span className={`status ${room.status.toLowerCase()}`}>{room.status}</span>
                  </div>
                  <div className="room-details">
                    <p><strong>Type:</strong> {room.roomType}</p>
                    <p><strong>Floor:</strong> {room.floor || '-'}</p>
                    <p><strong>Beds:</strong> {room.currentOccupancy}/{room.capacity}</p>
                    <p><strong>Rate:</strong> ₹{room.chargePerDay}/day</p>
                  </div>
                  <div className="occupancy-mini">
                    <div className="occupancy-bar-mini">
                      <div 
                        className="occupancy-fill-mini"
                        style={{width: `${(room.currentOccupancy / room.capacity) * 100}%`}}
                      />
                    </div>
                  </div>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="amenities-display">
                      {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
                    </div>
                  )}
                  <div className="room-actions">
                    <select 
                      value={room.status}
                      onChange={(e) => handleUpdateStatus(room.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      max={room.capacity}
                      value={room.currentOccupancy}
                      onChange={(e) => handleUpdateOccupancy(room.id, parseInt(e.target.value))}
                      className="occupancy-input"
                      title="Update occupancy"
                    />
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteRoom(room.id)}>🗑️</button>
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

export default RoomManagement;
