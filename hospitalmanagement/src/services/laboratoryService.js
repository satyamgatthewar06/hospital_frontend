// Laboratory Service - Handles all lab operations
export class LaboratoryService {
  
  // Predefined lab tests available
  static getAllTests() {
    return [
      { id: 1, name: 'Complete Blood Count (CBC)', format: 'Blood', price: 500, description: 'Full blood count with differential (Hb, RBC, WBC, Platelets)', sampleType: 'EDTA Tube - 3ml' },
      { id: 2, name: 'ESR (Erythrocyte Sedimentation Rate)', format: 'Blood', price: 200, description: 'Inflammation marker', sampleType: 'EDTA Tube - 2ml' },
      { id: 3, name: 'CRP (C-Reactive Protein)', format: 'Blood Serum', price: 350, description: 'Acute phase reactant for inflammation', sampleType: 'SST Tube - 3ml' },
      { id: 4, name: 'Blood Culture', format: 'Blood', price: 1200, description: 'Detect bacterial/fungal growth in blood', sampleType: 'Blood Culture Bottles' },
      { id: 5, name: 'Blood Group & Rh Typing', format: 'Blood', price: 300, description: 'ABO and Rh (D) grouping', sampleType: 'EDTA Tube - 2ml' },
      { id: 6, name: 'HbA1c (Glycated Hemoglobin)', format: 'Blood', price: 600, description: 'Average blood glucose over 2-3 months', sampleType: 'EDTA Tube - 2ml' },
      { id: 7, name: 'Fasting Blood Sugar (FBS)', format: 'Blood Plasma', price: 300, description: 'Glucose level after 8-12 hours fasting', sampleType: 'Fluoride Tube - 2ml' },
      { id: 8, name: 'Random Blood Sugar (RBS)', format: 'Blood Plasma', price: 250, description: 'Random glucose measurement', sampleType: 'Fluoride Tube - 2ml' },
      { id: 9, name: 'Lipid Profile', format: 'Blood Serum', price: 700, description: 'Total Cholesterol, LDL, HDL, Triglycerides', sampleType: 'SST Tube - 5ml' },
      { id: 10, name: 'Liver Function Test (LFT)', format: 'Blood Serum', price: 600, description: 'Bilirubin, AST, ALT, ALP, Albumin', sampleType: 'SST Tube - 5ml' },
      { id: 11, name: 'Kidney Function Test (KFT)', format: 'Blood Serum', price: 550, description: 'Creatinine, BUN, Electrolytes', sampleType: 'SST Tube - 5ml' },
      { id: 12, name: 'Serum Electrolytes', format: 'Blood Serum', price: 400, description: 'Sodium, Potassium, Chloride, Bicarbonate', sampleType: 'SST Tube - 3ml' },
      { id: 13, name: 'Coagulation Profile (PT/INR, aPTT)', format: 'Blood Plasma', price: 650, description: 'Clotting function tests', sampleType: 'Citrate Tube - 3ml' },
      { id: 14, name: 'Thyroid Profile (TSH, T3, T4)', format: 'Blood Serum', price: 800, description: 'Thyroid function assessment', sampleType: 'SST Tube - 5ml' },
      { id: 15, name: 'Urine Routine (URINE R/M)', format: 'Urine', price: 250, description: 'Physical, chemical, and microscopic examination', sampleType: 'Urine Cup - 60ml' },
      { id: 16, name: 'Urine Culture & Sensitivity', format: 'Urine', price: 800, description: 'Identify urinary pathogens and antibiotic sensitivity', sampleType: 'Sterile Urine Container' },
      { id: 17, name: 'Stool Routine', format: 'Stool', price: 350, description: 'Macroscopic and microscopic analysis', sampleType: 'Stool Container' },
      { id: 18, name: 'Stool Culture', format: 'Stool', price: 900, description: 'Detect enteric pathogens', sampleType: 'Stool Container' },
      { id: 19, name: 'Pregnancy Test (β-hCG)', format: 'Blood/Urine', price: 300, description: 'Detect pregnancy hormone', sampleType: 'Serum or Urine' },
      { id: 20, name: 'HIV (Screening)', format: 'Blood Serum', price: 700, description: 'HIV antibody/antigen screening', sampleType: 'SST Tube - 3ml' },
      { id: 21, name: 'HBsAg (Hepatitis B)', format: 'Blood Serum', price: 500, description: 'Hepatitis B surface antigen', sampleType: 'SST Tube - 3ml' },
      { id: 22, name: 'Anti-HCV (Hepatitis C)', format: 'Blood Serum', price: 700, description: 'Hepatitis C antibody test', sampleType: 'SST Tube - 3ml' },
      { id: 23, name: 'Vitamin B12', format: 'Blood Serum', price: 900, description: 'Serum Vitamin B12 level', sampleType: 'SST Tube - 3ml' },
      { id: 24, name: 'Serum Ferritin', format: 'Blood Serum', price: 650, description: 'Iron stores indicator', sampleType: 'SST Tube - 3ml' },
      { id: 25, name: 'Blood Gas Analysis (ABG)', format: 'Arterial Blood', price: 1200, description: 'pH, pO2, pCO2, HCO3-', sampleType: 'Heparinised Syringe' }
    ];
  }

  // Format test result based on test type
  static formatTestResult(testId, resultValue) {
    const tests = this.getAllTests();
    const test = tests.find(t => t.id === testId);
    
    if (!test) return resultValue;

    // Add units based on test type
    const units = {
      1: ' cells/µL',
      2: ' U/L',
      3: ' mg/dL',
      4: ' mIU/L',
      5: ' mg/dL',
      6: ' mg/dL',
      7: 'N/A',
      8: 'N/A'
    };

    return resultValue + (units[testId] || '');
  }

  // Generate PDF-compatible report format
  static generateReportFormat(testAssignment) {
    return {
      reportId: `LAB-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      patientId: testAssignment.patientId,
      patientName: testAssignment.patientName,
      testAssignmentId: testAssignment.id,
      tests: testAssignment.tests,
      results: testAssignment.results || [],
      status: testAssignment.status,
      submittedBy: testAssignment.submittedBy || 'Lab Technician'
    };
  }

  // Validate test results
  static validateResults(testId, resultValue) {
    if (!resultValue || resultValue.trim() === '') {
      return { valid: false, message: 'Result cannot be empty' };
    }
    
    // Add specific validation rules for different tests
    const numericTests = [1, 2, 3, 4, 5, 6];
    if (numericTests.includes(testId)) {
      if (isNaN(resultValue)) {
        return { valid: false, message: 'Result must be numeric' };
      }
      if (parseFloat(resultValue) < 0) {
        return { valid: false, message: 'Result cannot be negative' };
      }
    }

    return { valid: true, message: 'Valid' };
  }

  // Export report as text format for printing
  static exportAsText(report) {
    let text = `
╔════════════════════════════════════════════╗
║        LABORATORY TEST REPORT              ║
╚════════════════════════════════════════════╝

Report ID:    ${report.reportId}
Date:         ${report.date}
Time:         ${report.time}

PATIENT INFORMATION:
─────────────────────────────────
Name:         ${report.patientName}
Patient ID:   ${report.patientId}

TEST RESULTS:
─────────────────────────────────
`;

    if (report.results && report.results.length > 0) {
      report.results.forEach((result, index) => {
        text += `\n${index + 1}. ${result.testName}
   Result: ${result.resultValue}
   Status: ${result.status || 'Completed'}
`;
      });
    } else {
      text += '\nNo results submitted yet.\n';
    }

    text += `
─────────────────────────────────
Status:       ${report.status}
Submitted By: ${report.submittedBy}

═════════════════════════════════════════════
Generated on: ${new Date().toLocaleString()}
═════════════════════════════════════════════
`;
    return text;
  }
}
