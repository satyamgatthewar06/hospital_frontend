import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/InsurancePoliciesPage.css';

const POLICY_TYPES = ['Health Insurance', 'Critical Illness', 'Accident Coverage', 'Maternity Coverage', 'Senior Citizen'];

const InsurancePoliciesPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const policies = ctx.insurancePolicies || [];
  const addPolicy = ctx.addInsurancePolicy || (() => {});

  const [form, setForm] = useState({
    policyNumber: '',
    policyName: '',
    patientName: '',
    patientId: '',
    policyType: '',
    coverageAmount: '',
    premiumAmount: '',
    startDate: '',
    expiryDate: '',
    status: 'Active',
    insurer: '',
  });

  const [expandedPolicy, setExpandedPolicy] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.policyNumber && form.patientName && form.coverageAmount) {
      addPolicy({
        id: Date.now(),
        ...form,
      });
      setForm({
        policyNumber: '',
        policyName: '',
        patientName: '',
        patientId: '',
        policyType: '',
        coverageAmount: '',
        premiumAmount: '',
        startDate: '',
        expiryDate: '',
        status: 'Active',
        insurer: '',
      });
    }
  };

  const policyStats = useMemo(() => {
    return {
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.status === 'Active').length,
      totalCoverage: policies.reduce((sum, p) => sum + (parseInt(p.coverageAmount) || 0), 0),
      totalPremium: policies.reduce((sum, p) => sum + (parseInt(p.premiumAmount) || 0), 0),
    };
  }, [policies]);

  return (
    <div className="policies-page fade-in">
      <h1>Insurance Policies Management</h1>

      {/* Policies Statistics */}
      <div className="policies-stats card">
        <h2>Policies Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Policies</span>
            <span className="stat-value">{policyStats.totalPolicies}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Policies</span>
            <span className="stat-value">{policyStats.activePolicies}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Coverage</span>
            <span className="stat-value">₹{policyStats.totalCoverage}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Premium</span>
            <span className="stat-value">₹{policyStats.totalPremium}</span>
          </div>
        </div>
      </div>

      {/* Add Policy Form */}
      <div className="add-policy-form card">
        <h2>Register New Insurance Policy</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Policy Number *</label>
              <input
                type="text"
                name="policyNumber"
                value={form.policyNumber}
                onChange={handleChange}
                placeholder="POL-2024-001"
                required
              />
            </div>
            <div className="form-group">
              <label>Policy Name</label>
              <input
                type="text"
                name="policyName"
                value={form.policyName}
                onChange={handleChange}
                placeholder="Gold Health Plan"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Patient full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                placeholder="P-12345"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Policy Type</label>
              <select name="policyType" value={form.policyType} onChange={handleChange}>
                <option value="">-- Select Policy Type --</option>
                {POLICY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Insurance Company</label>
              <input
                type="text"
                name="insurer"
                value={form.insurer}
                onChange={handleChange}
                placeholder="Insurance Company Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Coverage Amount (₹) *</label>
              <input
                type="number"
                name="coverageAmount"
                value={form.coverageAmount}
                onChange={handleChange}
                placeholder="500000"
                required
              />
            </div>
            <div className="form-group">
              <label>Premium Amount (₹)</label>
              <input
                type="number"
                name="premiumAmount"
                value={form.premiumAmount}
                onChange={handleChange}
                placeholder="15000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Register Policy</button>
        </form>
      </div>

      {/* Policies List */}
      <div className="policies-list card">
        <h2>All Policies ({policies.length})</h2>
        <div className="policies-grid">
          {policies.length > 0 ? (
            policies.map((policy, idx) => (
              <div key={policy.id} className="policy-card" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="policy-header">
                  <h4>{policy.policyNumber}</h4>
                  <span className={`status ${policy.status?.toLowerCase()}`}>{policy.status}</span>
                </div>

                <div className="policy-details">
                  <p><strong>Patient:</strong> {policy.patientName}</p>
                  <p><strong>Coverage:</strong> ₹{policy.coverageAmount}</p>
                  {policy.policyType && <p><strong>Type:</strong> {policy.policyType}</p>}
                  {policy.premiumAmount && <p><strong>Premium:</strong> ₹{policy.premiumAmount}</p>}
                </div>

                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
                >
                  {expandedPolicy === policy.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedPolicy === policy.id && (
                  <div className="policy-expanded">
                    {policy.policyName && <p><strong>Plan Name:</strong> {policy.policyName}</p>}
                    {policy.insurer && <p><strong>Insurer:</strong> {policy.insurer}</p>}
                    {policy.startDate && <p><strong>Start Date:</strong> {policy.startDate}</p>}
                    {policy.expiryDate && <p><strong>Expiry Date:</strong> {policy.expiryDate}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No insurance policies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsurancePoliciesPage;
