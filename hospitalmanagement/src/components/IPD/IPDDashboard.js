import React, { useState } from 'react';

function IPDDashboard() {
  const [ipdPatients, setIpdPatients] = useState([
    { id: 1, name: 'Robert Wilson', age: 55, disease: 'Heart Surgery', doctor: 'Dr. Davis', bedNo: '101', admitDate: '2025-01-20' },
    { id: 2, name: 'Sarah Lee', age: 42, disease: 'Appendicitis', doctor: 'Dr. Martinez', bedNo: '102', admitDate: '2025-01-25' },
    { id: 3, name: 'David Taylor', age: 38, disease: 'Pneumonia', doctor: 'Dr. Anderson', bedNo: '103', admitDate: '2025-01-22' },
  ]);

  return (
    <div className="table-container">
      <h3 className="table-title">IPD Patients List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Disease</th>
            <th>Doctor</th>
            <th>Bed No</th>
            <th>Admit Date</th>
          </tr>
        </thead>
        <tbody>
          {ipdPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.disease}</td>
              <td>{patient.doctor}</td>
              <td>{patient.bedNo}</td>
              <td>{patient.admitDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IPDDashboard;