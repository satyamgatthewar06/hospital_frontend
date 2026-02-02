// Enhanced TPA Service with Insurance Policies and Advanced Claims
class EnhancedTPAService {
  constructor() {
    this.tpaKey = 'hms_tpa_v2';
    this.policiesKey = 'hms_insurance_policies_v1';
    this.claimsKey = 'hms_tpa_claims_v2';
    this.tpaBillsKey = 'hms_tpa_bills_v1';
  }

  // ============ INSURANCE POLICY MANAGEMENT ============

  getAllPolicies() {
    try {
      return JSON.parse(localStorage.getItem(this.policiesKey) || '[]');
    } catch {
      return [];
    }
  }

  getPoliciesByPatient(patientId) {
    const policies = this.getAllPolicies();
    return policies.filter(p => p.patientId === patientId);
  }

  getPoliciesByTPA(tpaId) {
    const policies = this.getAllPolicies();
    return policies.filter(p => p.tpaId === tpaId);
  }

  addPolicy(policyData) {
    const policies = this.getAllPolicies();
    const newPolicy = {
      id: `POL-${Date.now()}`,
      ...policyData,
      createdAt: new Date().toISOString(),
      status: 'active',
      claimsCount: 0,
      totalClaimed: 0,
      totalApproved: 0,
      totalDisbursed: 0,
      utilizationPercentage: 0,
    };
    policies.push(newPolicy);
    localStorage.setItem(this.policiesKey, JSON.stringify(policies));
    return newPolicy;
  }

  updatePolicy(id, updates) {
    const policies = this.getAllPolicies();
    const index = policies.findIndex(p => p.id === id);
    if (index !== -1) {
      policies[index] = { ...policies[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.policiesKey, JSON.stringify(policies));
      return policies[index];
    }
    return null;
  }

  deletePolicy(id) {
    const policies = this.getAllPolicies();
    const filtered = policies.filter(p => p.id !== id);
    localStorage.setItem(this.policiesKey, JSON.stringify(filtered));
  }

  // ============ ADVANCED CLAIM MANAGEMENT ============

  getAllClaims() {
    try {
      return JSON.parse(localStorage.getItem(this.claimsKey) || '[]');
    } catch {
      return [];
    }
  }

  getClaimsByTPA(tpaId) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.tpaId === tpaId);
  }

  getClaimsByPolicy(policyId) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.policyId === policyId);
  }

  getClaimsByPatient(patientId) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.patientId === patientId);
  }

  addClaim(claimData) {
    const claims = this.getAllClaims();
    const newClaim = {
      id: `CLM-${Date.now()}`,
      ...claimData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      authorizationNumber: `AUTH-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      documents: [],
      tpaResponse: null,
      approvedAmount: 0,
      deductionAmount: 0,
      payableAmount: 0,
      remarks: '',
    };
    claims.push(newClaim);
    localStorage.setItem(this.claimsKey, JSON.stringify(claims));
    
    // Update policy stats
    this.updatePolicyStats(claimData.policyId);
    
    return newClaim;
  }

  updateClaim(id, updates) {
    const claims = this.getAllClaims();
    const index = claims.findIndex(c => c.id === id);
    if (index !== -1) {
      const oldClaim = claims[index];
      claims[index] = { ...claims[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.claimsKey, JSON.stringify(claims));

      if (updates.status && updates.status !== oldClaim.status) {
        this.updatePolicyStats(oldClaim.policyId);
      }

      return claims[index];
    }
    return null;
  }

  deleteClaim(id) {
    const claims = this.getAllClaims();
    const claim = claims.find(c => c.id === id);
    if (claim) {
      const filtered = claims.filter(c => c.id !== id);
      localStorage.setItem(this.claimsKey, JSON.stringify(filtered));
      this.updatePolicyStats(claim.policyId);
    }
  }

  addDocumentToClaim(claimId, document) {
    const claim = this.getAllClaims().find(c => c.id === claimId);
    if (claim) {
      const documents = claim.documents || [];
      documents.push({
        id: `DOC-${Date.now()}`,
        name: document.name,
        type: document.type,
        size: document.size,
        uploadDate: new Date().toISOString(),
        base64: document.base64,
      });
      return this.updateClaim(claimId, { documents });
    }
    return null;
  }

  // ============ CLAIM APPROVAL & PROCESSING ============

  approveClaim(claimId, approvedAmount, deductionAmount, remarks) {
    const payableAmount = approvedAmount - deductionAmount;
    return this.updateClaim(claimId, {
      status: 'approved',
      approvedAmount,
      deductionAmount,
      payableAmount,
      remarks,
      tpaResponse: {
        status: 'approved',
        approvalDate: new Date().toISOString(),
        approvedAmount,
        deductionAmount,
        payableAmount,
        remarks,
      },
    });
  }

  rejectClaim(claimId, reason) {
    return this.updateClaim(claimId, {
      status: 'rejected',
      remarks: reason,
      tpaResponse: {
        status: 'rejected',
        rejectionDate: new Date().toISOString(),
        reason,
      },
    });
  }

  disburseClaim(claimId) {
    const claim = this.getAllClaims().find(c => c.id === claimId);
    if (claim && claim.status === 'approved') {
      return this.updateClaim(claimId, {
        status: 'disbursed',
        disbursementDate: new Date().toISOString(),
      });
    }
    return null;
  }

  // ============ TPA BILLING ============

  getAllTPABills() {
    try {
      return JSON.parse(localStorage.getItem(this.tpaBillsKey) || '[]');
    } catch {
      return [];
    }
  }

  getTPABillsByTPA(tpaId) {
    const bills = this.getAllTPABills();
    return bills.filter(b => b.tpaId === tpaId);
  }

  generateTPABill(tpaId, claimIds, billingPeriod) {
    const claims = this.getAllClaims().filter(c => claimIds.includes(c.id) && c.tpaId === tpaId);
    
    if (claims.length === 0) return null;

    const billAmount = claims.reduce((sum, c) => sum + (c.payableAmount || 0), 0);
    const bill = {
      id: `TPABILL-${Date.now()}`,
      tpaId,
      claimIds,
      billingPeriod,
      claimsCount: claims.length,
      billAmount,
      status: 'generated',
      createdDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidAmount: 0,
      paymentDate: null,
      details: claims.map(c => ({
        claimId: c.id,
        claimAmount: c.claimAmount,
        approvedAmount: c.approvedAmount,
        deductionAmount: c.deductionAmount,
        payableAmount: c.payableAmount,
      })),
    };

    const bills = this.getAllTPABills();
    bills.push(bill);
    localStorage.setItem(this.tpaBillsKey, JSON.stringify(bills));

    return bill;
  }

  updateTPABillPayment(billId, paidAmount) {
    const bills = this.getAllTPABills();
    const index = bills.findIndex(b => b.id === billId);
    if (index !== -1) {
      bills[index] = {
        ...bills[index],
        paidAmount,
        status: paidAmount >= bills[index].billAmount ? 'paid' : 'partial',
        paymentDate: paidAmount > 0 ? new Date().toISOString() : null,
      };
      localStorage.setItem(this.tpaBillsKey, JSON.stringify(bills));
      return bills[index];
    }
    return null;
  }

  // ============ CALCULATIONS ============

  calculatePolicyUtilization(policyId) {
    const policy = this.getAllPolicies().find(p => p.id === policyId);
    if (!policy) return 0;

    const utilized = policy.totalApproved || 0;
    const limit = policy.coverageAmount || 0;
    return limit > 0 ? (utilized / limit) * 100 : 0;
  }

  calculateClaimDeductions(claimAmount, policyDetails) {
    let deductions = 0;

    // Co-pay deduction
    if (policyDetails.copayPercentage) {
      deductions += (claimAmount * policyDetails.copayPercentage) / 100;
    }

    // Fixed deductible
    if (policyDetails.fixedDeductible) {
      deductions += policyDetails.fixedDeductible;
    }

    // Limit deduction to claim amount
    return Math.min(deductions, claimAmount);
  }

  // ============ STATISTICS & REPORTING ============

  updatePolicyStats(policyId) {
    const policy = this.getAllPolicies().find(p => p.id === policyId);
    if (!policy) return;

    const claims = this.getClaimsByPolicy(policyId);
    const stats = {
      claimsCount: claims.length,
      totalClaimed: claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0),
      totalApproved: claims.filter(c => c.status === 'approved' || c.status === 'disbursed')
        .reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
      totalDisbursed: claims.filter(c => c.status === 'disbursed')
        .reduce((sum, c) => sum + (c.payableAmount || 0), 0),
      utilizationPercentage: this.calculatePolicyUtilization(policyId),
    };

    this.updatePolicy(policyId, stats);
  }

  getTPADashboard(tpaId) {
    const claims = this.getClaimsByTPA(tpaId);
    const bills = this.getTPABillsByTPA(tpaId);

    return {
      totalClaims: claims.length,
      pendingClaims: claims.filter(c => c.status === 'pending').length,
      approvedClaims: claims.filter(c => c.status === 'approved').length,
      disbursedClaims: claims.filter(c => c.status === 'disbursed').length,
      rejectedClaims: claims.filter(c => c.status === 'rejected').length,
      
      claimAmounts: {
        totalClaimed: claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0),
        totalApproved: claims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
        totalDeducted: claims.reduce((sum, c) => sum + (c.deductionAmount || 0), 0),
        totalPayable: claims.reduce((sum, c) => sum + (c.payableAmount || 0), 0),
        totalDisbursed: claims.filter(c => c.status === 'disbursed')
          .reduce((sum, c) => sum + (c.payableAmount || 0), 0),
      },

      billSummary: {
        totalBills: bills.length,
        generatedBills: bills.filter(b => b.status === 'generated').length,
        paidBills: bills.filter(b => b.status === 'paid').length,
        partialBills: bills.filter(b => b.status === 'partial').length,
        totalBillAmount: bills.reduce((sum, b) => sum + (b.billAmount || 0), 0),
        totalPaidAmount: bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0),
        totalPendingAmount: bills.reduce((sum, b) => sum + ((b.billAmount || 0) - (b.paidAmount || 0)), 0),
      },

      claims,
      bills,
    };
  }

  getClaimDetails(claimId) {
    const claim = this.getAllClaims().find(c => c.id === claimId);
    const policy = claim ? this.getAllPolicies().find(p => p.id === claim.policyId) : null;
    const tpa = claim ? this.getAllTPAs().find(t => t.id === claim.tpaId) : null;

    return {
      claim,
      policy,
      tpa,
    };
  }

  getAllTPAs() {
    try {
      return JSON.parse(localStorage.getItem(this.tpaKey) || '[]');
    } catch {
      return [];
    }
  }

  getTPAById(id) {
    return this.getAllTPAs().find(t => t.id === id);
  }
}

export default new EnhancedTPAService();
