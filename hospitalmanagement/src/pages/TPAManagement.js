import React, { useState, useContext, useMemo, useEffect } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/TPAManagement.css';

const TPAManagement = () => {
  const { tpaRecords, patients } = useContext(HospitalContext);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    claimNumber: '',
    patientName: '',
    tpaName: '',
    billAmount: 0,
    claimAmount: 0,
    deductionAmount: 0,
    status: 'Pending',
    submissionDate: new Date().toISOString().split('T')[0],
    approvalDate: '',
    remarks: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [localClaims, setLocalClaims] = useState([]);

  useEffect(() => {
    if (tpaRecords && tpaRecords.length > 0) {
      setLocalClaims(tpaRecords);
    }
  }, [tpaRecords]);

  const claims = localClaims || [];
  const tpaCompanies = ['ICICI Lombard', 'HDFC ERGO', 'Apollo Munich', 'Cigna', 'Aditya Birla', 'Bajaj'];
  const claimStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Partial Approval', 'Processing'];

  const stats = useMemo(() => ({
    totalClaims: claims.length,
    pending: claims.filter(c => c.status === 'Pending').length,
    approved: claims.filter(c => c.status === 'Approved').length,
    rejected: claims.filter(c => c.status === 'Rejected').length,
    totalBilled: claims.reduce((sum, c) => sum + c.billAmount, 0),
    totalClaimed: claims.reduce((sum, c) => sum + c.claimAmount, 0),
    totalDeducted: claims.reduce((sum, c) => sum + c.deductionAmount, 0)
  }), [claims]);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const matchesSearch =
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.tpaName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === 'All' || claim.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [claims, searchTerm, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClaim = {
      id: Date.now(),
      ...formData,
      billAmount: parseFloat(formData.billAmount),
      claimAmount: parseFloat(formData.claimAmount),
      deductionAmount: parseFloat(formData.deductionAmount)
    };

    setLocalClaims([...localClaims, newClaim]);

    setFormData({
      claimNumber: '',
      patientName: '',
      tpaName: '',
      billAmount: 0,
      claimAmount: 0,
      deductionAmount: 0,
      status: 'Pending',
      submissionDate: new Date().toISOString().split('T')[0],
      approvalDate: '',
      remarks: ''
    });
    setActiveTab('list');
  };

  const handleDeleteClaim = (id) => {
    setLocalClaims(localClaims.filter(claim => claim.id !== id));
  };

  const handleUpdateStatus = (id, newStatus) => {
    setLocalClaims(localClaims.map(claim => claim.id === id ? { ...claim, status: newStatus } : claim));
  };

  const generateClaimDocument = (claim) => {
    const docContent = `
      <html>
        <head>
          <title>TPA Claim Document</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; }
            .section { margin: 15px 0; }
            .label { font-weight: bold; }
            .value { margin-left: 20px; }
            .summary { background: #f0f0f0; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>TPA CLAIM DOCUMENT</h2>
            <p>Claim ID: ${claim.claimNumber}</p>
          </div>
          
          <div class="section">
            <p class="label">Claim Details</p>
            <div class="value">
              <p>Patient: ${claim.patientName}</p>
              <p>TPA: ${claim.tpaName}</p>
              <p>Submission Date: ${claim.submissionDate}</p>
              <p>Status: ${claim.status}</p>
            </div>
          </div>

          <div class="section summary">
            <p class="label">Financial Summary</p>
            <div class="value">
              <p>Bill Amount: ₹${claim.billAmount.toFixed(2)}</p>
              <p>Claimed Amount: ₹${claim.claimAmount.toFixed(2)}</p>
              <p>Deduction: ₹${claim.deductionAmount.toFixed(2)}</p>
              <p><strong>Patient Liable: ₹${(claim.billAmount - claim.claimAmount).toFixed(2)}</strong></p>
            </div>
          </div>

          ${claim.remarks ? `<div class="section"><p class="label">Remarks:</p><p>${claim.remarks}</p></div>` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(docContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="tpa-management">
      <h1>🏢 TPA Management</h1>

      <div className="tpa-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Claims</span>
            <span className="stat-value">{stats.totalClaims}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">{stats.rejected}</span>
          </div>
        </div>
      </div>

      <div className="financial-summary">
        <div className="summary-grid">
          <div className="summary-item">
            <p className="summary-label">Total Billed</p>
            <p className="summary-value">₹{stats.totalBilled.toLocaleString('en-IN')}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">TPA Claimed</p>
            <p className="summary-value">₹{stats.totalClaimed.toLocaleString('en-IN')}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Total Deductions</p>
            <p className="summary-value">₹{stats.totalDeducted.toLocaleString('en-IN')}</p>
          </div>
          <div className="summary-item patient-liability">
            <p className="summary-label">Patient Liability</p>
            <p className="summary-value">₹{(stats.totalBilled - stats.totalClaimed).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="tabs-navigation">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          📋 Claims List
        </button>
        <button className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
          ➕ New Claim
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="form-section">
          <h2>File New TPA Claim</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Claim Number</label>
                <input
                  type="text"
                  value={formData.claimNumber}
                  onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
                  required
                  placeholder="e.g., CLM-001"
                />
              </div>
              <div className="form-group">
                <label>Patient Name</label>

                <select
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                >
                  <option value="">Select Patient...</option>
                  {patients && patients.map(p => (
                    <option key={p.id} value={p.name || `${p.firstName} ${p.lastName}`}>
                      {p.name || `${p.firstName} ${p.lastName}`} (ID: {p.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>TPA Company</label>
                <select value={formData.tpaName} onChange={(e) => setFormData({ ...formData, tpaName: e.target.value })} required>
                  <option value="">Select TPA...</option>
                  {tpaCompanies.map(tpa => <option key={tpa} value={tpa}>{tpa}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Claim Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  {claimStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bill Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.billAmount}
                  onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Claim Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.claimAmount}
                  onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Deduction Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.deductionAmount}
                  onChange={(e) => setFormData({ ...formData, deductionAmount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Submission Date</label>
                <input
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Additional remarks or notes"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Submit Claim</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="list-section">
          <div className="list-header">
            <h2>TPA Claims</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Search claims..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                {claimStatuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="no-data">No claims found</div>
          ) : (
            <div className="claims-grid">
              {filteredClaims.map((claim, idx) => (
                <div key={idx} className="claim-card">
                  <div className="claim-header">
                    <h4>{claim.claimNumber}</h4>
                    <span className={`status ${claim.status.toLowerCase().replace(' ', '-')}`}>{claim.status}</span>
                  </div>
                  <div className="claim-details">
                    <p><strong>Patient:</strong> {claim.patientName}</p>
                    <p><strong>TPA:</strong> {claim.tpaName}</p>
                    <p><strong>Submitted:</strong> {claim.submissionDate}</p>
                  </div>
                  <div className="claim-amounts">
                    <div className="amount-item">
                      <span>Bill Amount</span>
                      <span className="amount">₹{claim.billAmount.toFixed(2)}</span>
                    </div>
                    <div className="amount-item">
                      <span>Claim Amount</span>
                      <span className="amount claimed">₹{claim.claimAmount.toFixed(2)}</span>
                    </div>
                    <div className="amount-item">
                      <span>Deduction</span>
                      <span className="amount deduction">₹{claim.deductionAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="claim-actions">
                    <button className="btn btn-small btn-primary" onClick={() => generateClaimDocument(claim)}>📄 Document</button>
                    <select
                      value={claim.status}
                      onChange={(e) => handleUpdateStatus(claim.id, e.target.value)}
                      className="status-select"
                    >
                      {claimStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteClaim(claim.id)}>🗑️ Delete</button>
                  </div>
                  {claim.remarks && (
                    <div className="claim-remarks">
                      <p><strong>Notes:</strong> {claim.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TPAManagement;
