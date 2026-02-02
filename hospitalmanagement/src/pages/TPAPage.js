import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/TPAPage.css';

const TPA_STATUS = ['Active', 'Inactive', 'Under Review', 'Verified'];

const TPAPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const tpaProviders = ctx.tpaProviders || [];
  const addTPA = ctx.addTPA || (() => {});

  const [form, setForm] = useState({
    tpaName: '',
    tpaCode: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    empanelDate: '',
    empanelValidity: '',
    status: 'Active',
    totalClaims: '',
    approvedClaims: '',
    networkHospitals: '',
  });

  const [expandedTPA, setExpandedTPA] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.tpaName && form.tpaCode && form.contactPerson) {
      addTPA({
        id: Date.now(),
        ...form,
      });
      setForm({
        tpaName: '',
        tpaCode: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        empanelDate: '',
        empanelValidity: '',
        status: 'Active',
        totalClaims: '',
        approvedClaims: '',
        networkHospitals: '',
      });
    }
  };

  const tpaStats = useMemo(() => {
    return {
      totalTPAs: tpaProviders.length,
      activeTPAs: tpaProviders.filter(t => t.status === 'Active').length,
      totalClaims: tpaProviders.reduce((sum, t) => sum + (parseInt(t.totalClaims) || 0), 0),
      approvedClaims: tpaProviders.reduce((sum, t) => sum + (parseInt(t.approvedClaims) || 0), 0),
    };
  }, [tpaProviders]);

  return (
    <div className="tpa-page fade-in">
      <h1>Third Party Administrator (TPA) Management</h1>

      {/* TPA Statistics */}
      <div className="tpa-stats card">
        <h2>TPA Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total TPAs</span>
            <span className="stat-value">{tpaStats.totalTPAs}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active TPAs</span>
            <span className="stat-value">{tpaStats.activeTPAs}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Claims Processed</span>
            <span className="stat-value">{tpaStats.totalClaims}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Claims Approved</span>
            <span className="stat-value">{tpaStats.approvedClaims}</span>
          </div>
        </div>
      </div>

      {/* Add TPA Form */}
      <div className="add-tpa-form card">
        <h2>Register New TPA Provider</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>TPA Name *</label>
              <input
                type="text"
                name="tpaName"
                value={form.tpaName}
                onChange={handleChange}
                placeholder="TPA Company Name"
                required
              />
            </div>
            <div className="form-group">
              <label>TPA Code *</label>
              <input
                type="text"
                name="tpaCode"
                value={form.tpaCode}
                onChange={handleChange}
                placeholder="TPA-001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Person *</label>
              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Contact person name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@tpa.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {TPA_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="TPA office address"
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Empanelment Date</label>
              <input
                type="date"
                name="empanelDate"
                value={form.empanelDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Empanelment Validity</label>
              <input
                type="date"
                name="empanelValidity"
                value={form.empanelValidity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Claims Processed</label>
              <input
                type="number"
                name="totalClaims"
                value={form.totalClaims}
                onChange={handleChange}
                placeholder="150"
              />
            </div>
            <div className="form-group">
              <label>Claims Approved</label>
              <input
                type="number"
                name="approvedClaims"
                value={form.approvedClaims}
                onChange={handleChange}
                placeholder="145"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Network Hospitals</label>
            <input
              type="number"
              name="networkHospitals"
              value={form.networkHospitals}
              onChange={handleChange}
              placeholder="500"
            />
          </div>

          <button type="submit" className="btn btn-primary">Register TPA</button>
        </form>
      </div>

      {/* TPA List */}
      <div className="tpa-list card">
        <h2>All TPAs ({tpaProviders.length})</h2>
        <div className="tpa-grid">
          {tpaProviders.length > 0 ? (
            tpaProviders.map((tpa, idx) => (
              <div key={tpa.id} className="tpa-card" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="tpa-header">
                  <h4>{tpa.tpaName}</h4>
                  <span className={`status ${tpa.status?.toLowerCase().replace(' ', '-')}`}>{tpa.status}</span>
                </div>

                <div className="tpa-details">
                  <p><strong>TPA Code:</strong> {tpa.tpaCode}</p>
                  <p><strong>Contact:</strong> {tpa.contactPerson}</p>
                  {tpa.phone && <p><strong>Phone:</strong> {tpa.phone}</p>}
                  {tpa.totalClaims && <p><strong>Claims:</strong> {tpa.totalClaims}</p>}
                </div>

                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => setExpandedTPA(expandedTPA === tpa.id ? null : tpa.id)}
                >
                  {expandedTPA === tpa.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedTPA === tpa.id && (
                  <div className="tpa-expanded">
                    {tpa.email && <p><strong>Email:</strong> {tpa.email}</p>}
                    {tpa.address && <p><strong>Address:</strong> {tpa.address}</p>}
                    {tpa.empanelDate && <p><strong>Empaneled:</strong> {tpa.empanelDate}</p>}
                    {tpa.networkHospitals && <p><strong>Network Hospitals:</strong> {tpa.networkHospitals}</p>}
                    {tpa.approvedClaims && <p><strong>Approved Claims:</strong> {tpa.approvedClaims}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No TPA providers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TPAPage;
