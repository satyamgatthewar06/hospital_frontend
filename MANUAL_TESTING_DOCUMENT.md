# 🏥 Hospital Management System — Manual Testing Document

---

## 📝 RESUME PROJECT DESCRIPTION (Copy-Paste Ready)

### Project Title
**Hospital Management System (HMS)**

### Project Description
Developed a comprehensive, full-stack Hospital Management System that digitizes and automates end-to-end hospital workflows including OPD/IPD management, patient registration, appointment scheduling, laboratory management, billing & invoicing, insurance claims processing, TPA management, staff & doctor management, ward/room allocation, and analytics dashboards. The system features role-based access control (RBAC) with 5 user roles (Admin, Doctor, Nurse, Patient, Staff) and is deployed on Railway cloud platform.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Chart.js, Recharts, Axios, Lucide Icons |
| Backend | Node.js, Express.js, REST API |
| Database | MySQL (mysql2) |
| Authentication | JWT (JSON Web Token), bcryptjs |
| Security | Helmet, CORS, Express Validator |
| PDF/Reports | jsPDF, html2canvas, PapaParse (CSV) |
| Payment | Razorpay Integration |
| Testing | Selenium (Python), Puppeteer (JS), Smoke Tests |
| Deployment | Railway (Cloud), Docker |

### Key Modules
- **OPD (Out-Patient Department)** – Patient visits, vitals, consultation, prescriptions, follow-ups
- **IPD (In-Patient Department)** – Admissions, bed allocation, nursing notes, doctor rounds, intake/output, OT scheduling, discharge summaries, medications
- **Laboratory** – Test requests, sample collection, result entry, report verification, result sharing, lab billing
- **Billing & Invoicing** – Bill generation, taxes, discounts, payment tracking, PDF invoice download
- **Insurance Management** – Policy registration, claims submission, TPA integration
- **Patient Management** – Registration, medical history, allergies, chronic diseases, surgical history
- **Appointment Scheduling** – Doctor-wise scheduling, status tracking (scheduled/completed/cancelled/no-show)
- **Staff & Doctor Management** – Employee records, shift management, department assignment
- **Ward & Room Management** – Ward creation, bed tracking (occupied/available), room allocation
- **Analytics Dashboard** – Charts, KPIs, revenue trends, patient statistics
- **Settings & User Preferences** – Theme toggle, personalized settings stored per user
- **Role-Based Access Control** – Admin, Doctor, Nurse, Patient, Staff roles with route-level guards

### Roles & Responsibilities (for Resume)
- Performed **manual testing** of 15+ modules covering functional, UI, integration, and regression testing
- Created and executed **100+ test cases** across all modules
- Verified **CRUD operations** for patients, doctors, appointments, billing, lab requests, insurance
- Validated **role-based access control (RBAC)** for 5 user roles
- Tested **API responses** using Postman and browser DevTools
- Identified and reported **bugs** related to form validations, data integrity, and UI responsiveness
- Performed **cross-browser testing** on Chrome, Firefox, and Edge
- Verified **database integrity** by cross-checking MySQL records with frontend data
- Conducted **regression testing** after each sprint/deployment
- Tested **PDF generation** for bills, lab reports, and prescriptions

---

## 🔐 LOGIN CREDENTIALS FOR TESTING

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Doctor | doctor1 | doctor123 |
| Nurse | nurse1 | nurse123 |
| Patient | patient1 | patient123 |
| Staff | staff1 | staff123 |

**Application URL (Local):** http://localhost:3000  
**Backend API URL:** http://localhost:5001/api

---

## 📋 MANUAL TEST CASES

### Module 1: LOGIN & AUTHENTICATION

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_AUTH_001 | Valid Admin Login | App is running | 1. Open login page 2. Enter username: admin, password: admin123 3. Click Login | User redirected to Admin Dashboard | | |
| TC_AUTH_002 | Valid Doctor Login | App is running | 1. Enter username: doctor1, password: doctor123 2. Click Login | User redirected to Doctor Dashboard | | |
| TC_AUTH_003 | Invalid Username | App is running | 1. Enter username: wronguser, password: admin123 2. Click Login | Error message: "Invalid credentials" displayed | | |
| TC_AUTH_004 | Invalid Password | App is running | 1. Enter username: admin, password: wrongpass 2. Click Login | Error message: "Invalid credentials" displayed | | |
| TC_AUTH_005 | Empty Username Field | App is running | 1. Leave username empty 2. Enter password 3. Click Login | Validation error shown, login button disabled or error message | | |
| TC_AUTH_006 | Empty Password Field | App is running | 1. Enter username 2. Leave password empty 3. Click Login | Validation error shown | | |
| TC_AUTH_007 | Both Fields Empty | App is running | 1. Leave both fields empty 2. Click Login | Validation error shown for both fields | | |
| TC_AUTH_008 | Logout Functionality | User is logged in | 1. Click on Logout button/icon | User redirected to login page, session cleared | | |
| TC_AUTH_009 | Session Persistence | User is logged in | 1. Refresh the page (F5) | User remains logged in, not redirected to login | | |
| TC_AUTH_010 | Protected Route Access | User is NOT logged in | 1. Directly navigate to /dashboard URL | User redirected to login page | | |

---

### Module 2: PATIENT MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_PAT_001 | Register New Patient | Admin logged in | 1. Go to Patient Management 2. Click "Add Patient" 3. Fill all required fields (firstName, lastName, DOB, gender) 4. Click Save | Patient created successfully, appears in patient list | | |
| TC_PAT_002 | Register Patient - Missing Required Fields | Admin logged in | 1. Click "Add Patient" 2. Leave firstName empty 3. Click Save | Validation error: "First name is required" | | |
| TC_PAT_003 | View Patient List | Admin logged in | 1. Navigate to Patient Management page | All registered patients displayed in table/cards | | |
| TC_PAT_004 | Search Patient by Name | Patients exist in DB | 1. Type patient name in search box | Filtered results shown matching search query | | |
| TC_PAT_005 | Edit Patient Details | Patient exists | 1. Click Edit on a patient 2. Change phone number 3. Click Update | Patient details updated, new phone number visible | | |
| TC_PAT_006 | Delete Patient | Patient exists, no active encounters | 1. Click Delete on a patient 2. Confirm deletion | Patient removed from list | | |
| TC_PAT_007 | View Patient Details | Patient exists | 1. Click on patient name/view button | Patient full details shown (medical history, allergies, etc.) | | |
| TC_PAT_008 | Duplicate Patient ID Prevention | Patient exists | 1. Try creating patient with same patientId | Error: "Patient ID already exists" | | |
| TC_PAT_009 | Patient Medical History | Patient exists | 1. View patient → Medical History section | Medical history, allergies, chronic diseases, surgical history displayed | | |
| TC_PAT_010 | Patient Data in DB | Patient created | 1. Check MySQL patients table | Record exists with all correct field values | | |

---

### Module 3: DOCTOR MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_DOC_001 | Add New Doctor | Admin logged in | 1. Go to Doctor Management 2. Click "Add Doctor" 3. Fill details (name, specialization, department, phone, email, license) 4. Click Save | Doctor created, visible in list | | |
| TC_DOC_002 | Edit Doctor Details | Doctor exists | 1. Click Edit 2. Change specialization 3. Save | Updated specialization visible | | |
| TC_DOC_003 | View Doctor List | Admin logged in | 1. Navigate to Doctor Management | All doctors listed with specialization, department, status | | |
| TC_DOC_004 | Doctor Availability Status | Doctor exists | 1. Change availability to "On Leave" 2. Save | Status updated to "On Leave" | | |
| TC_DOC_005 | Delete Doctor | Doctor exists | 1. Click Delete on doctor 2. Confirm | Doctor removed from list | | |
| TC_DOC_006 | Doctor with Appointments | Doctor has active appointments | 1. Try to delete the doctor | Warning/error about existing appointments or cascading handled | | |

---

### Module 4: APPOINTMENT MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_APT_001 | Schedule New Appointment | Patient & Doctor exist | 1. Go to Appointments 2. Click "New Appointment" 3. Select patient, doctor, date, time, type 4. Save | Appointment created with status "Scheduled" | | |
| TC_APT_002 | View Appointment List | Appointments exist | 1. Navigate to Appointments page | All appointments listed with patient, doctor, date, status | | |
| TC_APT_003 | Cancel Appointment | Appointment with status "Scheduled" | 1. Click on appointment 2. Change status to "Cancelled" 3. Save | Status updated to "Cancelled" | | |
| TC_APT_004 | Complete Appointment | Appointment with status "Scheduled" | 1. Change status to "Completed" 2. Save | Status updated to "Completed" | | |
| TC_APT_005 | No-Show Appointment | Appointment exists | 1. Mark appointment as "No-Show" | Status updated to "No-Show" | | |
| TC_APT_006 | Duplicate Appointment Check | Appointment exists for patient at same time | 1. Try booking same patient with same doctor at same time | Error or warning about conflict | | |
| TC_APT_007 | Past Date Appointment | Admin logged in | 1. Try to schedule appointment with past date | Warning or prevention of past-date booking | | |
| TC_APT_008 | Appointment Search/Filter | Multiple appointments exist | 1. Use search/filter by doctor or date | Only relevant appointments displayed | | |

---

### Module 5: OPD (OUT-PATIENT DEPARTMENT)

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_OPD_001 | Create New OPD Record | Patient exists | 1. Go to OPD 2. Click "New OPD Visit" 3. Fill patient, doctor, symptoms, diagnosis, treatment, consultation fee 4. Save | OPD record created with unique ticket number | | |
| TC_OPD_002 | View OPD Records List | OPD records exist | 1. Navigate to OPD page | All OPD records listed with patient name, doctor, date, status | | |
| TC_OPD_003 | Add Vitals in OPD | OPD record exists | 1. Open OPD record 2. Enter vitals (BP, temperature, pulse, weight) 3. Save | Vitals saved and visible in record | | |
| TC_OPD_004 | Add Prescription in OPD | OPD record exists | 1. Open OPD record 2. Enter prescription details 3. Save | Prescription saved | | |
| TC_OPD_005 | Set Follow-Up Date | OPD record exists | 1. Set follow-up date 2. Save | Follow-up date saved and displayed | | |
| TC_OPD_006 | OPD Consultation Fee | OPD record exists | 1. Enter consultation fee 2. Save | Fee saved, visible in billing | | |
| TC_OPD_007 | Search OPD Records | OPD records exist | 1. Search by patient name or ticket number | Matching records displayed | | |

---

### Module 6: IPD (IN-PATIENT DEPARTMENT)

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_IPD_001 | New IPD Admission | Patient & Doctor exist, Ward available | 1. Go to IPD 2. Click "New Admission" 3. Fill patient, doctor, ward, bed, diagnosis 4. Save | Patient admitted, status = "Admitted" | | |
| TC_IPD_002 | View IPD Admissions List | Admissions exist | 1. Navigate to IPD page | All admissions listed with patient, doctor, ward, bed, status | | |
| TC_IPD_003 | Add Nursing Notes | IPD admission exists | 1. Open admission 2. Go to Nursing Notes 3. Add note 4. Save | Note saved with nurse name and timestamp | | |
| TC_IPD_004 | Add Doctor Round Entry | IPD admission exists | 1. Go to Doctor Rounds 2. Add observation & instructions 3. Save | Round entry saved with doctor name and timestamp | | |
| TC_IPD_005 | Add Intake/Output Record | IPD admission exists | 1. Go to Intake/Output 2. Add type, item, quantity 3. Save | Record saved successfully | | |
| TC_IPD_006 | Add Medication | IPD admission exists | 1. Go to Medications 2. Add medicine name, dosage, frequency, start/end date 3. Save | Medication saved with status "Active" | | |
| TC_IPD_007 | Schedule OT (Operation Theater) | IPD admission exists | 1. Go to OT Schedule 2. Add procedure, surgeon, OT room, date 3. Save | OT scheduled with status "Scheduled" | | |
| TC_IPD_008 | Discharge Patient | IPD admission with status "Admitted" | 1. Click "Discharge" 2. Enter discharge date and summary 3. Confirm | Status changed to "Discharged", discharge date recorded | | |
| TC_IPD_009 | Transfer Patient to Another Ward | IPD admission exists | 1. Click "Transfer" 2. Select new ward/bed 3. Confirm | Ward/bed updated, status = "Transferred" or updated | | |
| TC_IPD_010 | Bed Availability Check | Ward exists | 1. Check ward bed count before and after admission | Available beds decreased by 1 after admission | | |

---

### Module 7: LABORATORY

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_LAB_001 | Create Lab Test Request | Patient exists | 1. Go to Laboratory 2. Click "New Request" 3. Select patient, test, sample type, priority 4. Save | Lab request created with status "Pending", unique reqId generated | | |
| TC_LAB_002 | View Lab Requests List | Lab requests exist | 1. Navigate to Laboratory page | All requests listed with patient, test, status, priority | | |
| TC_LAB_003 | Update Sample Collection | Lab request with status "Pending" | 1. Open request 2. Mark sample as collected 3. Save | Status updated, collection date recorded | | |
| TC_LAB_004 | Enter Test Results | Sample collected | 1. Open request 2. Enter test result, remarks 3. Save | Results saved, status updated to "Completed" | | |
| TC_LAB_005 | Verify Lab Result | Result entered | 1. Click "Verify" 2. Enter pathologist remark 3. Save | isVerified = 1, verifiedBy and verifiedDate populated | | |
| TC_LAB_006 | Generate Lab Bill | Lab test completed | 1. Go to Lab Billing 2. Generate bill for completed test | Lab bill created with correct price, GST, total | | |
| TC_LAB_007 | Download Lab Report PDF | Result verified | 1. Click "Download" or "Print" button | PDF generated and downloaded with patient & test details | | |
| TC_LAB_008 | Share Lab Report | Result verified | 1. Click "Share" 2. Enter recipient details 3. Share | Share history updated in record | | |
| TC_LAB_009 | Lab Test Priority Filter | Multiple requests exist with different priorities | 1. Filter by "Urgent" priority | Only urgent requests displayed | | |
| TC_LAB_010 | Lab Test Catalog | Admin logged in | 1. Go to Lab Tests catalog 2. View available tests | All tests listed with name, category, price, sample type, normal range | | |

---

### Module 8: BILLING & INVOICING

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_BIL_001 | Create New Bill | Patient exists | 1. Go to Billing 2. Click "New Bill" 3. Add patient, items, amounts 4. Save | Bill created with unique billNumber, status "Pending" | | |
| TC_BIL_002 | Add Multiple Line Items | Creating a bill | 1. Add multiple items (consultation, medicine, room charges) | All items listed, subtotal calculated correctly | | |
| TC_BIL_003 | Apply Discount | Bill exists | 1. Enter discount percentage/amount 2. Save | Discount applied, total recalculated | | |
| TC_BIL_004 | Tax Calculation | Bill with items | 1. Check tax (GST) calculation | Tax calculated correctly on subtotal | | |
| TC_BIL_005 | Mark Bill as Paid | Bill with status "Pending" | 1. Select payment method 2. Enter amount paid 3. Save | Status changed to "Paid", amountPaid updated | | |
| TC_BIL_006 | Partial Payment | Bill with status "Pending" | 1. Pay less than total amount | Status = "Partial", amountPaid updated | | |
| TC_BIL_007 | Cancel Bill | Bill exists | 1. Click Cancel Bill 2. Confirm | Status changed to "Cancelled" | | |
| TC_BIL_008 | Download Invoice PDF | Bill exists | 1. Click "Download PDF" or "Print" | PDF invoice generated with all bill details | | |
| TC_BIL_009 | Bill Search | Multiple bills exist | 1. Search by bill number or patient name | Matching bills displayed | | |
| TC_BIL_010 | Billing Total Validation | Bill with items, discount, tax | 1. Verify: Total = Subtotal - Discount + Tax | Calculation is accurate | | |

---

### Module 9: INSURANCE MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_INS_001 | Register New Insurance Policy | Patient exists | 1. Go to Insurance Policies 2. Click "Add Policy" 3. Fill provider, policy number, coverage, start/expiry date 4. Save | Policy created with status "Active" | | |
| TC_INS_002 | View Insurance Policies | Policies exist | 1. Navigate to Insurance Policies page | All policies listed with patient, provider, status | | |
| TC_INS_003 | Expired Policy Status | Policy with past expiry date | 1. Check policy status display | Status shows "Expired" | | |
| TC_INS_004 | Submit Insurance Claim | Active policy exists, bill exists | 1. Go to Insurance Claims 2. Click "Submit Claim" 3. Select policy, bill, enter claim amount 4. Save | Claim submitted with status "Submitted" | | |
| TC_INS_005 | Approve Insurance Claim | Claim with status "Submitted" | 1. Change status to "Approved" 2. Enter approved amount 3. Save | Status updated, approvedAmount populated | | |
| TC_INS_006 | Reject Insurance Claim | Claim exists | 1. Change status to "Rejected" 2. Enter reason 3. Save | Status = "Rejected", reason saved | | |
| TC_INS_007 | Claim Amount Validation | Submitting claim | 1. Enter claim amount > coverage amount | Warning or error about exceeding coverage | | |

---

### Module 10: TPA MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_TPA_001 | Add New TPA | Admin logged in | 1. Go to TPA Management 2. Click "Add TPA" 3. Fill name, contact, email, phone, address 4. Save | TPA created with status "Active" | | |
| TC_TPA_002 | Edit TPA Details | TPA exists | 1. Click Edit 2. Update contact person 3. Save | TPA details updated | | |
| TC_TPA_003 | Deactivate TPA | TPA is active | 1. Change status to "Inactive" 2. Save | TPA status = "Inactive" | | |
| TC_TPA_004 | View TPA List | TPAs exist | 1. Navigate to TPA page | All TPAs listed with name, contact, status | | |
| TC_TPA_005 | Delete TPA | TPA exists | 1. Click Delete 2. Confirm | TPA removed from list | | |

---

### Module 11: STAFF MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_STF_001 | Add New Staff Member | Admin logged in | 1. Go to Staff Management 2. Click "Add Staff" 3. Fill name, role, department, phone, email 4. Save | Staff member created | | |
| TC_STF_002 | Edit Staff Details | Staff exists | 1. Edit staff member 2. Change department 3. Save | Department updated | | |
| TC_STF_003 | View Staff List | Staff members exist | 1. Navigate to Staff page | All staff listed with role, department, status | | |
| TC_STF_004 | Change Staff Status | Staff exists | 1. Change status to "On Leave" | Status updated | | |
| TC_STF_005 | Delete Staff Member | Staff exists | 1. Delete staff 2. Confirm | Staff removed | | |
| TC_STF_006 | Filter Staff by Department | Multiple departments | 1. Filter by specific department | Only staff from selected department shown | | |

---

### Module 12: WARD & ROOM MANAGEMENT

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_WRD_001 | Create New Ward | Admin logged in | 1. Go to Ward Management 2. Click "Add Ward" 3. Fill name, type, total beds, floor 4. Save | Ward created, availableBeds = totalBeds | | |
| TC_WRD_002 | Edit Ward Details | Ward exists | 1. Edit ward 2. Change total beds 3. Save | Ward updated, available beds recalculated | | |
| TC_WRD_003 | View Ward Occupancy | Wards with admissions | 1. View ward list | Occupied vs Available beds displayed correctly | | |
| TC_WRD_004 | Ward Maintenance Status | Ward exists | 1. Change status to "Maintenance" | Ward unavailable for new admissions | | |
| TC_WRD_005 | Delete Ward | Ward with no patients | 1. Delete ward 2. Confirm | Ward removed | | |

---

### Module 13: ANALYTICS DASHBOARD

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_DASH_001 | Dashboard KPI Cards | Data exists | 1. Navigate to Dashboard | Total Patients, Doctors, Appointments, Revenue shown | | |
| TC_DASH_002 | Revenue Chart | Bills exist | 1. Check revenue chart on dashboard | Chart rendered with correct data points | | |
| TC_DASH_003 | Patient Statistics | Patients exist | 1. Check patient statistics section | Gender distribution, age groups, trends displayed | | |
| TC_DASH_004 | Appointment Statistics | Appointments exist | 1. Check appointment chart | Status-wise breakdown shown (scheduled, completed, cancelled) | | |
| TC_DASH_005 | Dashboard Data Accuracy | Known data in DB | 1. Compare dashboard numbers with DB records | Numbers match exactly | | |

---

### Module 14: ROLE-BASED ACCESS CONTROL (RBAC)

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_RBAC_001 | Admin Full Access | Logged in as Admin | 1. Navigate to all modules (Patients, Doctors, Billing, Lab, IPD, Settings) | All modules accessible | | |
| TC_RBAC_002 | Doctor Limited Access | Logged in as Doctor | 1. Try accessing Admin-only features (e.g., Staff Management) | Access denied or menu not visible | | |
| TC_RBAC_003 | Nurse Limited Access | Logged in as Nurse | 1. Try accessing admin-only pages | Access restricted to nurse-allowed modules | | |
| TC_RBAC_004 | Patient Portal Access | Logged in as Patient | 1. Check available modules | Only patient-relevant features visible (own records, appointments) | | |
| TC_RBAC_005 | Staff Role Access | Logged in as Staff | 1. Navigate through system | Access limited to staff-allowed features | | |
| TC_RBAC_006 | Direct URL Bypass Attempt | Logged in as Patient | 1. Manually type /admin URL in browser | Redirected to allowed page or access denied | | |

---

### Module 15: SETTINGS & USER PREFERENCES

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_SET_001 | Open Settings Panel | User logged in | 1. Click Settings icon/menu | Settings panel opens with current preferences | | |
| TC_SET_002 | Toggle Dark/Light Theme | Settings open | 1. Toggle theme switch | Theme changes immediately (dark ↔ light) | | |
| TC_SET_003 | Save Settings | Settings modified | 1. Change settings 2. Click Save | Settings persisted, retained after refresh | | |
| TC_SET_004 | Settings Per User | Two users exist | 1. Login as User A → set Dark theme 2. Login as User B → set Light theme 3. Re-login as User A | User A sees Dark theme (settings are user-specific) | | |

---

### Module 16: UI & CROSS-BROWSER TESTING

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_UI_001 | Responsive Design - Desktop | App running | 1. Open app in desktop (1920x1080) | All elements properly aligned, no overflow | | |
| TC_UI_002 | Responsive Design - Tablet | App running | 1. Resize browser to 768px width | Layout adjusts, sidebar collapses, content readable | | |
| TC_UI_003 | Responsive Design - Mobile | App running | 1. Resize to 375px width | Mobile-friendly layout, hamburger menu appears | | |
| TC_UI_004 | Chrome Compatibility | App running | 1. Open and test all pages in Google Chrome | All features work correctly | | |
| TC_UI_005 | Firefox Compatibility | App running | 1. Open and test all pages in Mozilla Firefox | All features work correctly | | |
| TC_UI_006 | Edge Compatibility | App running | 1. Open and test all pages in Microsoft Edge | All features work correctly | | |
| TC_UI_007 | Sidebar Navigation | User logged in | 1. Click each sidebar menu item | Correct page loads for each item | | |
| TC_UI_008 | Header Display | User logged in | 1. Check header | Hospital name, user info, notifications visible | | |
| TC_UI_009 | Notification Center | User logged in | 1. Click notification bell | Notification panel opens with alerts | | |
| TC_UI_010 | Footer Display | Any page | 1. Scroll to bottom | Footer with copyright and links visible | | |

---

### Module 17: API TESTING (using Postman/Browser DevTools)

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_API_001 | POST /api/auth/login | Backend running | 1. Send POST with {username, password} | 200 OK with JWT token in response | | |
| TC_API_002 | GET /api/patients | Auth token available | 1. Send GET with Authorization header | 200 OK with array of patients | | |
| TC_API_003 | POST /api/patients | Auth token available | 1. Send POST with patient data | 201 Created with patient object | | |
| TC_API_004 | GET /api/doctors | Auth token available | 1. Send GET request | 200 OK with doctor list | | |
| TC_API_005 | POST /api/appointments | Auth token available | 1. Send POST with appointment data | 201 Created with appointment object | | |
| TC_API_006 | GET /api/billing | Auth token available | 1. Send GET request | 200 OK with billing records | | |
| TC_API_007 | GET /api/laboratory | Auth token available | 1. Send GET request | 200 OK with lab requests | | |
| TC_API_008 | Unauthorized API Access | No auth token | 1. Send GET /api/patients without token | 401 Unauthorized error | | |
| TC_API_009 | Invalid Token | Tampered JWT token | 1. Send request with invalid token | 403 Forbidden or 401 Unauthorized | | |
| TC_API_010 | API Response Time | Backend running | 1. Check response time for GET requests | Response within 500ms for list endpoints | | |

---

### Module 18: DATABASE VALIDATION

| TC ID | Test Case Description | Pre-Condition | Test Steps | Expected Result | Actual Result | Status |
|-------|----------------------|---------------|------------|-----------------|---------------|--------|
| TC_DB_001 | Patient Data Integrity | Patient created via UI | 1. Query: SELECT * FROM patients WHERE patientId = 'xxx' | All fields match UI input | | |
| TC_DB_002 | Foreign Key Constraints | Patient with appointments | 1. Try DELETE FROM patients WHERE id = x | Error due to FK constraint (or cascade delete) | | |
| TC_DB_003 | Unique Constraint - Email | User with email exists | 1. Try INSERT user with same email | Duplicate entry error | | |
| TC_DB_004 | Timestamps Auto-Fill | New record created | 1. Check createdAt and updatedAt columns | Auto-populated with current timestamp | | |
| TC_DB_005 | Cascade Delete | Patient with billing | 1. Delete patient 2. Check billing table | Related billing records also deleted (ON DELETE CASCADE) | | |

---

## 📊 TEST SUMMARY TEMPLATE

| Metric | Count |
|--------|-------|
| Total Test Cases | 115 |
| Modules Covered | 18 |
| Passed | __ |
| Failed | __ |
| Blocked | __ |
| Not Executed | __ |

---

## 🐛 BUG REPORT TEMPLATE

| Field | Details |
|-------|---------|
| **Bug ID** | BUG_001 |
| **Module** | e.g., Patient Management |
| **Summary** | Short description |
| **Steps to Reproduce** | 1. Step 1 2. Step 2 3. Step 3 |
| **Expected Result** | What should happen |
| **Actual Result** | What actually happened |
| **Severity** | Critical / High / Medium / Low |
| **Priority** | P1 / P2 / P3 / P4 |
| **Environment** | Chrome 120, Windows 11, localhost |
| **Screenshot** | [Attach screenshot] |
| **Status** | Open / In Progress / Fixed / Closed |

---

## 🛠️ TOOLS USED (for Resume)

| Category | Tool |
|----------|------|
| Test Management | Excel / Google Sheets |
| API Testing | Postman, Browser DevTools |
| Browser Testing | Chrome, Firefox, Edge |
| Automation (basic) | Selenium (Python), Puppeteer (JS) |
| Bug Tracking | Excel / Jira (mention if used) |
| Database Verification | MySQL Workbench / CLI |
| Version Control | Git, GitHub |
| Deployment | Railway (Cloud), Docker |

---

## 📌 TESTING TYPES PERFORMED (for Resume/Interview)

1. **Functional Testing** – Verified all CRUD operations, login, module workflows
2. **UI Testing** – Checked layout, alignment, fonts, colors, responsiveness
3. **Integration Testing** – Verified frontend ↔ backend ↔ database data flow
4. **Regression Testing** – Re-tested after each deployment/bug fix
5. **Cross-Browser Testing** – Chrome, Firefox, Edge
6. **API Testing** – Tested REST API endpoints using Postman
7. **Database Testing** – Validated data integrity, constraints, cascading
8. **Security Testing (Basic)** – Tested RBAC, protected routes, token validation
9. **Smoke Testing** – Quick test of critical flows after deployment
10. **Negative Testing** – Invalid inputs, empty fields, boundary values

---

*Document prepared by: Satyam Gatthewar*  
*Project: Hospital Management System (HMS)*  
*Date: February 2026*
