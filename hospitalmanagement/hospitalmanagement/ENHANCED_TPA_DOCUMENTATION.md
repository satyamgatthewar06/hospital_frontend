# Enhanced TPA Module - Complete Documentation

## Overview
The Enhanced TPA Module provides comprehensive Third-Party Administrator (TPA) management with insurance policies, advanced claim processing, document management, TPA billing, and detailed analytics dashboards.

## Features Implemented

### 1. Insurance Policy Management
- **Create Policies**: Register insurance policies with detailed information
  - Insurance Company Name
  - Policy Number
  - Coverage Amount (total authorized amount)
  - Policy Start Date & End Date
  - Co-pay Percentage (e.g., 10% patient responsibility)
  - Fixed Deductible Amount
  - Patient Association
  - TPA Association

- **Policy Tracking**:
  - Claims Count per policy
  - Total Claimed Amount
  - Total Approved Amount
  - Total Disbursed Amount
  - Coverage Utilization Percentage
  - Real-time status updates

- **Policy Actions**:
  - View all policies
  - Edit policy details
  - Delete unused policies
  - Monitor utilization against coverage limits

### 2. Advanced Claim Management
- **Claim Creation**:
  - Link to specific insurance policy
  - Associate with patient ID
  - Claim amount entry
  - Service/procedure date
  - Detailed description
  - Status tracking (Pending → Approved/Rejected → Disbursed)
  - Unique authorization number generation

- **Document Management**:
  - Upload multiple supporting documents per claim
  - Document types: Prescriptions, receipts, test reports, discharge summaries
  - Base64 encoding for storage in localStorage
  - Document metadata: name, type, size, upload date
  - Download/retrieve documents as needed

- **Claim Status Tracking**:
  - **Pending**: Initial state, awaiting TPA review
  - **Approved**: TPA approved, processing for disbursement
  - **Rejected**: Not approved by TPA with rejection reason
  - **Disbursed**: Payment completed to hospital/patient

### 3. TPA Response & Approval System
- **Claim Approval Processing**:
  - Review claim details and documents
  - Set approved amount (may differ from claimed amount)
  - Apply deductions:
    - Co-pay percentage calculation
    - Fixed deductible application
  - Calculate payable amount automatically
  - Add approval remarks/notes
  - Generate approval response with timestamp

- **Deduction Calculation**:
  ```
  Total Deduction = (Claim Amount × Co-pay %) + Fixed Deductible
  Payable Amount = Approved Amount - Total Deduction
  ```

- **Rejection Management**:
  - Record rejection reason
  - Maintain audit trail
  - Enable resubmission of claims

### 4. TPA Billing System
- **Bill Generation**:
  - Generate separate bills for each TPA
  - Select approved claims to include in bill
  - Specify billing period (monthly/quarterly)
  - Automatic calculation of total bill amount
  - Unique bill ID and due date (default 30 days)

- **Bill Details**:
  - Claim count in bill
  - Original claim amounts
  - Approved amounts
  - Deduction details
  - Payable amount (net amount due to TPA)

- **Payment Tracking**:
  - Record payments against bills
  - Track paid vs. pending amounts
  - Update bill status:
    - **Generated**: Bill created, awaiting payment
    - **Partial**: Partial payment received
    - **Paid**: Full payment completed
  - Payment date recording

- **Bill Summary**:
  - Total bills generated
  - Paid bills count
  - Partial bills count
  - Total bill amount across all periods
  - Total paid amount
  - Total pending amount

### 5. TPA Dashboard & Analytics
The dashboard provides real-time insights into TPA operations:

#### Claim Metrics:
- Total Claims Count
- Pending Claims (awaiting approval)
- Approved Claims (approved, awaiting disbursement)
- Disbursed Claims (fully processed)
- Rejected Claims (not approved)

#### Financial Metrics:
- **Total Claimed Amount**: Sum of all claim requests
- **Total Approved Amount**: Sum of approved claim amounts
- **Total Deducted Amount**: Total deductions applied
- **Total Payable Amount**: Net amount to be paid
- **Total Disbursed Amount**: Actual payments made

#### Billing Metrics:
- Total Bills Generated
- Generated Bills (unpaid)
- Paid Bills (100% payment)
- Partial Bills (partial payment)
- Total Bill Amount
- Total Paid Amount
- Total Pending Amount (due for payment)

#### Visual Indicators:
- Status badges (pending, approved, disbursed, rejected, generated, paid, partial)
- Color-coded cards for different metrics
- Progress bars for utilization tracking
- Responsive grid layout

## Database Schema

### Insurance Policies Table (localStorage: hms_insurance_policies_v1)
```javascript
{
  id: "POL-{timestamp}",
  insuranceCompany: "Company Name",
  policyNumber: "POL-XXXXX",
  coverageAmount: 100000,
  policyStartDate: "2024-01-01",
  policyEndDate: "2024-12-31",
  copayPercentage: 10,
  fixedDeductible: 500,
  patientId: "P123",
  tpaId: "TPA-001",
  status: "active",
  claimsCount: 5,
  totalClaimed: 50000,
  totalApproved: 45000,
  totalDisbursed: 45000,
  utilizationPercentage: 45,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z"
}
```

### Claims Table (localStorage: hms_tpa_claims_v2)
```javascript
{
  id: "CLM-{timestamp}",
  policyId: "POL-001",
  tpaId: "TPA-001",
  patientId: "P123",
  claimAmount: 5000,
  serviceDate: "2024-01-10",
  description: "Emergency treatment",
  authorizationNumber: "AUTH-{timestamp}",
  submissionDate: "2024-01-11T00:00:00Z",
  status: "approved", // pending, approved, rejected, disbursed
  documents: [
    {
      id: "DOC-{timestamp}",
      name: "prescription.pdf",
      type: "application/pdf",
      size: 102400,
      uploadDate: "2024-01-11T00:00:00Z",
      base64: "data:application/pdf;base64,..."
    }
  ],
  approvedAmount: 4500,
  deductionAmount: 500,
  payableAmount: 4000,
  remarks: "Approved with 10% co-pay",
  tpaResponse: {
    status: "approved",
    approvalDate: "2024-01-12T00:00:00Z",
    approvedAmount: 4500,
    deductionAmount: 500,
    payableAmount: 4000,
    remarks: "Approved with 10% co-pay"
  },
  createdAt: "2024-01-11T00:00:00Z",
  updatedAt: "2024-01-12T00:00:00Z"
}
```

### TPA Bills Table (localStorage: hms_tpa_bills_v1)
```javascript
{
  id: "TPABILL-{timestamp}",
  tpaId: "TPA-001",
  claimIds: ["CLM-001", "CLM-002", "CLM-003"],
  billingPeriod: "2024-01",
  claimsCount: 3,
  billAmount: 12000,
  status: "generated", // generated, partial, paid
  createdDate: "2024-02-01T00:00:00Z",
  dueDate: "2024-03-02T00:00:00Z",
  paidAmount: 5000,
  paymentDate: "2024-02-15T00:00:00Z",
  details: [
    {
      claimId: "CLM-001",
      claimAmount: 5000,
      approvedAmount: 4500,
      deductionAmount: 500,
      payableAmount: 4000
    }
  ]
}
```

## API Methods (enhancedTpaService.js)

### Policy Management
- `getAllPolicies()` - Get all insurance policies
- `getPoliciesByPatient(patientId)` - Get policies for specific patient
- `getPoliciesByTPA(tpaId)` - Get policies for specific TPA
- `addPolicy(policyData)` - Create new policy
- `updatePolicy(id, updates)` - Update policy details
- `deletePolicy(id)` - Delete policy

### Claim Management
- `getAllClaims()` - Get all claims
- `getClaimsByTPA(tpaId)` - Get claims for TPA
- `getClaimsByPolicy(policyId)` - Get claims for policy
- `getClaimsByPatient(patientId)` - Get claims for patient
- `addClaim(claimData)` - Create new claim
- `updateClaim(id, updates)` - Update claim
- `deleteClaim(id)` - Delete claim
- `addDocumentToClaim(claimId, document)` - Add document to claim

### Approval & Processing
- `approveClaim(claimId, approvedAmount, deductionAmount, remarks)` - Approve claim
- `rejectClaim(claimId, reason)` - Reject claim
- `disburseClaim(claimId)` - Mark claim as disbursed

### Billing
- `getAllTPABills()` - Get all TPA bills
- `getTPABillsByTPA(tpaId)` - Get bills for TPA
- `generateTPABill(tpaId, claimIds, billingPeriod)` - Generate new bill
- `updateTPABillPayment(billId, paidAmount)` - Record payment

### Analytics & Calculations
- `calculatePolicyUtilization(policyId)` - Calculate % of coverage used
- `calculateClaimDeductions(claimAmount, policyDetails)` - Calculate deductions
- `getTPADashboard(tpaId)` - Get complete dashboard data
- `getClaimDetails(claimId)` - Get claim with related policy and TPA
- `updatePolicyStats(policyId)` - Update policy statistics

## File Structure
```
src/
├── services/
│   └── enhancedTpaService.js          # Core TPA business logic
├── pages/
│   └── EnhancedTPAPage.js             # Main TPA UI component
├── styles/
│   └── EnhancedTPAPage.css            # Styling for TPA page
└── App.js                              # Updated with EnhancedTPAPage route
```

## Navigation & Access
- **Route**: `/enhanced-tpa`
- **Menu Item**: "Enhanced TPA" in sidebar
- **Required Role**: ADMIN or ACCOUNTANT
- **Menu Icon**: 📋

## UI Components & Workflow

### Tab 1: Dashboard
- Overview of all metrics
- Quick statistics cards
- Color-coded indicators for claim status
- Financial summary

### Tab 2: Policies
- List of all insurance policies
- Policy cards with coverage details
- Utilization progress bars
- Add new policy form
- Policy editing capabilities

### Tab 3: Claims
- Complete claims table
- Claim creation form
- Document upload functionality
- Status tracking
- Approval/Rejection controls
- Payable amount calculation

### Tab 4: Billing
- TPA bills table
- Bill generation from approved claims
- Payment tracking
- Bill status management
- Financial settlement tracking

## Data Persistence
- All data stored in localStorage with version keys
- Automatic data migration on service version changes
- No backend required (can be connected later)
- Data survives browser refresh and page navigation

## Integration Points

### With Existing Hospital Management System:
- **PatientManagement**: Link claims to patient records
- **BillingPage**: TPA billing integrates with hospital billing
- **ReportsPage**: Can add TPA analytics
- **Dashboard**: Can display TPA summary cards
- **AuthContext**: Uses role-based access control (ADMIN, ACCOUNTANT)

## Future Enhancements
1. Backend API integration for data persistence
2. Email notifications for claim status updates
3. SMS reminders for pending bills
4. Document scanning and OCR
5. Automated deduction calculation based on policy rules
6. Claim resubmission workflow
7. TPA performance metrics and ratings
8. Insurance premium calculation
9. Network hospital management
10. Pre-authorization workflows

## Testing Scenarios
1. Create policy → Add claim → Approve → Generate bill → Pay bill
2. Create policy → Reject claim → View rejection reason
3. Add documents to claim → Retrieve for verification
4. Calculate deductions with co-pay and fixed deductible
5. Track bill payment status (Partial → Paid)

## User Permissions & Roles
- **ADMIN**: Full access to all features
- **ACCOUNTANT**: Full access to TPA, claims, and billing
- **Other Roles**: No access (403 Forbidden)

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready
