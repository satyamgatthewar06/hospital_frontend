import React, { useState, useEffect, useContext } from 'react';
import { HospitalContext } from '../../context/HospitalContext';
import {
    Activity, FileText, Pill, Scissors, LogOut, Save, Plus, Trash2,
    Clipboard, Thermometer, User, Bed, Clock, AlertCircle
} from 'lucide-react';
import '../../styles/IPDDetailView.css';

const IPDDetailView = ({ ipdRecord, onBack }) => {
    const { ipdDetailsAPI, ipdAPI, doctors } = useContext(HospitalContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Data States
    const [nursingNotes, setNursingNotes] = useState([]);
    const [doctorRounds, setDoctorRounds] = useState([]);
    const [medications, setMedications] = useState([]);
    const [intakeOutput, setIntakeOutput] = useState([]);
    const [otSchedules, setOtSchedules] = useState([]);

    // Form States
    const [newNote, setNewNote] = useState({ nurseName: '', note: '' });
    const [newRound, setNewRound] = useState({ doctorName: '', observation: '', instruction: '' });
    const [newMed, setNewMed] = useState({ medicineName: '', dosage: '', frequency: '', startDate: '', endDate: '' });
    const [newIO, setNewIO] = useState({ date: '', time: '', type: 'Intake', item: '', quantity: '', recordedBy: '' });
    const [newOT, setNewOT] = useState({ procedureName: '', operatingSurgeon: '', otRoom: '', scheduledDate: '', notes: '' });

    // Action States
    const [transferData, setTransferData] = useState({ ward: '', bed: '' });
    const [dischargeNote, setDischargeNote] = useState('');

    useEffect(() => {
        if (ipdRecord?.id) {
            fetchAllData();
        }
    }, [ipdRecord]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [notesRes, roundsRes, medsRes, ioRes, otRes] = await Promise.all([
                ipdDetailsAPI.getNursingNotes(ipdRecord.id),
                ipdDetailsAPI.getDoctorRounds(ipdRecord.id),
                ipdDetailsAPI.getMedications(ipdRecord.id),
                ipdDetailsAPI.getIntakeOutput(ipdRecord.id),
                ipdDetailsAPI.getOTSchedules(ipdRecord.id)
            ]);

            setNursingNotes(notesRes.data.data);
            setDoctorRounds(roundsRes.data.data);
            setMedications(medsRes.data.data);
            setIntakeOutput(ioRes.data.data);
            setOtSchedules(otRes.data.data);
        } catch (error) {
            console.error("Error fetching IPD details:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---

    const handleAddNote = async () => {
        if (!newNote.note) return;
        await ipdDetailsAPI.addNursingNote(ipdRecord.id, newNote);
        setNewNote({ nurseName: '', note: '' });
        fetchAllData();
    };

    const handleAddRound = async () => {
        if (!newRound.observation) return;
        await ipdDetailsAPI.addDoctorRound(ipdRecord.id, newRound);
        setNewRound({ doctorName: '', observation: '', instruction: '' });
        fetchAllData();
    };

    const handleAddMed = async () => {
        if (!newMed.medicineName) return;
        await ipdDetailsAPI.addMedication(ipdRecord.id, newMed);
        setNewMed({ medicineName: '', dosage: '', frequency: '', startDate: '', endDate: '' });
        fetchAllData();
    };

    const handleAddIO = async () => {
        if (!newIO.item || !newIO.quantity) return;
        await ipdDetailsAPI.addIntakeOutput(ipdRecord.id, newIO);
        setNewIO({ date: '', time: '', type: 'Intake', item: '', quantity: '', recordedBy: '' });
        fetchAllData();
    };

    const handleScheduleOT = async () => {
        if (!newOT.procedureName) return;
        await ipdDetailsAPI.addOTSchedule(ipdRecord.id, newOT);
        setNewOT({ procedureName: '', operatingSurgeon: '', otRoom: '', scheduledDate: '', notes: '' });
        fetchAllData();
    };

    const handleTransfer = async () => {
        if (!transferData.ward || !transferData.bed) return;
        try {
            await ipdAPI.update(ipdRecord.id, {
                ward: transferData.ward,
                bedNumber: transferData.bed
            });
            alert('Patient transferred successfully!');
            onBack(); // Go back to refresh list
        } catch (error) {
            alert('Transfer failed: ' + error.message);
        }
    };

    const handleDischarge = async () => {
        if (!window.confirm('Are you sure you want to discharge this patient?')) return;
        try {
            await ipdAPI.update(ipdRecord.id, {
                status: 'Discharged',
                dischargeDate: new Date().toISOString().split('T')[0],
                notes: dischargeNote // Mapping discharge summary to notes for now
            });
            alert('Patient discharged successfully!');
            onBack();
        } catch (error) {
            alert('Discharge failed: ' + error.message);
        }
    };

    return (
        <div className="ipd-detail-view fade-in">
            {/* Header */}
            <header className="detail-header card">
                <div className="patient-info">
                    <button className="back-btn" onClick={onBack}>&larr; Back</button>
                    <div>
                        <h2>{ipdRecord.patientName}</h2>
                        <span className="badge">{ipdRecord.patientId}</span>
                        <span className={`badge status-${ipdRecord.status?.toLowerCase()}`}>{ipdRecord.status}</span>
                    </div>
                </div>
                <div className="ward-info">
                    <div className="info-item">
                        <Bed className="icon" />
                        <span>{ipdRecord.wardName || ipdRecord.ward} ({ipdRecord.bedNumber})</span>
                    </div>
                    <div className="info-item">
                        <User className="icon" />
                        <span>Dr. {ipdRecord.doctorName}</span>
                    </div>
                    <div className="info-item">
                        <Clock className="icon" />
                        <span>Admitted: {new Date(ipdRecord.admissionDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="tabs">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>Clinical Notes</button>
                <button className={activeTab === 'treatment' ? 'active' : ''} onClick={() => setActiveTab('treatment')}>Treatment Plan</button>
                <button className={activeTab === 'surgery' ? 'active' : ''} onClick={() => setActiveTab('surgery')}>Surgery (OT)</button>
                <button className={activeTab === 'actions' ? 'active' : ''} onClick={() => setActiveTab('actions')}>Actions</button>
            </div>

            {/* Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <div className="card">
                            <h3>Admission Details</h3>
                            <p><strong>Diagnosis:</strong> {ipdRecord.diagnosis}</p>
                            <p><strong>Treatment Plan:</strong> {ipdRecord.treatmentPlan || 'N/A'}</p>
                            <p><strong>Attending Nurse:</strong> {ipdRecord.attendingNurse || 'N/A'}</p>
                            <p><strong>Emergency Contact:</strong> {ipdRecord.emergencyContactName} ({ipdRecord.emergencyContactPhone})</p>
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="notes-tab grid-2">
                        {/* Nursing Notes */}
                        <div className="card">
                            <h3><Clipboard className="icon" /> Nursing Notes</h3>
                            <div className="scroll-list">
                                {nursingNotes.map(note => (
                                    <div key={note.id} className="note-item">
                                        <div className="meta">
                                            <span className="author">{note.nurseName || 'Nurse'}</span>
                                            <span className="time">{new Date(note.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p>{note.note}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="add-form">
                                <input
                                    placeholder="Nurse Name"
                                    value={newNote.nurseName}
                                    onChange={e => setNewNote({ ...newNote, nurseName: e.target.value })}
                                />
                                <textarea
                                    placeholder="Add clinical note..."
                                    value={newNote.note}
                                    onChange={e => setNewNote({ ...newNote, note: e.target.value })}
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleAddNote}>Add Note</button>
                            </div>
                        </div>

                        {/* Doctor Rounds */}
                        <div className="card">
                            <h3><User className="icon" /> Doctor Rounds</h3>
                            <div className="scroll-list">
                                {doctorRounds.map(round => (
                                    <div key={round.id} className="note-item round-item">
                                        <div className="meta">
                                            <span className="author">{round.doctorName}</span>
                                            <span className="time">{new Date(round.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p><strong>Obs:</strong> {round.observation}</p>
                                        <p><strong>Instr:</strong> {round.instruction}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="add-form">
                                <select
                                    value={newRound.doctorName}
                                    onChange={e => setNewRound({ ...newRound, doctorName: e.target.value })}
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => <option key={d.id} value={`Dr. ${d.firstName} ${d.lastName}`}>{d.firstName} {d.lastName}</option>)}
                                </select>
                                <textarea
                                    placeholder="Observation"
                                    value={newRound.observation}
                                    onChange={e => setNewRound({ ...newRound, observation: e.target.value })}
                                />
                                <textarea
                                    placeholder="Instruction"
                                    value={newRound.instruction}
                                    onChange={e => setNewRound({ ...newRound, instruction: e.target.value })}
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleAddRound}>Add Round</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'treatment' && (
                    <div className="treatment-tab grid-2">
                        {/* Medications */}
                        <div className="card">
                            <h3><Pill className="icon" /> Medications</h3>
                            <table className="simple-table">
                                <thead>
                                    <tr>
                                        <th>Medicine</th>
                                        <th>Dose</th>
                                        <th>Freq</th>
                                        <th>Start</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medications.map(med => (
                                        <tr key={med.id}>
                                            <td>{med.medicineName}</td>
                                            <td>{med.dosage}</td>
                                            <td>{med.frequency}</td>
                                            <td>{med.startDate && new Date(med.startDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="add-form-row">
                                <input placeholder="Medicine" value={newMed.medicineName} onChange={e => setNewMed({ ...newMed, medicineName: e.target.value })} />
                                <input placeholder="Dose" className="w-50" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
                                <input placeholder="Freq" className="w-50" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} />
                                <input type="date" value={newMed.startDate} onChange={e => setNewMed({ ...newMed, startDate: e.target.value })} />
                                <button className="btn btn-primary btn-sm" onClick={handleAddMed}><Plus size={16} /></button>
                            </div>
                        </div>

                        {/* Intake / Output */}
                        <div className="card">
                            <h3><Activity className="icon" /> Intake / Output Chart</h3>
                            <div className="scroll-list">
                                <table className="simple-table">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Type</th>
                                            <th>Item</th>
                                            <th>Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {intakeOutput.map(io => (
                                            <tr key={io.id} className={io.type.toLowerCase()}>
                                                <td>{io.time}</td>
                                                <td>{io.type}</td>
                                                <td>{io.item}</td>
                                                <td>{io.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="add-form-row">
                                <select value={newIO.type} onChange={e => setNewIO({ ...newIO, type: e.target.value })}>
                                    <option>Intake</option>
                                    <option>Output</option>
                                </select>
                                <input type="time" value={newIO.time} onChange={e => setNewIO({ ...newIO, time: e.target.value })} />
                                <input placeholder="Item" value={newIO.item} onChange={e => setNewIO({ ...newIO, item: e.target.value })} />
                                <input placeholder="Qty" className="w-50" value={newIO.quantity} onChange={e => setNewIO({ ...newIO, quantity: e.target.value })} />
                                <button className="btn btn-primary btn-sm" onClick={handleAddIO}><Plus size={16} /></button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'surgery' && (
                    <div className="surgery-tab">
                        <div className="card">
                            <h3><Scissors className="icon" /> Operation Theater Schedule</h3>
                            <div className="ot-list">
                                {otSchedules.map(ot => (
                                    <div key={ot.id} className="ot-item">
                                        <div className="ot-header">
                                            <h4>{ot.procedureName}</h4>
                                            <span className={`status ${ot.status.toLowerCase()}`}>{ot.status}</span>
                                        </div>
                                        <div className="ot-details">
                                            <p><strong>Surgeon:</strong> {ot.operatingSurgeon}</p>
                                            <p><strong>Room:</strong> {ot.otRoom}</p>
                                            <p><strong>Date:</strong> {new Date(ot.scheduledDate).toLocaleString()}</p>
                                            <p><strong>Notes:</strong> {ot.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="add-form mt-20">
                                <h4>Schedule New Procedure</h4>
                                <div className="form-row">
                                    <input placeholder="Procedure Name" value={newOT.procedureName} onChange={e => setNewOT({ ...newOT, procedureName: e.target.value })} />
                                    <input placeholder="Surgeon" value={newOT.operatingSurgeon} onChange={e => setNewOT({ ...newOT, operatingSurgeon: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <input placeholder="OT Room" value={newOT.otRoom} onChange={e => setNewOT({ ...newOT, otRoom: e.target.value })} />
                                    <input type="datetime-local" value={newOT.scheduledDate} onChange={e => setNewOT({ ...newOT, scheduledDate: e.target.value })} />
                                </div>
                                <textarea placeholder="Notes" value={newOT.notes} onChange={e => setNewOT({ ...newOT, notes: e.target.value })} />
                                <button className="btn btn-primary mt-10" onClick={handleScheduleOT}>Schedule Procedure</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="actions-tab grid-2">
                        {/* Transfer Patient */}
                        <div className="card">
                            <h3><LogOut className="icon" /> Transfer Patient</h3>
                            <p>Move patient to a different ward or bed.</p>
                            <div className="add-form mt-20">
                                <div className="form-group">
                                    <label>New Ward Type</label>
                                    <select
                                        value={transferData.ward}
                                        onChange={e => setTransferData({ ...transferData, ward: e.target.value })}
                                    >
                                        <option value="">Select Ward</option>
                                        <option value="General Ward">General Ward</option>
                                        <option value="Private Room">Private Room</option>
                                        <option value="Semi-Private">Semi-Private</option>
                                        <option value="ICU">ICU</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>New Bed Number</label>
                                    <input
                                        placeholder="e.g. Bed-102"
                                        value={transferData.bed}
                                        onChange={e => setTransferData({ ...transferData, bed: e.target.value })}
                                    />
                                </div>
                                <button className="btn btn-secondary mt-10" onClick={handleTransfer}>Transfer Patient</button>
                            </div>
                        </div>

                        {/* Discharge Patient */}
                        <div className="card">
                            <h3><LogOut className="icon" /> Discharge Patient</h3>
                            <p>Finalize treatment and generate discharge summary.</p>
                            <div className="add-form mt-20">
                                <textarea
                                    placeholder="Discharge Note / Summary"
                                    rows="4"
                                    value={dischargeNote}
                                    onChange={e => setDischargeNote(e.target.value)}
                                />
                                <button className="btn btn-danger mt-10" onClick={handleDischarge}>Discharge Patient</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IPDDetailView;
