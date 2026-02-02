import React, { useState, useEffect } from 'react';
import tpaService from '../services/tpaService';
import '../styles/TPAPage.css';

const TPAPage = () => {
  const [activeTab, setActiveTab] = useState('tpaList');
  const [tpas, setTpas] = useState([]);
  const [claims, setClaims] = useState([]);
  const [showTPAForm, setShowTPAForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedTPA, setSelectedTPA] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTpas(tpaService.getAllTPAs());
    setClaims(tpaService.getAllClaims());
  };

  const handleAddTPA = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson || !formData.contactNumber) {
      alert('Please fill required fields');
      return;
    }

    tpaService.addTPA({
      name: formData.name,
      contactPerson: formData.contactPerson,
      contactNumber: formData.contactNumber,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      panNumber: formData.panNumber,
      networkLimit: parseFloat(formData.networkLimit) || 0,
      agreementStartDate: formData.agreementStartDate,
      agreementEndDate: formData.agreementEndDate,
    });

    loadData();
    setFormData({});
    setShowTPAForm(false);
    alert('TPA registered successfully');
  };

  const handleAddClaim = (e) => {
    e.preventDefault();
    if (!formData.tpaId || !formData.patientId || !formData.billId) {
      alert('Please fill required fields');
      return;
    }

    tpaService.addClaim({
      tpaId: formData.tpaId,
      patientId: formData.patientId,
      billId: formData.billId,
      patientName: formData.patientName,
      claimAmount: parseFloat(formData.claimAmount) || 0,
      claimDescription: formData.claimDescription,
      documentUploaded: formData.documentUploaded || false,
    });

    loadData();
    setFormData({});
    setShowClaimForm(false);
    alert('Claim registered successfully');
  };

  const handleUpdateClaimStatus = (claimId, newStatus) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    let approvedAmount = claim.approvedAmount || 0;
    if (newStatus === 'approved') {
      approvedAmount = claim.claimAmount;
    }

    tpaService.updateClaim(claimId, {
      status: newStatus,
      approvedAmount: newStatus === 'approved' ? claim.claimAmount : 0,
      updatedAt: new Date().toISOString(),
    });

    loadData();
  };

  const deleteTPA = (id) => {
    if (window.confirm('Are you sure you want to delete this TPA?')) {
      tpaService.deleteTPA(id);
      loadData();
    }
  };

  const filteredTPAs = tpas.filter(tpa => {
    const matchesSearch = tpa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tpa.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredClaims = claims.filter(claim => {
    if (filterStatus !== 'all' && claim.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="tpa-page">
      <h1>🤝 TPA (Third Party Administrator) Management</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'tpaList' ? 'active' : ''}`}
          onClick={() => setActiveTab('tpaList')}
        >
          📋 TPA List
        </button>
        <button
          className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          📄 Claims
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      {/* TPA List Tab */}
      {activeTab === 'tpaList' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Registered TPAs</h2>
            <button className="btn-primary" onClick={() => setShowTPAForm(true)}>
              ➕ Add New TPA
            </button>
          </div>

          {/* TPA Form */}
          {showTPAForm && (
            <div className="form-card">
              <h3>Register New TPA</h3>
              <form onSubmit={handleAddTPA}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Organization Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="TPA Organization Name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input
                      type="text"
                      value={formData.contactPerson || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Contact person name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      value={formData.contactNumber || ''}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>

                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      value={formData.panNumber || ''}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      placeholder="PAN number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Network Limit (₹)</label>
                    <input
                      type="number"
                      value={formData.networkLimit || ''}
                      onChange={(e) => setFormData({ ...formData, networkLimit: e.target.value })}
                      placeholder="Maximum claim amount"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Full address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>Agreement Start Date</label>
                    <input
                      type="date"
                      value={formData.agreementStartDate || ''}
                      onChange={(e) => setFormData({ ...formData, agreementStartDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Agreement End Date</label>
                    <input
                      type="date"
                      value={formData.agreementEndDate || ''}
                      onChange={(e) => setFormData({ ...formData, agreementEndDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">Save TPA</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowTPAForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by TPA name or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TPA List */}
          {filteredTPAs.length === 0 ? (
            <div className="empty-state">
              <p>No TPAs registered yet</p>
            </div>
          ) : (
            <div className="tpa-grid">
              {filteredTPAs.map((tpa) => (
                <div key={tpa.id} className="tpa-card">
                  <div className="card-header">
                    <h3>{tpa.name}</h3>
                    <span className={`status-badge ${tpa.status}`}>{tpa.status?.toUpperCase()}</span>
                  </div>

                  <div className="card-body">
                    <p><strong>ID:</strong> {tpa.id}</p>
                    <p><strong>Contact:</strong> {tpa.contactPerson}</p>
                    <p><strong>Phone:</strong> {tpa.contactNumber}</p>
                    <p><strong>Email:</strong> {tpa.email || '—'}</p>
                    <p><strong>City:</strong> {tpa.city || '—'}</p>
                    <p><strong>Network Limit:</strong> ₹{(tpa.networkLimit || 0).toLocaleString('en-IN')}</p>
                    <p><strong>Total Claims:</strong> {tpa.totalClaims || 0}</p>
                    <p><strong>Approved Claims:</strong> {tpa.approvedClaims || 0}</p>
                    <p><strong>Approved Amount:</strong> ₹{(tpa.approvedAmount || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn-small"
                      onClick={() => {
                        setSelectedTPA(tpa);
                        setActiveTab('claims');
                      }}
                    >
                      View Claims
                    </button>
                    <button className="btn-small btn-danger" onClick={() => deleteTPA(tpa.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claims Tab */}
      {activeTab === 'claims' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Claim Management</h2>
            <button className="btn-primary" onClick={() => setShowClaimForm(true)}>
              ➕ Register New Claim
            </button>
          </div>

          {/* Claim Form */}
          {showClaimForm && (
            <div className="form-card">
              <h3>Register New Claim</h3>
              <form onSubmit={handleAddClaim}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>TPA *</label>
                    <select
                      value={formData.tpaId || ''}
                      onChange={(e) => setFormData({ ...formData, tpaId: e.target.value })}
                    >
                      <option value="">Select TPA</option>
                      {tpas.map((tpa) => (
                        <option key={tpa.id} value={tpa.id}>
                          {tpa.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Patient ID *</label>
                    <input
                      type="text"
                      value={formData.patientId || ''}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      placeholder="Patient ID"
                    />
                  </div>

                  <div className="form-group">
                    <label>Patient Name</label>
                    <input
                      type="text"
                      value={formData.patientName || ''}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="Patient name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bill ID *</label>
                    <input
                      type="text"
                      value={formData.billId || ''}
                      onChange={(e) => setFormData({ ...formData, billId: e.target.value })}
                      placeholder="Bill ID"
                    />
                  </div>

                  <div className="form-group">
                    <label>Claim Amount (₹) *</label>
                    <input
                      type="number"
                      value={formData.claimAmount || ''}
                      onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                      placeholder="Claim amount"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Claim Description</label>
                    <textarea
                      value={formData.claimDescription || ''}
                      onChange={(e) => setFormData({ ...formData, claimDescription: e.target.value })}
                      placeholder="Describe the claim details"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">Register Claim</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowClaimForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter */}
          <div className="filter-bar">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Claims</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
            </select>
          </div>

          {/* Claims Table */}
          {filteredClaims.length === 0 ? (
            <div className="empty-state">
              <p>No claims found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="claims-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Patient</th>
                    <th>Bill ID</th>
                    <th>TPA</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td><code>{claim.id}</code></td>
                      <td>{claim.patientName || claim.patientId}</td>
                      <td>{claim.billId}</td>
                      <td>{tpas.find(t => t.id === claim.tpaId)?.name || '—'}</td>
                      <td>₹{(claim.claimAmount || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`status-badge ${claim.status}`}>
                          {claim.status?.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                      <td>
                        {claim.status === 'pending' && (
                          <>
                            <button
                              className="action-btn approve"
                              onClick={() => handleUpdateClaimStatus(claim.id, 'approved')}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="action-btn reject"
                              onClick={() => handleUpdateClaimStatus(claim.id, 'rejected')}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        {claim.status === 'approved' && (
                          <button
                            className="action-btn disburse"
                            onClick={() => handleUpdateClaimStatus(claim.id, 'disbursed')}
                          >
                            💰 Disburse
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <h2>TPA Analytics & Reports</h2>
          <div className="analytics-grid">
            {tpas.map((tpa) => {
              const claimsForTPA = tpaService.getClaimsByTPA(tpa.id);
              const statusReport = tpaService.getClaimStatusReport(tpa.id);
              const coverage = tpaService.getTPACoverage(tpa.id);

              return (
                <div key={tpa.id} className="analytics-card">
                  <h3>{tpa.name}</h3>
                  <div className="analytics-content">
                    <div className="stat-row">
                      <span>Total Claims:</span>
                      <strong>{statusReport.total}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Pending:</span>
                      <strong className="pending">{statusReport.pending}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Approved:</span>
                      <strong className="approved">{statusReport.approved}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Rejected:</span>
                      <strong className="rejected">{statusReport.rejected}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Disbursed:</span>
                      <strong className="disbursed">{statusReport.disbursed}</strong>
                    </div>
                    <div className="stat-row highlight">
                      <span>Network Utilized:</span>
                      <strong>
                        ₹{(coverage.utilized || 0).toLocaleString('en-IN')} / ₹{(coverage.total || 0).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(coverage.utilization || 0, 100)}%` }}
                      />
                    </div>
                    <div className="stat-row small">
                      <span>Utilization:</span>
                      <strong>{(coverage.utilization || 0).toFixed(2)}%</strong>
                    </div>
                    <div className="stat-row small">
                      <span>Avg Processing Time:</span>
                      <strong>{statusReport.averageProcessingTime} days</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TPAPage;
