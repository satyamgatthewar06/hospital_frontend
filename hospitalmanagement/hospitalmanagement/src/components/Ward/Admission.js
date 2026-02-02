import React, { useState } from 'react';
import wardService from '../../services/wardService';

const Admission = ({ rooms, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    roomId: '',
    bedNumber: '',
    diagnosis: '',
    admittingDoctor: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState('');

  const availableRooms = rooms.filter(r => r.available > 0);
  const selectedRoomData = rooms.find(r => r.id === formData.roomId);
  const roomTypeDetails = selectedRoomData ? wardService.getRoomTypeDetails(selectedRoomData.type) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.patientName || !formData.roomId || !formData.bedNumber || !formData.diagnosis) {
      setMessage('❌ Please fill all required fields');
      return;
    }

    if (formData.bedNumber > selectedRoomData.beds) {
      setMessage('❌ Bed number exceeds room capacity');
      return;
    }

    try {
      const admission = wardService.admitPatient({
        patientId: formData.patientId,
        patientName: formData.patientName,
        roomId: formData.roomId,
        bedNumber: formData.bedNumber,
        diagnosis: formData.diagnosis,
        admittingDoctor: formData.admittingDoctor,
        phoneNumber: formData.phoneNumber,
      });

      setMessage(`✅ Patient admitted successfully! Admission ID: ${admission.id}`);
      setTimeout(() => {
        setMessage('');
      }, 2000);
      setFormData({
        patientId: '',
        patientName: '',
        roomId: '',
        bedNumber: '',
        diagnosis: '',
        admittingDoctor: '',
        phoneNumber: '',
      });
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      setMessage('❌ Error admitting patient');
    }
  };

  return (
    <div className="admission">
      <div className="admission-container">
        <h2>➕ Admit Patient to Ward</h2>

        <form onSubmit={handleSubmit} className="admission-form">
          <div className="form-row">
            <div className="form-group">
              <label>Patient ID *</label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                placeholder="Enter patient ID (e.g., PAT-001)"
                required
              />
            </div>
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Admitting Doctor</label>
              <input
                type="text"
                name="admittingDoctor"
                value={formData.admittingDoctor}
                onChange={handleChange}
                placeholder="Enter doctor name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Room *</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a room --</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} ({room.type}) - {room.available} bed(s) available
                </option>
              ))}
            </select>
          </div>

          {formData.roomId && (
            <div className="room-info">
              <p><strong>Room Type:</strong> {selectedRoomData.type}</p>
              <p><strong>Available Beds:</strong> {selectedRoomData.available}/{selectedRoomData.beds}</p>
              <p><strong>Daily Rate:</strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>₹{wardService.getRoomTypeDetails(selectedRoomData.type).dailyRate}</span></p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                💡 A billing record of ₹{wardService.getRoomTypeDetails(selectedRoomData.type).dailyRate} will be created upon admission
              </p>
            </div>
          )}

          {formData.roomId && (
            <div className="form-group">
              <label>Bed Number (1-{selectedRoomData.beds}) *</label>
              <input
                type="number"
                name="bedNumber"
                min="1"
                max={selectedRoomData ? selectedRoomData.beds : 1}
                value={formData.bedNumber}
                onChange={handleChange}
                placeholder="Enter bed number"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Diagnosis/Chief Complaint *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis or reason for admission"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="btn-admit">
            ➕ Admit Patient
          </button>
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

export default Admission;
