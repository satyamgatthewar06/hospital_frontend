// TPA (Third Party Administrator) Service
class TPAService {
  constructor() {
    this.storageKey = 'hms_tpa_v1';
    this.claimsKey = 'hms_tpa_claims_v1';
  }

  // TPA Management Methods
  getAllTPAs() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  getTPAById(id) {
    const tpas = this.getAllTPAs();
    return tpas.find(t => t.id === id);
  }

  addTPA(tpaData) {
    const tpas = this.getAllTPAs();
    const newTPA = {
      id: `TPA-${Date.now()}`,
      ...tpaData,
      createdAt: new Date().toISOString(),
      status: 'active',
      totalClaims: 0,
      approvedClaims: 0,
      rejectedClaims: 0,
      totalAmount: 0,
      approvedAmount: 0,
    };
    tpas.push(newTPA);
    localStorage.setItem(this.storageKey, JSON.stringify(tpas));
    return newTPA;
  }

  updateTPA(id, updates) {
    const tpas = this.getAllTPAs();
    const index = tpas.findIndex(t => t.id === id);
    if (index !== -1) {
      tpas[index] = { ...tpas[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.storageKey, JSON.stringify(tpas));
      return tpas[index];
    }
    return null;
  }

  deleteTPA(id) {
    const tpas = this.getAllTPAs();
    const filtered = tpas.filter(t => t.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  // Claims Management
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

  getClaimsByPatient(patientId) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.patientId === patientId);
  }

  addClaim(claimData) {
    const claims = this.getAllClaims();
    const newClaim = {
      id: `CLAIM-${Date.now()}`,
      ...claimData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      authorizationNumber: `AUTH-${Date.now()}`,
      claimAmount: 0,
      approvedAmount: 0,
      disbursedAmount: 0,
    };
    claims.push(newClaim);
    localStorage.setItem(this.claimsKey, JSON.stringify(claims));

    // Update TPA stats
    this.updateTPAStats(claimData.tpaId);
    
    return newClaim;
  }

  updateClaim(id, updates) {
    const claims = this.getAllClaims();
    const index = claims.findIndex(c => c.id === id);
    if (index !== -1) {
      const oldClaim = claims[index];
      claims[index] = { ...claims[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.claimsKey, JSON.stringify(claims));

      // Update TPA stats if status changed
      if (updates.status && updates.status !== oldClaim.status) {
        this.updateTPAStats(oldClaim.tpaId);
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
      this.updateTPAStats(claim.tpaId);
    }
  }

  // Update TPA statistics
  updateTPAStats(tpaId) {
    const claims = this.getClaimsByTPA(tpaId);
    const stats = {
      totalClaims: claims.length,
      approvedClaims: claims.filter(c => c.status === 'approved').length,
      rejectedClaims: claims.filter(c => c.status === 'rejected').length,
      pendingClaims: claims.filter(c => c.status === 'pending').length,
      totalAmount: claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0),
      approvedAmount: claims.filter(c => c.status === 'approved').reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
      disbursedAmount: claims.filter(c => c.status === 'disbursed').reduce((sum, c) => sum + (c.disbursedAmount || 0), 0),
    };
    this.updateTPA(tpaId, stats);
  }

  // Link patient to TPA
  linkPatientToTPA(patientId, tpaId, policyNumber, policyAmount) {
    const patients = JSON.parse(localStorage.getItem('hms_patients_v1') || '[]');
    const index = patients.findIndex(p => p.id === patientId);
    if (index !== -1) {
      patients[index] = {
        ...patients[index],
        tpaId,
        policyNumber,
        policyAmount,
        tpaLinkedAt: new Date().toISOString(),
      };
      localStorage.setItem('hms_patients_v1', JSON.stringify(patients));
      return patients[index];
    }
    return null;
  }

  // Get TPA coverage details
  getTPACoverage(tpaId) {
    const tpa = this.getTPAById(tpaId);
    const claims = this.getClaimsByTPA(tpaId);
    
    if (!tpa) return null;

    return {
      tpa,
      claims: claims.length,
      utilized: tpa.approvedAmount || 0,
      total: tpa.networkLimit || 0,
      remaining: (tpa.networkLimit || 0) - (tpa.approvedAmount || 0),
      utilization: ((tpa.approvedAmount || 0) / (tpa.networkLimit || 0)) * 100,
    };
  }

  // Get claim status details
  getClaimStatusReport(tpaId) {
    const claims = this.getClaimsByTPA(tpaId);
    return {
      total: claims.length,
      pending: claims.filter(c => c.status === 'pending').length,
      approved: claims.filter(c => c.status === 'approved').length,
      rejected: claims.filter(c => c.status === 'rejected').length,
      disbursed: claims.filter(c => c.status === 'disbursed').length,
      averageProcessingTime: this.calculateAverageProcessingTime(claims),
    };
  }

  calculateAverageProcessingTime(claims) {
    const completedClaims = claims.filter(c => c.status === 'approved' || c.status === 'rejected');
    if (completedClaims.length === 0) return 0;

    const totalTime = completedClaims.reduce((sum, c) => {
      const created = new Date(c.createdAt);
      const updated = new Date(c.updatedAt || c.createdAt);
      return sum + (updated - created);
    }, 0);

    return Math.round(totalTime / completedClaims.length / (1000 * 60 * 60 * 24)); // in days
  }
}

export default new TPAService();
