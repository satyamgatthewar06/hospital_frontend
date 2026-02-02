# Enhanced TPA Module - Implementation Guide

## Quick Start

### Step 1: Access the Module
1. Login to Hospital Management System as ADMIN or ACCOUNTANT
2. Click "Enhanced TPA" in the left sidebar (📋 icon)
3. You'll see 4 tabs: Dashboard, Policies, Claims, and Billing

### Step 2: Create Insurance Policies
1. Go to "Policies" tab
2. Click "+ New Policy" button
3. Fill in the form:
   - **Insurance Company**: Name of insurance company (e.g., "Apollo Insurance")
   - **Policy Number**: Unique policy identifier (e.g., "POL-20240001")
   - **Coverage Amount**: Maximum covered amount (e.g., ₹100,000)
   - **Policy Start Date**: When policy becomes active
   - **Policy End Date**: When policy expires
   - **Co-pay Percentage**: Patient responsibility % (e.g., 10%)
   - **Fixed Deductible**: Fixed deduction per claim (e.g., ₹500)
   - **Patient ID**: Associated patient identifier
4. Click "Save Policy"
5. Policy appears in the grid with utilization tracking

### Step 3: Create Insurance Claims
1. Go to "Claims" tab
2. Click "+ New Claim" button
3. Fill in the form:
   - **Select Policy**: Choose from available policies
   - **Patient ID**: Patient who received treatment
   - **Claim Amount**: Amount being claimed (e.g., ₹5,000)
   - **Service Date**: When service was provided
   - **Description**: Details of treatment/procedure
4. Click "Create Claim"
5. Claim enters "pending" status

### Step 4: Upload Claim Documents
After creating a claim, you can upload supporting documents:
1. Look for upload option next to the claim in the table
2. Attach files:
   - Medical prescriptions
   - Discharge summaries
   - Laboratory reports
   - Bills and receipts
   - Any other relevant documents
3. Documents are stored with the claim for verification

### Step 5: Approve or Reject Claims
**For APPROVAL:**
1. In Claims tab, find pending claim
2. Click "Approve" button
3. In the approval modal:
   - **Approved Amount**: Amount TPA approves (may be less than claimed)
   - **Deduction Amount**: Automatic calculation based on policy:
     - Co-pay: Claim Amount × Co-pay %
     - Deductible: Add fixed deductible if applicable
   - **Remarks**: Add notes about approval
   - **Payable Amount**: Auto-calculated = Approved - Deductions
4. Click "Approve"
5. Claim status changes to "approved"

**For REJECTION:**
1. Click "Reject" button
2. Enter reason for rejection
3. Claim status changes to "rejected"
4. Can be resubmitted later

### Step 6: Generate TPA Bills
1. Go to "Billing" tab
2. Click "+ Generate Bill" button
3. In the form:
   - **Billing Period**: Month/Year of billing (e.g., 2024-01)
   - **Select Claims**: Check approved claims to include
   - Can select multiple claims
4. Click "Generate Bill"
5. New bill appears in bills table with:
   - Bill Amount: Sum of all payable amounts
   - Due Date: 30 days from creation
   - Status: "generated"

### Step 7: Track Bill Payments
1. In Bills tab, find generated bill
2. Click "Pay" button
3. Enter payment amount:
   - Can pay partial or full amount
   - Shows maximum pending amount
4. Bill status updates:
   - "partial" = partial payment received
   - "paid" = full payment completed
5. Payment date recorded automatically

### Step 8: View Dashboard
1. Go to "Dashboard" tab
2. See complete overview:
   - **Pending Claims**: Claims awaiting approval
   - **Approved Claims**: Approved but not disbursed
   - **Disbursed Claims**: Fully processed
   - **Rejected Claims**: Not approved
   - **Financial Totals**: Claimed, approved, deducted, disbursed amounts
   - **Billing Summary**: Bills generated, paid, pending amounts

## Example Scenario

### Case: Process a Patient Claim

**Day 1: Policy Setup**
- Insurance Company: "Star Health Insurance"
- Policy Number: "SHI-2024-001"
- Coverage: ₹200,000
- Patient ID: "P001"
- Co-pay: 10%
- Deductible: ₹500

**Day 2: Claim Submission**
- Claim Amount: ₹10,000
- Service Date: 2024-01-10
- Description: "Emergency cardiac treatment"
- Documents: Prescription, ECG report, discharge summary

**Day 3: TPA Review & Approval**
- Approved Amount: ₹9,000 (₹1,000 not covered)
- Deduction Calculation:
  - Co-pay: ₹9,000 × 10% = ₹900
  - Fixed Deductible: ₹500
  - **Total Deduction: ₹1,400**
- **Payable Amount: ₹9,000 - ₹1,400 = ₹7,600**

**Day 4: Billing**
- 5 similar approved claims (₹7,600 each)
- Total Bill: ₹38,000
- Due Date: 30 days

**Day 10: Payment**
- Partial Payment: ₹20,000
- Remaining Due: ₹18,000

**Day 35: Final Payment**
- Remaining Payment: ₹18,000
- Status: "paid"
- All claims processed

## Key Calculations

### Policy Utilization
```
Utilization % = (Total Approved Amount / Coverage Amount) × 100
Example: (₹90,000 / ₹200,000) × 100 = 45%
```

### Deduction Formula
```
Total Deduction = (Approved Amount × Co-pay %) + Fixed Deductible
Payable = Approved Amount - Total Deduction
Example: (₹9,000 × 10%) + ₹500 = ₹1,400
Payable = ₹9,000 - ₹1,400 = ₹7,600
```

### Bill Amount Calculation
```
Bill Amount = Sum of all claim payable amounts
Example: 5 claims × ₹7,600 = ₹38,000
```

## Status Progression

### Claim Status Flow
```
pending → approved → disbursed
    ↓
  rejected
```

### Bill Status Flow
```
generated → partial → paid
    ↓
   (stays "paid" on completion)
```

## Tips & Best Practices

1. **Document Management**:
   - Upload all supporting documents immediately
   - Ensures faster claim approval
   - Reduces back-and-forth requests

2. **Deduction Calculation**:
   - System auto-calculates based on policy
   - Review before approval
   - Adjust if special circumstances apply

3. **Billing Organization**:
   - Generate bills on monthly basis
   - Include only approved claims
   - Track payments for accounting

4. **Dashboard Review**:
   - Check daily for pending claims
   - Monitor bill payment status
   - Track policy utilization

5. **Data Integrity**:
   - Use consistent patient IDs
   - Verify policy numbers match
   - Keep billing period consistent

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Can't find policy | Create policy first in "Policies" tab |
| Documents won't upload | Check file size and format |
| Deduction amount seems wrong | Verify co-pay % and fixed deductible |
| Bill not generating | Ensure claims are approved status |
| Payment not recorded | Click "Pay" button and enter amount |
| Can't access Enhanced TPA | Login as ADMIN or ACCOUNTANT |

## Data Storage
- All data stored in browser's localStorage
- Data persists across page refreshes
- Clear browser cache to reset all data
- Can export/backup by checking browser Developer Tools

## Mobile Responsive
- Works on tablets and phones
- Responsive grid layout
- Touch-friendly buttons
- Mobile-optimized forms

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes
- Handles up to 1000+ policies and claims smoothly
- Real-time calculations and updates
- No server delay (all client-side)
- Instant search and filtering

---

**Ready to use!** Start creating policies and processing claims immediately.
