import React, { useEffect, useState } from 'react';
import { fetchAssignments } from '../../services/labAssignmentService';
import { LaboratoryService } from '../../services/laboratoryService';

const PrintReports = () => {
  const [reports, setReports] = useState([]);

  const load = async () => {
    const a = await fetchAssignments();
    const completed = (a || []).filter((it) => it.status === 'Completed');
    setReports(completed);
  };

  useEffect(() => { load(); }, []);

  const viewText = (assignment) => {
    const report = LaboratoryService.generateReportFormat(assignment);
    const text = LaboratoryService.exportAsText(report);
    const w = window.open('', '_blank');
    w.document.write('<pre>' + text.replace(/</g, '&lt;') + '</pre>');
    w.document.close();
  };

  return (
    <div className="print-reports">
      <h3>Completed Reports</h3>
      {reports.length === 0 ? (
        <p>No completed reports</p>
      ) : (
        <ul>
          {reports.map((r) => (
            <li key={r.id}>
              {r.patientName || r.patientId} — {r.tests.length} tests — <button onClick={() => viewText(r)}>View / Print</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrintReports;
