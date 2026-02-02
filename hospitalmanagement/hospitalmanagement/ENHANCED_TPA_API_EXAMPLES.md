# Enhanced TPA Service - API Usage Examples

## Service Initialization
```javascript
import enhancedTpaService from '../services/enhancedTpaService';
```

---

## 1. Policy Management API

### Create a New Policy
```javascript
const newPolicy = enhancedTpaService.addPolicy({
  insuranceCompany: 'Apollo Insurance',
  policyNumber: 'POL-2024-001',
  coverageAmount: 100000,
  policyStartDate: '2024-01-01',
  policyEndDate: '2024-12-31',
  copayPercentage: 10,
  fixedDeductible: 500,
  patientId: 'P123',
  tpaId: 'TPA-001'
});

// Response
{
  id: 'POL-1704067200000',
  insuranceCompany: 'Apollo Insurance',
  policyNumber: 'POL-2024-001',
  coverageAmount: 100000,
  status: 'active',
  claimsCount: 0,
  totalClaimed: 0,
  totalApproved: 0,
  utilizationPercentage: 0,
  createdAt: '2024-01-01T00:00:00.000Z'
}
```

### Get All Policies
```javascript
const allPolicies = enhancedTpaService.getAllPolicies();
// Returns array of all policies
```

### Get Policies by Patient
```javascript
const patientPolicies = enhancedTpaService.getPoliciesByPatient('P123');
// Returns policies for patient P123
```

### Get Policies by TPA
```javascript
const tpaPolicies = enhancedTpaService.getPoliciesByTPA('TPA-001');
// Returns all policies associated with TPA-001
```

### Update Policy
```javascript
const updated = enhancedTpaService.updatePolicy('POL-001', {
  policyEndDate: '2025-12-31',
  coverageAmount: 150000
});
// Only specified fields are updated, others retained
```

### Delete Policy
```javascript
enhancedTpaService.deletePolicy('POL-001');
// Policy removed from storage
```

---

## 2. Claim Management API

### Create a New Claim
```javascript
const newClaim = enhancedTpaService.addClaim({
  policyId: 'POL-001',
  patientId: 'P123',
  tpaId: 'TPA-001',
  claimAmount: 5000,
  serviceDate: '2024-01-10',
  description: 'Emergency treatment for acute myocardial infarction'
});

// Response
{
  id: 'CLM-1704067200000',
  policyId: 'POL-001',
  patientId: 'P123',
  tpaId: 'TPA-001',
  claimAmount: 5000,
  status: 'pending',
  authorizationNumber: 'AUTH-1704067200000',
  submissionDate: '2024-01-10T00:00:00.000Z',
  documents: [],
  tpaResponse: null,
  approvedAmount: 0,
  deductionAmount: 0,
  payableAmount: 0,
  createdAt: '2024-01-10T00:00:00.000Z'
}
```

### Get All Claims
```javascript
const allClaims = enhancedTpaService.getAllClaims();
// Returns all claims in system
```

### Get Claims by TPA
```javascript
const tpaClaims = enhancedTpaService.getClaimsByTPA('TPA-001');
// Returns all claims for TPA-001
```

### Get Claims by Policy
```javascript
const policyClaims = enhancedTpaService.getClaimsByPolicy('POL-001');
// Returns all claims under policy POL-001
```

### Get Claims by Patient
```javascript
const patientClaims = enhancedTpaService.getClaimsByPatient('P123');
// Returns all claims for patient P123
```

### Update Claim Status (Temporary)
```javascript
const updated = enhancedTpaService.updateClaim('CLM-001', {
  status: 'in-review',
  remarks: 'Documents received and verified'
});
```

### Delete Claim
```javascript
enhancedTpaService.deleteClaim('CLM-001');
// Claim and associated documents removed
```

---

## 3. Document Management API

### Add Document to Claim
```javascript
// Assuming file is from input or FormData
const file = event.target.files[0];
const reader = new FileReader();

reader.onload = (e) => {
  const documentData = {
    name: file.name,
    type: file.type,
    size: file.size,
    base64: e.target.result  // Base64 encoded file content
  };

  const updatedClaim = enhancedTpaService.addDocumentToClaim('CLM-001', documentData);
  
  // Response includes full claim with new document
  {
    id: 'CLM-001',
    // ... other fields ...
    documents: [
      {
        id: 'DOC-1704067200000',
        name: 'prescription.pdf',
        type: 'application/pdf',
        size: 102400,
        uploadDate: '2024-01-10T00:00:00.000Z',
        base64: 'data:application/pdf;base64,...'
      }
    ]
  }
};

reader.readAsDataURL(file);
```

### Retrieve Documents from Claim
```javascript
const claim = enhancedTpaService.getAllClaims().find(c => c.id === 'CLM-001');
const documents = claim.documents;

// Render or download documents
documents.forEach(doc => {
  console.log(`Document: ${doc.name}, Size: ${doc.size} bytes`);
});
```

---

## 4. Claim Approval & Response API

### Approve a Claim
```javascript
const approvedClaim = enhancedTpaService.approveClaim(
  'CLM-001',           // Claim ID
  4500,                // Approved amount (may be less than claimed)
  1400,                // Deduction amount (co-pay + fixed deductible)
  'Approved with 10% co-pay and 500 deductible. All documents verified.'
);

// Response
{
  id: 'CLM-001',
  status: 'approved',
  approvedAmount: 4500,
  deductionAmount: 1400,
  payableAmount: 3100,
  remarks: 'Approved with 10% co-pay and 500 deductible. All documents verified.',
  tpaResponse: {
    status: 'approved',
    approvalDate: '2024-01-12T10:30:00.000Z',
    approvedAmount: 4500,
    deductionAmount: 1400,
    payableAmount: 3100,
    remarks: 'Approved with 10% co-pay and 500 deductible. All documents verified.'
  },
  updatedAt: '2024-01-12T10:30:00.000Z'
}
```

### Reject a Claim
```javascript
const rejectedClaim = enhancedTpaService.rejectClaim(
  'CLM-001',
  'Treatment not covered under policy. Patient should have sought pre-authorization.'
);

// Response
{
  id: 'CLM-001',
  status: 'rejected',
  remarks: 'Treatment not covered under policy. Patient should have sought pre-authorization.',
  tpaResponse: {
    status: 'rejected',
    rejectionDate: '2024-01-12T10:30:00.000Z',
    reason: 'Treatment not covered under policy. Patient should have sought pre-authorization.'
  },
  updatedAt: '2024-01-12T10:30:00.000Z'
}
```

### Disburse a Claim
```javascript
// Mark an approved claim as disbursed (payment made)
const disbursedClaim = enhancedTpaService.disburseClaim('CLM-001');

// Response
{
  id: 'CLM-001',
  status: 'disbursed',
  disbursementDate: '2024-01-15T00:00:00.000Z',
  // ... other fields unchanged ...
}
```

---

## 5. Deduction Calculation API

### Calculate Deductions for a Claim
```javascript
const policyDetails = {
  copayPercentage: 10,      // 10%
  fixedDeductible: 500      // ₹500
};

const deductions = enhancedTpaService.calculateClaimDeductions(
  5000,                      // Claim amount
  policyDetails
);

// Calculation
// Co-pay: 5000 × 10% = 500
// Fixed Deductible: 500
// Total Deduction: 1000
// Result: 1000
```

---

## 6. TPA Billing API

### Generate TPA Bill
```javascript
const bill = enhancedTpaService.generateTPABill(
  'TPA-001',                           // TPA ID
  ['CLM-001', 'CLM-002', 'CLM-003'],   // Array of claim IDs to bill
  '2024-01'                            // Billing period (YYYY-MM)
);

// Response
{
  id: 'TPABILL-1704067200000',
  tpaId: 'TPA-001',
  claimIds: ['CLM-001', 'CLM-002', 'CLM-003'],
  billingPeriod: '2024-01',
  claimsCount: 3,
  billAmount: 12000,                   // Sum of payable amounts
  status: 'generated',
  createdDate: '2024-02-01T00:00:00.000Z',
  dueDate: '2024-03-02T00:00:00.000Z', // 30 days later
  paidAmount: 0,
  paymentDate: null,
  details: [
    {
      claimId: 'CLM-001',
      claimAmount: 5000,
      approvedAmount: 4500,
      deductionAmount: 1400,
      payableAmount: 3100
    },
    // ... more claims ...
  ]
}
```

### Get All Bills
```javascript
const allBills = enhancedTpaService.getAllTPABills();
// Returns all generated bills
```

### Get Bills for Specific TPA
```javascript
const tpaBills = enhancedTpaService.getTPABillsByTPA('TPA-001');
// Returns bills for TPA-001
```

### Record Payment Against Bill
```javascript
const updatedBill = enhancedTpaService.updateTPABillPayment(
  'TPABILL-001',  // Bill ID
  5000            // Payment amount
);

// Response
{
  id: 'TPABILL-001',
  billAmount: 12000,
  paidAmount: 5000,
  status: 'partial',                   // Changed from 'generated'
  paymentDate: '2024-02-15T10:30:00.000Z',
  // ... other fields ...
}

// After full payment
const updatedBill2 = enhancedTpaService.updateTPABillPayment(
  'TPABILL-001',
  12000  // Full amount
);
// Status becomes 'paid'
```

---

## 7. Analytics & Dashboard API

### Get Policy Utilization
```javascript
const utilization = enhancedTpaService.calculatePolicyUtilization('POL-001');
// Returns: percentage (e.g., 45.5)
```

### Get Complete TPA Dashboard
```javascript
const dashboard = enhancedTpaService.getTPADashboard('TPA-001');

// Response
{
  totalClaims: 25,
  pendingClaims: 3,
  approvedClaims: 15,
  disbursedClaims: 12,
  rejectedClaims: 2,
  
  claimAmounts: {
    totalClaimed: 125000,
    totalApproved: 105000,
    totalDeducted: 25000,
    totalPayable: 80000,
    totalDisbursed: 72000
  },
  
  billSummary: {
    totalBills: 5,
    generatedBills: 2,
    paidBills: 2,
    partialBills: 1,
    totalBillAmount: 85000,
    totalPaidAmount: 65000,
    totalPendingAmount: 20000
  },
  
  claims: [...],  // Array of all claims
  bills: [...]    // Array of all bills
}
```

### Get Claim Details with Related Data
```javascript
const claimInfo = enhancedTpaService.getClaimDetails('CLM-001');

// Response
{
  claim: { id: 'CLM-001', ... },
  policy: { id: 'POL-001', ... },
  tpa: { id: 'TPA-001', ... }
}
```

---

## 8. Practical Workflow Example

### Complete Claim Processing Workflow
```javascript
// Step 1: Create Policy
const policy = enhancedTpaService.addPolicy({
  insuranceCompany: 'Star Health',
  policyNumber: 'SHI-2024-001',
  coverageAmount: 200000,
  policyStartDate: '2024-01-01',
  policyEndDate: '2024-12-31',
  copayPercentage: 10,
  fixedDeductible: 500,
  patientId: 'P001',
  tpaId: 'TPA-001'
});

// Step 2: Create Claim
const claim = enhancedTpaService.addClaim({
  policyId: policy.id,
  patientId: 'P001',
  tpaId: 'TPA-001',
  claimAmount: 10000,
  serviceDate: '2024-01-10',
  description: 'Emergency cardiology treatment'
});

// Step 3: Upload Document
const document = {
  name: 'prescription.pdf',
  type: 'application/pdf',
  size: 102400,
  base64: 'data:application/pdf;base64,JVBERi0xLjQK...'
};

enhancedTpaService.addDocumentToClaim(claim.id, document);

// Step 4: Approve Claim
const approved = enhancedTpaService.approveClaim(
  claim.id,
  9000,      // Approved amount (₹1000 not covered)
  1400,      // Deduction: (₹9000 × 10%) + ₹500
  'Approved'
);
// payableAmount = ₹9000 - ₹1400 = ₹7600

// Step 5: Generate Bill
const bill = enhancedTpaService.generateTPABill(
  'TPA-001',
  [claim.id],
  '2024-01'
);

// Step 6: Record Payment
enhancedTpaService.updateTPABillPayment(bill.id, 7600);
// Bill marked as paid

// Step 7: View Dashboard
const dashboard = enhancedTpaService.getTPADashboard('TPA-001');
// Shows all metrics, claims, and bills
```

---

## 9. Data Validation

### Before creating resources, validate:
```javascript
// Policy validation
if (!policyForm.insuranceCompany || !policyForm.policyNumber) {
  throw new Error('Company and Policy Number are required');
}

// Claim validation
if (!claimForm.policyId || claimForm.claimAmount <= 0) {
  throw new Error('Valid policy and claim amount required');
}

// Deduction validation
if (approvedAmount < deductionAmount) {
  throw new Error('Deduction cannot exceed approved amount');
}
```

---

## 10. Error Handling

### Handling API Results
```javascript
try {
  const result = enhancedTpaService.addPolicy(policyData);
  
  if (!result) {
    console.error('Failed to create policy');
  } else {
    console.log('Policy created:', result.id);
  }
} catch (error) {
  console.error('Error creating policy:', error);
}
```

---

## Summary Table

| Operation | Method | Parameters | Returns |
|-----------|--------|-----------|---------|
| Create Policy | addPolicy() | policyData | Policy object |
| Get Policies | getAllPolicies() | - | Policy array |
| Update Policy | updatePolicy() | id, updates | Updated policy |
| Delete Policy | deletePolicy() | id | void |
| Create Claim | addClaim() | claimData | Claim object |
| Get Claims | getAllClaims() | - | Claim array |
| Add Document | addDocumentToClaim() | claimId, doc | Updated claim |
| Approve Claim | approveClaim() | claimId, amounts | Approved claim |
| Reject Claim | rejectClaim() | claimId, reason | Rejected claim |
| Generate Bill | generateTPABill() | tpaId, claims, period | Bill object |
| Update Payment | updateTPABillPayment() | billId, amount | Updated bill |
| Get Dashboard | getTPADashboard() | tpaId | Dashboard data |

---

**All methods follow consistent error handling and return complete objects with all fields populated.**
