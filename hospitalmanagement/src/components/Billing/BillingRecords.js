import React, { useState } from 'react';

function BillingRecords() {
  const [billings, setBillings] = useState([
    { id: 1, patientName: 'John Doe', amount: 5000, date: '2025-01-27', status: 'Paid', type: 'OPD' },
    { id: 2, patientName: 'Jane Smith', amount: 8500, date: '2025-01-26', status: 'Pending', type: 'OPD' },
    { id: 3, patientName: 'Robert Wilson', amount: 85000, date: '2025-01-20', status: 'Paid', type: 'IPD' },
    { id: 4, patientName: 'Sarah Lee', amount: 62000, date: '2025-01-25', status: 'Pending', type: 'IPD' },
  ]);

  return (
    <div className="table-container">
      <h3 className="table-title">Billing Records</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Name</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {billings.map(bill => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{bill.patientName}</td>
              <td>{bill.amount.toLocaleString()}</td>
              <td>{bill.date}</td>
              <td>{bill.type}</td>
              <td style={{ color: bill.status === 'Paid' ? 'green' : 'red' }}>{bill.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillingRecords;