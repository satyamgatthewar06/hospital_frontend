import React from 'react';

const DoctorDetails = ({ doctor, onBack, onEdit }) => {
  if (!doctor) return <div>Please select a doctor</div>;

  return (
    <div className="doctor-details">
      <button className="btn-link" onClick={onBack}>← Back</button>
      <h2>{doctor.name}</h2>
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Email:</strong> {doctor.email}</p>
      <p><strong>Phone:</strong> {doctor.phone}</p>

      <h3>Availability</h3>
      <ul>
        {Object.entries(doctor.availability || {}).map(([day, ok]) => (
          <li key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: {ok ? 'Available' : 'Off'}</li>
        ))}
      </ul>

      {doctor.notes && (
        <>
          <h3>Notes</h3>
          <p>{doctor.notes}</p>
        </>
      )}

      <div className="form-actions">
        <button className="btn-primary" onClick={() => onEdit(doctor)}>Edit</button>
      </div>
    </div>
  );
};

export default DoctorDetails;
