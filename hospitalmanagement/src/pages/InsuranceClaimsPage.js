import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/InsuranceClaimsPage.css';

const CLAIM_STATUS = ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid'];

const InsuranceClaimsPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const claims = ctx.insuranceClaims || [];
  const addClaim = ctx.addInsuranceClaim || (() => {});

  const [form, setForm] = useState({
    claimNumber: '',
    patientName: '',
    patientId: '',
    policyNumber: '',
    claimAmount: '',
    claimDate: '',
    claimReason: '',
    status: 'Submitted',
    approvedAmount: '',
    remarks: '',
  });

  const [expandedClaim, setExpandedClaim] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.claimNumber && form.patientName && form.claimAmount) {
      addClaim({
        id: Date.now(),
        ...form,
        submissionDate: new Date().toISOString().split('T')[0],
      });
      setForm({
        claimNumber: '',
        patientName: '',
        patientId: '',
        policyNumber: '',
        claimAmount: '',
        claimDate: '',
        claimReason: '',
        status: 'Submitted',
        approvedAmount: '',
        remarks: '',
      });
    }
  };

  const claimStats = useMemo(() => {
    return {
      totalClaims: claims.length,
      totalAmount: claims.reduce((sum, c) => sum + (parseInt(c.claimAmount) || 0), 0),
      approvedClaims: claims.filter(c => c.status === 'Approved').length,
      approvedAmount: claims.reduce((sum, c) => sum + (c.status === 'Approved' ? parseInt(c.approvedAmount) || 0 : 0), 0),
      pendingClaims: claims.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length,
    };
  }, [claims]);

  return (
    <div className="claims-page fade-in">
      <h1>Insurance Claims Management</h1>

      {/* Claims Statistics */}
      <div className="claims-stats card">
        <h2>Claims Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Claims</span>
            <span className="stat-value">{claimStats.totalClaims}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Amount Claimed</span>
            <span className="stat-value">₹{claimStats.totalAmount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approved Claims</span>
            <span className="stat-value">{claimStats.approvedClaims}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approved Amount</span>
            <span className="stat-value">₹{claimStats.approvedAmount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{claimStats.pendingClaims}</span>
          </div>
        </div>
      </div>

      {/* Add Claim Form */}
      <div className="add-claim-form card">
        <h2>Submit New Insurance Claim</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Claim Number *</label>
              <input
                type="text"
                name="claimNumber"
                value={form.claimNumber}
                onChange={handleChange}
                placeholder="CLM-2024-001"
                required
              />
            </div>
            <div className="form-group">
              <label>Policy Number</label>
              <input
                type="text"
                name="policyNumber"
                value={form.policyNumber}
                onChange={handleChange}
                placeholder="POL-XXXXXXXXXX"
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
              <label>Claim Amount (₹) *</label>
              <input
                type="number"
                name="claimAmount"
                value={form.claimAmount}
                onChange={handleChange}
                placeholder="50000"
                required
              />
            </div>
            <div className="form-group">
              <label>Claim Date</label>
              <input
                type="date"
                name="claimDate"
                value={form.claimDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Claim Reason</label>
              <input
                type="text"
                name="claimReason"
                value={form.claimReason}
                onChange={handleChange}
                placeholder="e.g., Hospitalization, Surgery"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {CLAIM_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Approved Amount (₹)</label>
              <input
                type="number"
                name="approvedAmount"
                value={form.approvedAmount}
                onChange={handleChange}
                placeholder="45000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Additional notes or comments"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit Claim</button>
        </form>
      </div>

      {/* Claims List */}
      <div className="claims-list card">
        <h2>All Claims ({claims.length})</h2>
        <div className="claims-grid">
          {claims.length > 0 ? (
            claims.map((claim, idx) => (
              <div key={claim.id} className="claim-card" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="claim-header">
                  <h4>{claim.claimNumber}</h4>
                  <span className={`status ${claim.status?.toLowerCase().replace(' ', '-')}`}>{claim.status}</span>
                </div>

                <div className="claim-details">
                  <p><strong>Patient:</strong> {claim.patientName}</p>
                  <p><strong>Claim Amount:</strong> ₹{claim.claimAmount}</p>
                  {claim.approvedAmount && <p><strong>Approved:</strong> ₹{claim.approvedAmount}</p>}
                  {claim.policyNumber && <p><strong>Policy:</strong> {claim.policyNumber}</p>}
                </div>

                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => setExpandedClaim(expandedClaim === claim.id ? null : claim.id)}
                >
                  {expandedClaim === claim.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedClaim === claim.id && (
                  <div className="claim-expanded">
                    {claim.claimReason && <p><strong>Reason:</strong> {claim.claimReason}</p>}
                    {claim.claimDate && <p><strong>Claim Date:</strong> {claim.claimDate}</p>}
                    {claim.remarks && <p><strong>Remarks:</strong> {claim.remarks}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No insurance claims found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimsPage;
