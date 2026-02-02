import React, { useState } from 'react';
import wardService from '../../services/wardService';

const BedAssignment = ({ rooms, onSuccess }) => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [message, setMessage] = useState('');

  const availableRooms = rooms.filter(r => r.available > 0);
  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  const handleAssign = (e) => {
    e.preventDefault();

    if (!selectedRoom || !bedNumber || !patientId) {
      setMessage('❌ Please fill all fields');
      return;
    }

    if (!patientName) {
      setMessage('❌ Please enter patient name');
      return;
    }

    if (bedNumber > selectedRoomData.beds) {
      setMessage('❌ Bed number exceeds room capacity');
      return;
    }

    // Create assignment record
    try {
      wardService.updateRoomOccupancy(selectedRoom, 1);
      setMessage('✅ Bed assigned successfully');
      setSelectedRoom('');
      setBedNumber('');
      setPatientId('');
      setPatientName('');
      setTimeout(() => {
        setMessage('');
        onSuccess();
      }, 1500);
    } catch (error) {
      setMessage('❌ Error assigning bed');
    }
  };

  return (
    <div className="bed-assignment">
      <div className="assignment-container">
        <h2>🛏️ Assign Bed to Patient</h2>

        <form onSubmit={handleAssign} className="assignment-form">
          <div className="form-group">
            <label>Select Room *</label>
            <select
              value={selectedRoom}
              onChange={(e) => {
                setSelectedRoom(e.target.value);
                setBedNumber('');
              }}
              required
            >
              <option value="">-- Choose a room --</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} ({room.type}) - {room.available} bed(s) available
                </option>
              ))}
            </select>
          </div>

          {selectedRoom && (
            <>
              <div className="room-info">
                <p><strong>Room Type:</strong> {selectedRoomData.type}</p>
                <p><strong>Available Beds:</strong> {selectedRoomData.available}/{selectedRoomData.beds}</p>
              </div>

              <div className="form-group">
                <label>Bed Number (1-{selectedRoomData.beds}) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoomData.beds}
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  placeholder="Enter bed number"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Patient ID *</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID (e.g., PAT-001)"
              required
            />
          </div>

          <div className="form-group">
            <label>Patient Name *</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>

          <button type="submit" className="btn-assign">
            ✓ Assign Bed
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="room-status">
          <h3>Available Rooms Summary</h3>
          <div className="status-grid">
            {availableRooms.map(room => (
              <div key={room.id} className="status-item">
                <p className="room-number">Room {room.roomNumber}</p>
                <p className="room-type">{room.type}</p>
                <p className="bed-count">{room.available} beds available</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedAssignment;
