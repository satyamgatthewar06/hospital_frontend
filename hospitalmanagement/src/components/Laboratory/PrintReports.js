import React, { useState, useContext } from 'react';
import { HospitalContext } from '../../context/HospitalContext';
import { LaboratoryService } from '../../services/laboratoryService';
import './PrintReports.css';

function PrintReports() {
  const { testAssignments } = useContext(HospitalContext);
  const [selectedReport, setSelectedReport] = useState('');
  const [printContent, setPrintContent] = useState('');

  const assignment = selectedReport 
    ? testAssignments?.find(ta => ta.id === selectedReport)
    : null;

  const handleGenerateReport = (assignmentId) => {
    const assignment = testAssignments?.find(ta => ta.id === assignmentId);
    if (assignment) {
      const report = LaboratoryService.generateReportFormat(assignment);
      setPrintContent(LaboratoryService.exportAsText(report));
    }
  };

  const handlePrint = () => {
    if (!assignment) return;
    
    const report = LaboratoryService.generateReportFormat(assignment);
    const content = LaboratoryService.exportAsText(report);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Laboratory Report - ${assignment.patientName}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              line-height: 1.6;
            }
            pre {
              background: #f4f4f4;
              padding: 20px;
              border-radius: 5px;
              border: 1px solid #ddd;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            @media print {
              body { padding: 0; }
              pre { border: none; }
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleDownloadText = () => {
    if (!assignment) return;
    
    const report = LaboratoryService.generateReportFormat(assignment);
    const content = LaboratoryService.exportAsText(report);
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `Lab_Report_${assignment.patientName}_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completedAssignments = testAssignments?.filter(ta => ta.status === 'Completed' || ta.results?.length > 0) || [];

  return (
    <div className="print-reports-container">
      <h3>🖨️ Print Reports</h3>

      <div className="reports-grid">
        <div className="form-group">
          <label>Select Report:</label>
          <select 
            value={selectedReport}
            onChange={(e) => {
              setSelectedReport(e.target.value);
              if (e.target.value) {
                handleGenerateReport(e.target.value);
              } else {
                setPrintContent('');
              }
            }}
            className="form-select"
          >
            <option value="">-- Choose a report --</option>
            {completedAssignments.length > 0 ? (
              completedAssignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.patientName} - {assignment.tests.length} test(s)
                  {assignment.results && assignment.results.length > 0 && ' ✓'}
                </option>
              ))
            ) : (
              <option disabled>No completed test assignments</option>
            )}
          </select>
        </div>
      </div>

      {assignment && printContent && (
        <div className="report-preview">
          <div className="report-actions">
            <button onClick={handlePrint} className="btn-print">
              🖨️ Print Report
            </button>
            <button onClick={handleDownloadText} className="btn-download">
              ⬇️ Download as Text
            </button>
          </div>

          <div className="report-content">
            <pre>{printContent}</pre>
          </div>
        </div>
      )}

      {selectedReport && !assignment && (
        <div className="message error">
          Report not found. Please select again.
        </div>
      )}

      {!selectedReport && (
        <div className="info-message">
          📌 Select a test assignment with completed results to view and print the report.
        </div>
      )}
    </div>
  );
}

export default PrintReports;
