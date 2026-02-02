# Quick Reference - Patient Management Module

## Access the Module
- **URL:** http://localhost:3002/patients
- **Navigation:** Click on Patient Management in the sidebar menu

## Tab Navigation Guide

| Tab | Purpose | Action |
|-----|---------|--------|
| 👥 Patient List | View all patients | Search, Filter, Edit, Delete, View History |
| ➕ Add Patient | Create new patient | Fill form with 15 fields, Submit |
| 📋 Patient Details | View patient profile | Edit, Register OPD/IPD, View History |
| 🏥 OPD Registration | Register outpatient visit | Select dept/doctor, Enter symptoms |
| 🛏️ IPD Registration | Register hospital admission | Select ward/bed, Set stay duration |
| ✓ Discharge Summary | Create discharge docs | Record diagnosis, treatment, follow-up |
| 📜 Visit History | View all visits | Timeline, statistics, complete history |

## Patient Form Fields

### Personal Information
- First Name (required)
- Last Name (required)
- Date of Birth (required)
- Gender (required)
- Blood Group

### Contact Information
- Phone (required)
- Email (required)
- Address (required)
- City
- State
- Zip Code

### Emergency Contact
- Contact Name
- Contact Phone

### Medical Information
- Medical History
- Allergies

## Search Functionality
Search patients by:
- First Name
- Last Name
- Patient ID
- Phone Number

## Sample Data Included
- 2 pre-loaded patients (John Doe, Sarah Smith)
- 11 departments for selection
- 8 doctors with specialties
- 6 ward options for IPD

## Keyboard Shortcuts
- **Tab** - Navigate form fields
- **Enter** - Submit form
- **Escape** - Cancel operation

## Color Coding
- 🟣 Purple: Primary actions, headers
- 🟢 Green: OPD, Success actions
- 🔵 Blue: IPD, Information
- 🟡 Yellow: Edit, Priority flags
- 🔴 Red: Delete, Errors
- 🔵 Teal: History, Details

## Most Common Workflows

### Adding a Patient
1. Click "➕ Add Patient" tab
2. Fill all required fields (marked with *)
3. Click "Add Patient" button
4. Redirected to patient list

### Registering OPD Visit
1. Click on patient from list
2. Click "🏥 OPD Registration" tab
3. Select department and doctor
4. Enter visit reason and symptoms
5. Click "Register for OPD"

### Registering IPD Admission
1. Click on patient from list
2. Click "🛏️ IPD Registration" tab
3. Select department, ward, bed
4. Enter admission reason
5. Set estimated stay duration
6. Click "Register for IPD"

### Creating Discharge Summary
1. After IPD registration, click "✓ Discharge Summary"
2. Enter diagnosis and treatment details
3. Add medications and follow-up date
4. Set activity restrictions
5. Click "Save & Generate Discharge Summary"

### Viewing Visit History
1. Click patient from list
2. Click "📜 Visit History" tab
3. View timeline of all visits
4. See visit statistics

## Validation Rules

### Required Fields Marked with *

Patient Form:
- ✓ First Name, Last Name, DOB, Gender, Phone, Email, Address

OPD Registration:
- ✓ Department, Doctor, Visit Reason, Symptoms

IPD Registration:
- ✓ Department, Doctor, Admission Reason, Ward, Bed Number, Estimated Stay

Discharge Summary:
- ✓ Diagnosis, Treatment, Medicines, Follow-up Date, Restrictions

### Error Handling
- Fields with errors turn red
- Error messages appear below field
- Errors clear when user starts typing
- Form won't submit until all errors resolved

## Tips & Tricks

1. **Doctor Selection** - Doctors automatically filter by selected department
2. **Age Calculation** - Age automatically calculated from date of birth
3. **Visit Count** - Total visits shown in patient list table
4. **Search Persistence** - Search terms remain until you clear them
5. **Tab Memory** - Selected tab persists until navigation changes
6. **Mock Data** - All data stored in component state (refreshes on page reload)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see patients | Check if you're on /patients route |
| Doctor list empty | First select a department |
| Form won't submit | Check all required fields (with *) are filled |
| Data disappears | Refresh resets data (mock data only) |
| Tab won't switch | Ensure patient is selected first |

## Browser Recommendations
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsive?
Yes! The module is fully responsive:
- 📱 Mobile: Single column layout
- 📱 Tablet: 2-column grid
- 💻 Desktop: Full multi-column layout

## Next Steps
1. Start adding patient records
2. Register OPD and IPD visits
3. Create discharge summaries
4. Check visit histories
5. Explore the complete workflow

---

**Need Help?** All forms have helpful placeholders and error messages to guide you!
