import React, { useState, useContext, useMemo, useEffect } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import {
    Calendar as CalendarIcon,
    User,
    Activity,
    FileText,
    Pill,
    DollarSign,
    Clock,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    Save,
    Printer
} from 'lucide-react';
import '../styles/SpecialOPD.css'; // We will create this CSS file next

const SpecialOPD = () => {
    const {
        doctors,
        patients,
        addOPDRecord,
        addBill,
        addAppointment,
        appointments
    } = useContext(HospitalContext);

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('calendar'); // 'calendar' or 'consultation'
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Consultation Form State
    const [consultation, setConsultation] = useState({
        patientId: '',
        patientName: '',
        vitals: {
            bp: '',
            pulse: '',
            temp: '',
            weight: '',
            spo2: ''
        },
        symptoms: '',
        diagnosis: '',
        prescription: [],
        reports: [], // Mock attachments
        followUpDate: '',
        billingAmount: '',
        paymentStatus: 'Pending',
        notes: ''
    });

    // Medicine Input State
    const [newMedicine, setNewMedicine] = useState({
        name: '',
        dosage: '',
        frequency: '',
        duration: ''
    });

    // --- Calendar Logic ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthAppointments = useMemo(() => {
        return appointments.filter(app => {
            const appDate = new Date(app.appointmentDate);
            const appDoctorName = `${app.doctorFirstName} ${app.doctorLastName}`;
            return appDate.getMonth() === selectedDate.getMonth() &&
                appDate.getFullYear() === selectedDate.getFullYear() &&
                (!selectedDoctor || appDoctorName === selectedDoctor);
        });
    }, [appointments, selectedDate, selectedDoctor]);

    const renderCalendar = () => {
        const totalDays = getDaysInMonth(selectedDate);
        const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const currentDayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            const dailyApps = monthAppointments.filter(app => {
                const appDate = new Date(app.appointmentDate);
                return appDate.getDate() === day;
            });

            days.push(
                <div key={day} className="calendar-day">
                    <span className="day-number">{day}</span>
                    <div className="day-appointments">
                        {dailyApps.map(app => (
                            <div
                                key={app.id}
                                className={`mini-appointment ${app.status.toLowerCase()}`}
                                onClick={() => startConsultation(app)}
                            >
                                {app.patientFirstName} {app.patientLastName}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    // --- Consultation Logic ---
    const startConsultation = (appointment) => {
        setSelectedAppointment(appointment);
        const doctorName = `${appointment.doctorFirstName} ${appointment.doctorLastName}`;
        const patientName = `${appointment.patientFirstName} ${appointment.patientLastName}`;

        setConsultation(prev => ({
            ...prev,
            patientId: appointment.patientId || '',
            patientName: patientName,
            billingAmount: doctors.find(d => `${d.firstName} ${d.lastName}` === doctorName)?.consultationFee || 500
        }));
        setView('consultation');
    };

    const handleVitalChange = (e) => {
        const { name, value } = e.target;
        setConsultation(prev => ({
            ...prev,
            vitals: { ...prev.vitals, [name]: value }
        }));
    };

    const addMedicine = () => {
        if (newMedicine.name && newMedicine.dosage) {
            setConsultation(prev => ({
                ...prev,
                prescription: [...prev.prescription, { ...newMedicine, id: Date.now() }]
            }));
            setNewMedicine({ name: '', dosage: '', frequency: '', duration: '' });
        }
    };

    const removeMedicine = (id) => {
        setConsultation(prev => ({
            ...prev,
            prescription: prev.prescription.filter(med => med.id !== id)
        }));
    };

    const handleSaveConsultation = async () => {
        // 1. Save to OPD Records
        const doctorName = selectedAppointment
            ? `${selectedAppointment.doctorFirstName} ${selectedAppointment.doctorLastName}`
            : selectedDoctor;

        const opdData = {
            id: Date.now(),
            patientName: consultation.patientName,
            patientId: consultation.patientId, // Ensure we have this
            visitDate: new Date().toISOString().split('T')[0],
            doctorName: doctorName,
            department: selectedAppointment?.department || 'General',
            symptoms: consultation.symptoms,
            diagnosis: consultation.diagnosis,
            treatment: JSON.stringify(consultation.prescription), // Store prescription as string or adjust backend
            vitals: consultation.vitals, // Backend might need schema update or ignored if strict
            notes: consultation.notes || '',
            followUpDate: consultation.followUpDate || null,
            consultationFee: consultation.billingAmount,
            status: 'Completed'
        };

        await addOPDRecord(opdData);

        // 2. Generate Bill if needed
        if (consultation.billingAmount > 0) {
            const billData = {
                patientId: consultation.patientId,
                patientName: consultation.patientName,
                amount: parseFloat(consultation.billingAmount),
                description: `OPD Consultation - ${doctorName}`,
                paymentStatus: consultation.paymentStatus.toLowerCase(),
                date: new Date().toISOString().split('T')[0],
                status: consultation.paymentStatus
            };
            await addBill(billData);
        }

        // 3. Schedule Follow-up if date selected
        if (consultation.followUpDate) {
            const followUpData = {
                patientId: consultation.patientId,
                doctorId: selectedAppointment?.doctorId || doctors.find(d => `${d.firstName} ${d.lastName}` === selectedDoctor)?.id,
                appointmentDate: `${consultation.followUpDate} 10:00:00`,
                reason: 'OPD Follow-up',
                status: 'scheduled'
            };
            await addAppointment(followUpData);
        }

        alert('Consultation saved successfully!');
        setView('calendar');
        setConsultation({ // Reset form
            patientId: '', patientName: '', vitals: { bp: '', pulse: '', temp: '', weight: '', spo2: '' },
            symptoms: '', diagnosis: '', prescription: [], reports: [], followUpDate: '', billingAmount: '', paymentStatus: 'Pending', notes: ''
        });
    };

    return (
        <div className="special-opd-container fade-in">
            <header className="opd-header">
                <h1><Activity className="icon" /> Special OPD Management</h1>
                {view === 'consultation' && (
                    <button className="btn btn-secondary" onClick={() => setView('calendar')}>
                        Back to Calendar
                    </button>
                )}
            </header>

            {view === 'calendar' ? (
                <div className="calendar-view card">
                    <div className="calendar-controls">
                        <div className="doctor-selector">
                            <User className="icon" />
                            <select
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                            >
                                <option value="">All Doctors</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={`${doc.firstName} ${doc.lastName}`}>
                                        {doc.firstName} {doc.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="date-navigation">
                            <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
                                <ChevronLeft />
                            </button>
                            <h2>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                            <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
                                <ChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid-header">
                        {dayNames.map(day => <div key={day} className="day-name">{day}</div>)}
                    </div>
                    <div className="calendar-grid">
                        {renderCalendar()}
                    </div>
                </div>
            ) : (
                <div className="consultation-view">
                    <div className="consultation-grid">
                        {/* Left Column: Vitals & History */}
                        <div className="consultation-left">
                            <div className="card patient-card">
                                <h3><User className="icon" /> Patient: {consultation.patientName}</h3>
                                <div className="vitals-grid">
                                    <div className="vital-input">
                                        <label>BP (mmHg)</label>
                                        <input name="bp" value={consultation.vitals.bp} onChange={handleVitalChange} placeholder="120/80" />
                                    </div>
                                    <div className="vital-input">
                                        <label>Pulse (bpm)</label>
                                        <input name="pulse" value={consultation.vitals.pulse} onChange={handleVitalChange} placeholder="72" />
                                    </div>
                                    <div className="vital-input">
                                        <label>Temp (°F)</label>
                                        <input name="temp" value={consultation.vitals.temp} onChange={handleVitalChange} placeholder="98.6" />
                                    </div>
                                    <div className="vital-input">
                                        <label>SpO2 (%)</label>
                                        <input name="spo2" value={consultation.vitals.spo2} onChange={handleVitalChange} placeholder="98" />
                                    </div>
                                    <div className="vital-input">
                                        <label>Weight (kg)</label>
                                        <input name="weight" value={consultation.vitals.weight} onChange={handleVitalChange} placeholder="70" />
                                    </div>
                                </div>
                            </div>

                            <div className="card clinical-notes">
                                <h3><FileText className="icon" /> Clinical Notes</h3>
                                <div className="form-group">
                                    <label>Symptoms / Chief Complaints</label>
                                    <textarea
                                        value={consultation.symptoms}
                                        onChange={(e) => setConsultation(prev => ({ ...prev, symptoms: e.target.value }))}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Diagnosis</label>
                                    <textarea
                                        value={consultation.diagnosis}
                                        onChange={(e) => setConsultation(prev => ({ ...prev, diagnosis: e.target.value }))}
                                        rows="2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Rx, Billing, Actions */}
                        <div className="consultation-right">
                            <div className="card prescription-card">
                                <h3><Pill className="icon" /> Prescription</h3>
                                <div className="rx-input-row">
                                    <input
                                        placeholder="Medicine Name"
                                        value={newMedicine.name}
                                        onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                    <input
                                        placeholder="Dose"
                                        className="short-input"
                                        value={newMedicine.dosage}
                                        onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                                    />
                                    <input
                                        placeholder="Freq"
                                        className="short-input"
                                        value={newMedicine.frequency}
                                        onChange={(e) => setNewMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                                    />
                                    <button className="btn-icon add-btn" onClick={addMedicine}><Plus size={18} /></button>
                                </div>
                                <div className="rx-list">
                                    {consultation.prescription.map(med => (
                                        <div key={med.id} className="rx-item">
                                            <span>{med.name} - {med.dosage} ({med.frequency})</span>
                                            <button className="btn-icon delete-btn" onClick={() => removeMedicine(med.id)}><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card billing-card">
                                <h3><DollarSign className="icon" /> Billing & Follow-up</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Consultation Fee</label>
                                        <input
                                            type="number"
                                            value={consultation.billingAmount}
                                            onChange={(e) => setConsultation(prev => ({ ...prev, billingAmount: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Payment Status</label>
                                        <select
                                            value={consultation.paymentStatus}
                                            onChange={(e) => setConsultation(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label><Clock className="icon-small" /> Follow-up Date</label>
                                    <input
                                        type="date"
                                        value={consultation.followUpDate}
                                        onChange={(e) => setConsultation(prev => ({ ...prev, followUpDate: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleSaveConsultation}>
                                    <Save className="icon" /> Save & Finish
                                </button>
                                <button className="btn btn-secondary" onClick={() => window.print()}>
                                    <Printer className="icon" /> Print Rx
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecialOPD;
