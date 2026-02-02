import React, { useState, useEffect } from 'react';
import enhancedTpaService from '../services/enhancedTpaService';
import '../styles/EnhancedTPAPage.css';

const EnhancedTPAPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tpaId, setTpaId] = useState(null);
  const [tpas, setTpas] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [bills, setBills] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  // Form states
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedPolicies, setSelectedPolicies] = useState([]);

  // Policy form state
  const [policyForm, setPolicyForm] = useState({
    insuranceCompany: '',
    policyNumber: '',
    coverageAmount: '',
    policyStartDate: '',
    policyEndDate: '',
    copayPercentage: 0,
    fixedDeductible: 0,
    patientId: '',
  });

  // Claim form state
  const [claimForm, setClaimForm] = useState({
    policyId: '',
    patientId: '',
    claimAmount: '',
    serviceDate: '',
    description: '',
    documents: [],
  });

  // Approval form state
  const [approvalForm, setApprovalForm] = useState({
    approvedAmount: '',
    deductionAmount: '',
    remarks: '',
  });

  useEffect(() => {
    loadTPAs();
  }, []);

  useEffect(() => {
    if (tpaId) {
      loadTPAData(tpaId);
    }
  }, [tpaId, activeTab]);

  const loadTPAs = () => {
    const allTpas = enhancedTpaService.getAllTPAs();
    setTpas(allTpas);
    if (allTpas.length > 0 && !tpaId) {
      setTpaId(allTpas[0].id);
    }
  };

  const loadTPAData = (selectedTpaId) => {
    const selectedPolicies = enhancedTpaService.getPoliciesByTPA(selectedTpaId);
    const selectedClaims = enhancedTpaService.getClaimsByTPA(selectedTpaId);
    const selectedBills = enhancedTpaService.getTPABillsByTPA(selectedTpaId);
    const dashboardData = enhancedTpaService.getTPADashboard(selectedTpaId);

    setPolicies(selectedPolicies);
    setClaims(selectedClaims);
    setBills(selectedBills);
    setDashboard(dashboardData);
  };

  // ============ POLICY HANDLERS ============
  const handleAddPolicy = (e) => {
    e.preventDefault();
    if (!policyForm.insuranceCompany || !policyForm.policyNumber || !policyForm.coverageAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const newPolicy = enhancedTpaService.addPolicy({
      ...policyForm,
      tpaId,
      coverageAmount: parseFloat(policyForm.coverageAmount),
      copayPercentage: parseFloat(policyForm.copayPercentage),
      fixedDeductible: parseFloat(policyForm.fixedDeductible),
    });

    setPolicies([...policies, newPolicy]);
    setPolicyForm({
      insuranceCompany: '',
      policyNumber: '',
      coverageAmount: '',
      policyStartDate: '',
      policyEndDate: '',
      copayPercentage: 0,
      fixedDeductible: 0,
      patientId: '',
    });
    setShowPolicyForm(false);
  };

  // ============ CLAIM HANDLERS ============
  const handleAddClaim = (e) => {
    e.preventDefault();
    if (!claimForm.policyId || !claimForm.patientId || !claimForm.claimAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const newClaim = enhancedTpaService.addClaim({
      ...claimForm,
      tpaId,
      claimAmount: parseFloat(claimForm.claimAmount),
    });

    setClaims([...claims, newClaim]);
    setClaimForm({
      policyId: '',
      patientId: '',
      claimAmount: '',
      serviceDate: '',
      description: '',
      documents: [],
    });
    setShowClaimForm(false);
  };

  const handleDocumentUpload = (e, claimId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const document = {
          name: file.name,
          type: file.type,
          size: file.size,
          base64: event.target.result,
        };

        const updatedClaim = enhancedTpaService.addDocumentToClaim(claimId, document);
        if (updatedClaim) {
          setClaims(claims.map(c => c.id === claimId ? updatedClaim : c));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ============ APPROVAL HANDLERS ============
  const handleApproveClaim = (e) => {
    e.preventDefault();
    if (!approvalForm.approvedAmount) {
      alert('Please enter approved amount');
      return;
    }

    const updatedClaim = enhancedTpaService.approveClaim(
      selectedClaim.id,
      parseFloat(approvalForm.approvedAmount),
      parseFloat(approvalForm.deductionAmount || 0),
      approvalForm.remarks
    );

    if (updatedClaim) {
      setClaims(claims.map(c => c.id === selectedClaim.id ? updatedClaim : c));
      setShowApproveForm(false);
      setSelectedClaim(null);
      setApprovalForm({ approvedAmount: '', deductionAmount: '', remarks: '' });
    }
  };

  const handleRejectClaim = (claimId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      const updatedClaim = enhancedTpaService.rejectClaim(claimId, reason);
      if (updatedClaim) {
        setClaims(claims.map(c => c.id === claimId ? updatedClaim : c));
      }
    }
  };

  // ============ BILLING HANDLERS ============
  const handleGenerateBill = (e) => {
    e.preventDefault();
    if (selectedPolicies.length === 0) {
      alert('Please select at least one claim to bill');
      return;
    }

    const period = document.getElementById('billingPeriod')?.value || new Date().toISOString().slice(0, 7);
    const newBill = enhancedTpaService.generateTPABill(tpaId, selectedPolicies, period);

    if (newBill) {
      setBills([...bills, newBill]);
      setSelectedPolicies([]);
      setShowBillingForm(false);
      alert('Bill generated successfully!');
    }
  };

  const handlePayBill = (billId, paidAmount) => {
    const updated = enhancedTpaService.updateTPABillPayment(billId, parseFloat(paidAmount));
    if (updated) {
      setBills(bills.map(b => b.id === billId ? updated : b));
    }
  };

  // ============ RENDER FUNCTIONS ============

  const renderDashboard = () => {
    if (!dashboard) return <div className="no-data">No dashboard data</div>;

    return (
      <div className="dashboard-container">
        <div className="stats-grid">
          <div className="stat-card pending">
            <h3>Pending Claims</h3>
            <p className="stat-value">{dashboard.pendingClaims}</p>
          </div>
          <div className="stat-card approved">
            <h3>Approved Claims</h3>
            <p className="stat-value">{dashboard.approvedClaims}</p>
          </div>
          <div className="stat-card disbursed">
            <h3>Disbursed Claims</h3>
            <p className="stat-value">{dashboard.disbursedClaims}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected Claims</h3>
            <p className="stat-value">{dashboard.rejectedClaims}</p>
          </div>

          <div className="stat-card amount">
            <h3>Total Claimed</h3>
            <p className="stat-value">₹{dashboard.claimAmounts.totalClaimed.toFixed(2)}</p>
          </div>
          <div className="stat-card amount">
            <h3>Total Approved</h3>
            <p className="stat-value">₹{dashboard.claimAmounts.totalApproved.toFixed(2)}</p>
          </div>
          <div className="stat-card amount">
            <h3>Total Deducted</h3>
            <p className="stat-value">₹{dashboard.claimAmounts.totalDeducted.toFixed(2)}</p>
          </div>
          <div className="stat-card amount">
            <h3>Total Disbursed</h3>
            <p className="stat-value">₹{dashboard.claimAmounts.totalDisbursed.toFixed(2)}</p>
          </div>

          <div className="stat-card bill">
            <h3>Generated Bills</h3>
            <p className="stat-value">{dashboard.billSummary.generatedBills}</p>
          </div>
          <div className="stat-card bill">
            <h3>Bill Amount Pending</h3>
            <p className="stat-value">₹{dashboard.billSummary.totalPendingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderPolicies = () => {
    return (
      <div className="section">
        <div className="section-header">
          <h2>Insurance Policies</h2>
          <button className="btn btn-primary" onClick={() => setShowPolicyForm(true)}>
            + New Policy
          </button>
        </div>

        {showPolicyForm && (
          <form className="form-container" onSubmit={handleAddPolicy}>
            <h3>Add New Insurance Policy</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Insurance Company"
                required
                value={policyForm.insuranceCompany}
                onChange={(e) => setPolicyForm({ ...policyForm, insuranceCompany: e.target.value })}
              />
              <input
                type="text"
                placeholder="Policy Number"
                required
                value={policyForm.policyNumber}
                onChange={(e) => setPolicyForm({ ...policyForm, policyNumber: e.target.value })}
              />
              <input
                type="number"
                placeholder="Coverage Amount"
                required
                value={policyForm.coverageAmount}
                onChange={(e) => setPolicyForm({ ...policyForm, coverageAmount: e.target.value })}
              />
              <input
                type="date"
                placeholder="Policy Start Date"
                value={policyForm.policyStartDate}
                onChange={(e) => setPolicyForm({ ...policyForm, policyStartDate: e.target.value })}
              />
              <input
                type="date"
                placeholder="Policy End Date"
                value={policyForm.policyEndDate}
                onChange={(e) => setPolicyForm({ ...policyForm, policyEndDate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Co-pay Percentage (%)"
                value={policyForm.copayPercentage}
                onChange={(e) => setPolicyForm({ ...policyForm, copayPercentage: e.target.value })}
              />
              <input
                type="number"
                placeholder="Fixed Deductible"
                value={policyForm.fixedDeductible}
                onChange={(e) => setPolicyForm({ ...policyForm, fixedDeductible: e.target.value })}
              />
              <input
                type="text"
                placeholder="Patient ID"
                value={policyForm.patientId}
                onChange={(e) => setPolicyForm({ ...policyForm, patientId: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">Save Policy</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPolicyForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="policies-grid">
          {policies.length === 0 ? (
            <div className="no-data">No policies found</div>
          ) : (
            policies.map((policy) => (
              <div key={policy.id} className="policy-card">
                <h4>{policy.insuranceCompany}</h4>
                <p><strong>Policy #:</strong> {policy.policyNumber}</p>
                <p><strong>Coverage:</strong> ₹{policy.coverageAmount}</p>
                <p><strong>Valid:</strong> {policy.policyStartDate} to {policy.policyEndDate}</p>
                <p><strong>Claims:</strong> {policy.claimsCount}</p>
                <p><strong>Utilized:</strong> ₹{policy.totalApproved?.toFixed(2) || 0}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((policy.utilizationPercentage || 0), 100)}%`,
                    }}
                  />
                </div>
                <p className="utilization">{(policy.utilizationPercentage || 0).toFixed(1)}% Utilized</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderClaims = () => {
    return (
      <div className="section">
        <div className="section-header">
          <h2>Insurance Claims</h2>
          <button className="btn btn-primary" onClick={() => setShowClaimForm(true)}>
            + New Claim
          </button>
        </div>

        {showClaimForm && (
          <form className="form-container" onSubmit={handleAddClaim}>
            <h3>Create New Claim</h3>
            <div className="form-grid">
              <select
                required
                value={claimForm.policyId}
                onChange={(e) => setClaimForm({ ...claimForm, policyId: e.target.value })}
              >
                <option value="">Select Policy</option>
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.insuranceCompany} - {p.policyNumber}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Patient ID"
                required
                value={claimForm.patientId}
                onChange={(e) => setClaimForm({ ...claimForm, patientId: e.target.value })}
              />
              <input
                type="number"
                placeholder="Claim Amount"
                required
                value={claimForm.claimAmount}
                onChange={(e) => setClaimForm({ ...claimForm, claimAmount: e.target.value })}
              />
              <input
                type="date"
                placeholder="Service Date"
                required
                value={claimForm.serviceDate}
                onChange={(e) => setClaimForm({ ...claimForm, serviceDate: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={claimForm.description}
                onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">Create Claim</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowClaimForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="claims-table">
          {claims.length === 0 ? (
            <div className="no-data">No claims found</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Patient ID</th>
                  <th>Amount</th>
                  <th>Approved</th>
                  <th>Deduction</th>
                  <th>Payable</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.id}</td>
                    <td>{claim.patientId}</td>
                    <td>₹{claim.claimAmount?.toFixed(2) || 0}</td>
                    <td>₹{claim.approvedAmount?.toFixed(2) || 0}</td>
                    <td>₹{claim.deductionAmount?.toFixed(2) || 0}</td>
                    <td>₹{claim.payableAmount?.toFixed(2) || 0}</td>
                    <td>
                      <span className={`badge badge-${claim.status}`}>{claim.status}</span>
                    </td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td>
                      {claim.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setApprovalForm({
                                approvedAmount: claim.claimAmount,
                                deductionAmount: '0',
                                remarks: '',
                              });
                              setShowApproveForm(true);
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRejectClaim(claim.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showApproveForm && selectedClaim && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Approve Claim: {selectedClaim.id}</h3>
              <form onSubmit={handleApproveClaim}>
                <div className="form-group">
                  <label>Claim Amount: ₹{selectedClaim.claimAmount}</label>
                </div>
                <input
                  type="number"
                  placeholder="Approved Amount"
                  required
                  value={approvalForm.approvedAmount}
                  onChange={(e) => setApprovalForm({ ...approvalForm, approvedAmount: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Deduction Amount"
                  value={approvalForm.deductionAmount}
                  onChange={(e) => setApprovalForm({ ...approvalForm, deductionAmount: e.target.value })}
                />
                <textarea
                  placeholder="Remarks"
                  value={approvalForm.remarks}
                  onChange={(e) => setApprovalForm({ ...approvalForm, remarks: e.target.value })}
                />
                <div className="payable-amount">
                  <strong>
                    Payable Amount: ₹
                    {(
                      (parseFloat(approvalForm.approvedAmount) || 0) -
                      (parseFloat(approvalForm.deductionAmount) || 0)
                    ).toFixed(2)}
                  </strong>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-success">Approve</button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowApproveForm(false);
                      setSelectedClaim(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBilling = () => {
    return (
      <div className="section">
        <div className="section-header">
          <h2>TPA Billing</h2>
          <button className="btn btn-primary" onClick={() => setShowBillingForm(true)}>
            + Generate Bill
          </button>
        </div>

        {showBillingForm && (
          <form className="form-container" onSubmit={handleGenerateBill}>
            <h3>Generate TPA Bill</h3>
            <input
              type="month"
              id="billingPeriod"
              placeholder="Billing Period"
              defaultValue={new Date().toISOString().slice(0, 7)}
            />
            <div className="claims-selection">
              <h4>Select Claims to Bill:</h4>
              {claims
                .filter((c) => c.status === 'approved')
                .map((claim) => (
                  <label key={claim.id}>
                    <input
                      type="checkbox"
                      checked={selectedPolicies.includes(claim.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPolicies([...selectedPolicies, claim.id]);
                        } else {
                          setSelectedPolicies(selectedPolicies.filter((id) => id !== claim.id));
                        }
                      }}
                    />
                    {claim.id} - ₹{claim.payableAmount?.toFixed(2) || 0}
                  </label>
                ))}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">Generate Bill</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowBillingForm(false);
                  setSelectedPolicies([]);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="bills-table">
          {bills.length === 0 ? (
            <div className="no-data">No bills generated</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Period</th>
                  <th>Claims</th>
                  <th>Bill Amount</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.id}</td>
                    <td>{bill.billingPeriod}</td>
                    <td>{bill.claimsCount}</td>
                    <td>₹{bill.billAmount?.toFixed(2) || 0}</td>
                    <td>₹{bill.paidAmount?.toFixed(2) || 0}</td>
                    <td>₹{(bill.billAmount - bill.paidAmount).toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${bill.status}`}>{bill.status}</span>
                    </td>
                    <td>
                      {bill.status !== 'paid' && (
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => {
                            const amount = prompt(`Enter payment amount (Max: ₹${bill.billAmount - bill.paidAmount}):`);
                            if (amount) {
                              handlePayBill(bill.id, amount);
                            }
                          }}
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="enhanced-tpa-page">
      <div className="tpa-header">
        <h1>Enhanced TPA Management</h1>
        <div className="tpa-selector">
          <label>Select TPA:</label>
          <select value={tpaId || ''} onChange={(e) => setTpaId(e.target.value)}>
            {tpas.map((tpa) => (
              <option key={tpa.id} value={tpa.id}>
                {tpa.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          Policies
        </button>
        <button
          className={`tab-button ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          Claims
        </button>
        <button
          className={`tab-button ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'policies' && renderPolicies()}
        {activeTab === 'claims' && renderClaims()}
        {activeTab === 'billing' && renderBilling()}
      </div>
    </div>
  );
};

export default EnhancedTPAPage;
