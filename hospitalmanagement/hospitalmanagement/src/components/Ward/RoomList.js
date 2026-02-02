import React from 'react';
import wardService from '../../services/wardService';

const RoomList = ({ rooms, admissions }) => {
  const roomTypes = wardService.getRoomTypes();

  const getRoomTypeColor = (type) => {
    const typeObj = roomTypes[type];
    return typeObj ? typeObj.color : '#6b7280';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'partial':
        return '#f59e0b';
      case 'full':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return '✓ Available';
      case 'partial':
        return '⊕ Partial';
      case 'full':
        return '✗ Full';
      default:
        return status;
    }
  };

  // Group rooms by type
  const roomsByType = {
    ICU: rooms.filter(r => r.type === 'ICU'),
    GENERAL: rooms.filter(r => r.type === 'GENERAL'),
    PRIVATE: rooms.filter(r => r.type === 'PRIVATE'),
  };

  return (
    <div className="room-list">
      {Object.entries(roomsByType).map(([type, typeRooms]) => (
        <div key={type} className="room-type-section">
          <div className="room-type-header">
            <h2 style={{ color: getRoomTypeColor(type) }}>
              {roomTypes[type]?.label || type}
            </h2>
            <span className="daily-rate">
              ₹{roomTypes[type]?.dailyRate || 0}/day
            </span>
          </div>

          {typeRooms.length === 0 ? (
            <p className="no-rooms">No {type.toLowerCase()} rooms</p>
          ) : (
            <div className="rooms-grid">
              {typeRooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-header">
                    <h3>Room {room.roomNumber}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(room.status) }}
                    >
                      {getStatusLabel(room.status)}
                    </span>
                  </div>

                  <div className="room-details">
                    <div className="detail-row">
                      <span className="label">Total Beds:</span>
                      <span className="value">{room.beds}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Occupied:</span>
                      <span className="value">{room.occupancy}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Available:</span>
                      <span className="value" style={{ color: '#10b981', fontWeight: 'bold' }}>
                        {room.available}
                      </span>
                    </div>

                    <div className="occupancy-bar">
                      <div
                        className="occupancy-fill"
                        style={{
                          width: `${(room.occupancy / room.beds) * 100}%`,
                          backgroundColor: getRoomTypeColor(type),
                        }}
                      />
                    </div>
                  </div>

                  <div className="room-patients">
                    <span className="patients-header">👥 Patients in room:</span>
                    {admissions
                      .filter(a => a.roomId === room.id && a.status === 'admitted')
                      .map((admission, idx) => (
                        <div key={idx} className="patient-item">
                          <span className="patient-name">{admission.patientName || admission.patientId}</span>
                          <span className="patient-bed">Bed {admission.bedNumber || '—'}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomList;
