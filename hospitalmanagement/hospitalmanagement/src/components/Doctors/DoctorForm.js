import React, { useState, useEffect } from 'react';

const defaultAvailability = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

const DoctorForm = ({ doctor = null, onSave, onCancel }) => {
  const [form, setForm] = useState({
    id: doctor?.id || null,
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    availability: doctor?.availability || defaultAvailability,
    notes: doctor?.notes || '',
  });

  useEffect(() => setForm((f) => ({ ...f, id: doctor?.id || f.id })), [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availability: { ...prev.availability, [day]: !prev.availability[day] },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="doctor-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <label>Specialization</label>
        <input name="specialization" value={form.specialization} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} type="email" />
      </div>

      <div className="form-row">
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </div>

      <div className="form-row availability">
        <label>Availability</label>
        <div className="days">
          {Object.keys(form.availability).map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={form.availability[day]}
                onChange={() => toggleDay(day)}
              />
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">Save Doctor</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default DoctorForm;
