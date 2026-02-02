import React, { useContext, useState } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/DoctorsPage.css';

const DoctorsPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const doctors = ctx.doctors || [];
  const addDoctor = ctx.addDoctor || (() => {});

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    contact: '',
    experience: '',
    availability: '',
    image: '',
    mmcReg: '',
    qualifications: '', // comma separated
    registrationCertificate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.specialty) return;
    const newDoctor = {
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      contact: form.contact.trim(),
      experience: form.experience.trim(),
      availability: form.availability.trim(),
      image: form.image.trim(),
      mmcReg: form.mmcReg.trim(),
      qualifications: form.qualifications.split(',').map(q => q.trim()).filter(Boolean),
      registrationCertificate: form.registrationCertificate.trim()
    };
    addDoctor(newDoctor);
    setForm({
      name: '',
      specialty: '',
      contact: '',
      experience: '',
      availability: '',
      image: '',
      mmcReg: '',
      qualifications: '',
      registrationCertificate: ''
    });
  };

  return (
    <div className="doctors-page fade-in">
      <h1>Doctors</h1>

      {/* Add doctor form */}
      <div className="add-doctor-card card">
        <h2>Add New Doctor</h2>
        <form className="add-doctor-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required />
            <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty *" required />
          </div>
          <div className="form-row">
            <input name="mmcReg" value={form.mmcReg} onChange={handleChange} placeholder="MMC Registration No." />
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience (e.g. 12 years)" />
          </div>
          <div className="form-row">
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact number" />
            <input name="availability" value={form.availability} onChange={handleChange} placeholder="Availability (e.g. Mon-Fri 09:00-17:00)" />
          </div>
          <div className="form-row">
            <input name="image" value={form.image} onChange={handleChange} placeholder="Photo URL" />
            <input name="registrationCertificate" value={form.registrationCertificate} onChange={handleChange} placeholder="Registration certificate URL" />
          </div>
          <div className="form-row">
            <input name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="Qualifications (comma separated)" />
          </div>
          <div className="form-row">
            <button type="submit" className="btn-primary">Add Doctor</button>
          </div>
        </form>
      </div>

      {/* Existing doctors list */}
      <div className="doctors-grid">
        {doctors.map(doc => (
          <div key={doc.id} className="doctor-card">
            <div className="doctor-photo">
              <img src={doc.image || '/placeholder-doctor.png'} alt={doc.name} />
            </div>
            <div className="doctor-info">
              <h3>{doc.name}</h3>
              <p className="specialty">{doc.specialty}</p>

              <div className="meta">
                <div><strong>MMC Reg:</strong> {doc.mmcReg || '—'}</div>
                <div><strong>Experience:</strong> {doc.experience || '—'}</div>
                <div><strong>Availability:</strong> {doc.availability || '—'}</div>
                <div className="contact"><strong>Contact:</strong> {doc.contact ? <a href={`tel:${doc.contact}`}>{doc.contact}</a> : '—'}</div>
              </div>

              <div className="qualifications">
                <strong>Qualifications:</strong>
                <ul>
                  {(doc.qualifications || []).map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>

              {doc.registrationCertificate && (
                <div className="cert">
                  <a href={doc.registrationCertificate} target="_blank" rel="noopener noreferrer">
                    View Registration Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
