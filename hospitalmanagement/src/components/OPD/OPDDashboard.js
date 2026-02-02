import React, { useState } from 'react';

function OPDDashboard() {
  const [opdPatients, setOpdPatients] = useState([
    { id: 1, name: 'John Doe', age: 35, disease: 'Fever', doctor: 'Dr. Smith', date: '2025-01-27' },
    { id: 2, name: 'Jane Smith', age: 28, disease: 'Cough', doctor: 'Dr. Johnson', date: '2025-01-27' },
    { id: 3, name: 'Mike Brown', age: 45, disease: 'Diabetes Checkup', doctor: 'Dr. Williams', date: '2025-01-26' },
  ]);

  return (
    <div className="table-container">
      <h3 className="table-title">OPD Patients List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Disease</th>
            <th>Doctor</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {opdPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.disease}</td>
              <td>{patient.doctor}</td>
              <td>{patient.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OPDDashboard;