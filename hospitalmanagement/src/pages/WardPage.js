import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/WardPage.css';

const WARD_TYPES = ['General Ward', 'ICU', 'HDU', 'Private Ward', 'Pediatric Ward', 'Maternity Ward'];

const WardPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const wards = ctx.wards || [];
  const addWard = ctx.addWard || (() => {});

  const [form, setForm] = useState({
    wardName: '',
    wardType: '',
    totalBeds: '',
    availableBeds: '',
    chargesPerDay: '',
    inCharge: '',
    contactNumber: '',
    description: '',
  });

  const [expandedWard, setExpandedWard] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.wardName && form.wardType && form.totalBeds) {
      addWard({
        id: Date.now(),
        ...form,
        occupancyRate: ((form.totalBeds - form.availableBeds) / form.totalBeds * 100).toFixed(1),
        status: 'Active',
      });
      setForm({ wardName: '', wardType: '', totalBeds: '', availableBeds: '', chargesPerDay: '', inCharge: '', contactNumber: '', description: '' });
    }
  };

  const wardStats = useMemo(() => {
    return {
      totalWards: wards.length,
      totalBeds: wards.reduce((sum, w) => sum + (parseInt(w.totalBeds) || 0), 0),
      occupiedBeds: wards.reduce((sum, w) => sum + (parseInt(w.totalBeds) - parseInt(w.availableBeds) || 0), 0),
    };
  }, [wards]);

  return (
    <div className="ward-page fade-in">
      <h1>Ward Management</h1>

      {/* Ward Statistics */}
      <div className="ward-stats card">
        <h2>Ward Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Wards</span>
            <span className="stat-value">{wardStats.totalWards}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Beds</span>
            <span className="stat-value">{wardStats.totalBeds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Occupied Beds</span>
            <span className="stat-value">{wardStats.occupiedBeds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Available Beds</span>
            <span className="stat-value">{wardStats.totalBeds - wardStats.occupiedBeds}</span>
          </div>
        </div>
      </div>

      {/* Add Ward Form */}
      <div className="add-ward-form card">
        <h2>Add New Ward</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Ward Name *</label>
              <input
                type="text"
                name="wardName"
                value={form.wardName}
                onChange={handleChange}
                placeholder="e.g., ICU Block A"
                required
              />
            </div>
            <div className="form-group">
              <label>Ward Type *</label>
              <select name="wardType" value={form.wardType} onChange={handleChange} required>
                <option value="">-- Select Ward Type --</option>
                {WARD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Beds *</label>
              <input
                type="number"
                name="totalBeds"
                value={form.totalBeds}
                onChange={handleChange}
                placeholder="20"
                required
              />
            </div>
            <div className="form-group">
              <label>Available Beds *</label>
              <input
                type="number"
                name="availableBeds"
                value={form.availableBeds}
                onChange={handleChange}
                placeholder="15"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Charges Per Day (₹)</label>
              <input
                type="number"
                name="chargesPerDay"
                value={form.chargesPerDay}
                onChange={handleChange}
                placeholder="5000"
              />
            </div>
            <div className="form-group">
              <label>Ward In-Charge</label>
              <input
                type="text"
                name="inCharge"
                value={form.inCharge}
                onChange={handleChange}
                placeholder="Dr. Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ward facilities and details"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">Add Ward</button>
        </form>
      </div>

      {/* Wards List */}
      <div className="wards-list card">
        <h2>All Wards ({wards.length})</h2>
        <div className="wards-grid">
          {wards.map((ward, idx) => (
            <div key={ward.id} className="ward-card" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="ward-header">
                <h3>{ward.wardName}</h3>
                <span className={`status ${ward.status?.toLowerCase()}`}>{ward.status}</span>
              </div>

              <div className="ward-details">
                <p><strong>Type:</strong> {ward.wardType}</p>
                <p><strong>Total Beds:</strong> {ward.totalBeds}</p>
                <p><strong>Available:</strong> {ward.availableBeds}</p>
                <p><strong>Occupancy:</strong> {ward.occupancyRate}%</p>
                {ward.chargesPerDay && <p><strong>Charges:</strong> ₹{ward.chargesPerDay}/day</p>}
                {ward.inCharge && <p><strong>In-Charge:</strong> {ward.inCharge}</p>}
              </div>

              <button
                className="btn btn-secondary btn-small"
                onClick={() => setExpandedWard(expandedWard === ward.id ? null : ward.id)}
              >
                {expandedWard === ward.id ? 'Hide Details' : 'View Details'}
              </button>

              {expandedWard === ward.id && (
                <div className="ward-expanded">
                  <p><strong>Description:</strong> {ward.description || 'N/A'}</p>
                  {ward.contactNumber && <p><strong>Contact:</strong> {ward.contactNumber}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardPage;
