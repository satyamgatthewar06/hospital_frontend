# TPA (Third Party Administrator) Module Documentation

## Overview

The TPA (Third Party Administrator) module is a comprehensive system for managing third-party insurance providers, claim processing, and network coverage tracking in the hospital management system.

## Features

### 1. TPA Management
- ✅ Register and manage multiple TPAs
- ✅ Track TPA contact information
- ✅ Monitor network limits and coverage
- ✅ Agreement tracking (start/end dates)
- ✅ Real-time TPA statistics

### 2. Claims Management
- ✅ Register patient claims with TPAs
- ✅ Track claim status (Pending → Approved → Disbursed)
- ✅ Approve/Reject claims
- ✅ Track approved vs claimed amounts
- ✅ Automatic TPA statistics updates

### 3. Analytics & Reporting
- ✅ TPA performance metrics
- ✅ Network utilization tracking
- ✅ Claim status distribution
- ✅ Average processing time calculation
- ✅ Financial summary reports

### 4. Patient-TPA Linking
- ✅ Link patients to TPAs
- ✅ Store policy numbers and amounts
- ✅ Track patient coverage details

## Module Components

### Files Created

#### 1. Service Layer (`src/services/tpaService.js`)
Core business logic for TPA operations:

```javascript
// TPA Methods
getAllTPAs()                    // Get all registered TPAs
getTPAById(id)                 // Get specific TPA
addTPA(tpaData)                // Register new TPA
updateTPA(id, updates)         // Update TPA details
deleteTPA(id)                  // Delete TPA

// Claims Methods
getAllClaims()                 // Get all claims
getClaimsByTPA(tpaId)         // Get claims for specific TPA
getClaimsByPatient(patientId)  // Get claims for patient
addClaim(claimData)           // Register new claim
updateClaim(id, updates)       // Update claim status
deleteClaim(id)               // Delete claim

// Analytics Methods
getTPACoverage(tpaId)         // Get coverage details
getClaimStatusReport(tpaId)   // Get claim statistics
updateTPAStats(tpaId)         // Update TPA metrics
linkPatientToTPA()            // Link patient to TPA
```

#### 2. UI Page (`src/pages/TPAPage.js`)
Main TPA management interface with three tabs:

- **TPA List Tab**: Register and manage TPAs
- **Claims Tab**: Process and manage claims
- **Analytics Tab**: View TPA performance metrics

#### 3. Styling (`src/styles/TPAPage.css`)
Professional responsive design with:
- Tab navigation
- Form layouts
- Card-based TPA display
- Claims processing table
- Analytics dashboard
- Mobile-optimized responsive design

## Usage Guide

### For Admin/Accountant Users

#### 1. Register a TPA

1. Navigate to **TPA Management** (🤝) in sidebar
2. Click **"TPA List"** tab
3. Click **"➕ Add New TPA"** button
4. Fill in TPA details:
   - Organization Name
   - Contact Person
   - Contact Number
   - Email
   - Address & City
   - PAN Number
   - Network Limit (maximum coverage amount)
   - Agreement dates
5. Click **"Save TPA"**

#### 2. Register a Claim

1. Go to **"Claims"** tab
2. Click **"➕ Register New Claim"** button
3. Select TPA from dropdown
4. Enter claim details:
   - Patient ID
   - Patient Name
   - Bill ID
   - Claim Amount
   - Description
5. Click **"Register Claim"**

#### 3. Process Claims

1. View all claims in **"Claims"** tab
2. Filter by status (Pending, Approved, etc.)
3. For pending claims:
   - Click **"✓ Approve"** to approve
   - Click **"✕ Reject"** to reject
4. For approved claims:
   - Click **"💰 Disburse"** to mark as disbursed
5. Claims automatically update TPA statistics

#### 4. View Analytics

1. Go to **"Analytics"** tab
2. See statistics for each TPA:
   - Total claims count
   - Pending/Approved/Rejected/Disbursed breakdown
   - Network utilization percentage
   - Average processing time
   - Available network limit

## Data Structure

### TPA Object
```javascript
{
  id: "TPA-1234567890",
  name: "ABC Insurance Ltd",
  contactPerson: "John Doe",
  contactNumber: "9876543210",
  email: "contact@abc.com",
  address: "Full address",
  city: "Mumbai",
  panNumber: "AABB1234C",
  networkLimit: 1000000,          // Total allowed coverage
  agreementStartDate: "2024-01-01",
  agreementEndDate: "2025-01-01",
  status: "active",               // active/inactive
  totalClaims: 5,
  approvedClaims: 3,
  rejectedClaims: 1,
  pendingClaims: 1,
  totalAmount: 150000,            // Total claimed
  approvedAmount: 120000,         // Approved amount
  disbursedAmount: 100000,        // Disbursed amount
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z"
}
```

### Claim Object
```javascript
{
  id: "CLAIM-1234567890",
  tpaId: "TPA-1234567890",
  patientId: "PAT-001",
  patientName: "Jane Smith",
  billId: "BILL-001",
  claimAmount: 50000,             // Amount being claimed
  approvedAmount: 45000,          // Amount approved by TPA
  disbursedAmount: 45000,         // Amount actually disbursed
  status: "approved",             // pending/approved/rejected/disbursed
  claimDescription: "OPD treatment",
  authorizationNumber: "AUTH-1234567890",
  documentUploaded: false,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z"
}
```

## API Usage Examples

### Create a TPA
```javascript
import tpaService from './services/tpaService';

const newTPA = tpaService.addTPA({
  name: 'XYZ Insurance',
  contactPerson: 'Smith Johnson',
  contactNumber: '9876543210',
  email: 'xyz@insurance.com',
  address: '123 Business Street',
  city: 'Delhi',
  panNumber: 'CCDD1234E',
  networkLimit: 5000000,
  agreementStartDate: '2024-01-01',
  agreementEndDate: '2025-01-01'
});
```

### Register a Claim
```javascript
const claim = tpaService.addClaim({
  tpaId: 'TPA-123',
  patientId: 'PAT-001',
  patientName: 'John Doe',
  billId: 'BILL-001',
  claimAmount: 75000,
  claimDescription: 'Emergency ward admission'
});
```

### Approve a Claim
```javascript
tpaService.updateClaim('CLAIM-123', {
  status: 'approved',
  approvedAmount: 70000
});
```

### Get TPA Statistics
```javascript
const coverage = tpaService.getTPACoverage('TPA-123');
console.log(`Network Utilized: ₹${coverage.utilized}`);
console.log(`Utilization: ${coverage.utilization.toFixed(2)}%`);
```

### Get Claim Status Report
```javascript
const report = tpaService.getClaimStatusReport('TPA-123');
console.log(`Pending: ${report.pending}`);
console.log(`Approved: ${report.approved}`);
console.log(`Avg Processing: ${report.averageProcessingTime} days`);
```

## Workflow

```
TPA Registration
    ↓
Patient Links to TPA (with policy details)
    ↓
Claim Creation (when patient requires treatment)
    ↓
Claim Submitted for Approval
    ↓
    ├─→ APPROVED (approved amount set)
    │       ↓
    │   DISBURSED (payment processed)
    │
    └─→ REJECTED (with reason)
```

## Storage

Data is stored in browser localStorage:
- `hms_tpa_v1`: All registered TPAs
- `hms_tpa_claims_v1`: All claims

**Note**: For production, migrate to backend database with proper authentication and encryption.

## Access Control

- **ADMIN**: Full access to all TPA features
- **ACCOUNTANT**: Full access to all TPA features
- **Other roles**: No access

## Key Metrics Tracked

### Per TPA
- Total Claims: Number of claims registered
- Approved Claims: Number of approved claims
- Rejected Claims: Number of rejected claims
- Pending Claims: Number of pending claims
- Total Amount: Total amount claimed
- Approved Amount: Total approved amount
- Utilization %: (Approved Amount / Network Limit) × 100
- Avg Processing Time: Average days to process a claim

### Per Claim
- Claim Amount: What patient/hospital claims
- Approved Amount: What TPA approves
- Disbursed Amount: What actually gets paid
- Authorization Number: Unique claim reference
- Processing Days: Time from creation to approval

## Integration Points

### With Billing Module
- Claims can be linked to bills
- Bill amounts auto-populate claim amounts
- Payment tracking integrated

### With Patient Module
- Patients can be linked to TPAs
- Policy numbers stored with patient records
- Coverage verified during billing

## Features Coming Soon

- 📧 Email notifications for claim status
- 📱 SMS alerts for approvals
- 📊 Advanced claim analytics
- 🔄 Claim amendment/re-submission
- 💳 Online payment integration
- 🏥 Pre-authorization system
- 📋 Coverage verification
- 🔍 Claim audit trail

## Troubleshooting

### Claim Not Showing
- Verify TPA is registered
- Check patient ID is correct
- Ensure claim was saved successfully

### Utilization Not Calculating
- Verify TPA has a network limit set
- Check claims are approved
- Refresh the page

### Statistics Not Updating
- Claims update automatically when status changes
- Manual refresh may be needed
- Clear browser cache if issue persists

## Database Schema (For Backend Implementation)

```sql
CREATE TABLE tpas (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  contact_number VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(50),
  pan_number VARCHAR(20),
  network_limit DECIMAL(12,2),
  agreement_start_date DATE,
  agreement_end_date DATE,
  status VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE tpa_claims (
  id VARCHAR(50) PRIMARY KEY,
  tpa_id VARCHAR(50) NOT NULL,
  patient_id VARCHAR(50),
  bill_id VARCHAR(50),
  patient_name VARCHAR(100),
  claim_amount DECIMAL(12,2),
  approved_amount DECIMAL(12,2),
  disbursed_amount DECIMAL(12,2),
  status VARCHAR(20),
  authorization_number VARCHAR(50),
  claim_description TEXT,
  document_uploaded BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (tpa_id) REFERENCES tpas(id)
);

CREATE TABLE patient_tpa_mapping (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50),
  tpa_id VARCHAR(50),
  policy_number VARCHAR(50),
  policy_amount DECIMAL(12,2),
  tpa_linked_at TIMESTAMP,
  FOREIGN KEY (tpa_id) REFERENCES tpas(id)
);
```

## Support

For issues or feature requests, contact the development team.

---

**Module Version**: 1.0.0
**Created**: January 31, 2026
**Status**: Production Ready
