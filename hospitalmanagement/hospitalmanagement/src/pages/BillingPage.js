import React, { useContext, useState } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import RazorpayPaymentModal from '../components/Billing/RazorpayPaymentModal';
import PaymentHistory from '../components/Billing/PaymentHistory';

const CHARGE_CATEGORIES = {
  consultation: { name: 'Consultation', charges: [
    { id: 'doc-consultation', name: 'Doctor Consultation', price: 500 },
    { id: 'specialist-consultation', name: 'Specialist Consultation', price: 1000 },
  ]},
  diagnostics: { name: 'Diagnostics', charges: [
    { id: 'xray', name: 'X-Ray', price: 800 },
    { id: 'blood-test', name: 'Blood Test', price: 300 },
    { id: 'ct-scan', name: 'CT Scan', price: 5000 },
    { id: 'ultrasound', name: 'Ultrasound', price: 1200 },
    { id: 'ecg', name: 'ECG', price: 400 },
  ]},
  laboratory: { name: 'Laboratory', charges: [
    { id: 'pathology', name: 'Pathology Test', price: 250 },
    { id: 'hemoglobin', name: 'Hemoglobin Test', price: 150 },
    { id: 'thyroid', name: 'Thyroid Profile', price: 800 },
  ]},
  procedures: { name: 'Procedures', charges: [
    { id: 'plastering', name: 'Plastering', price: 1500 },
    { id: 'clw', name: 'Cleaning & Wound Care (CLW)', price: 800 },
    { id: 'suturing', name: 'Suturing', price: 1000 },
    { id: 'foreign-body', name: 'Foreign Body Removal', price: 2000 },
    { id: 'injection', name: 'Injection Administration', price: 200 },
    { id: 'iv-setup', name: 'IV Setup', price: 300 },
  ]},
  daycare: { name: 'Day Care Services', charges: [
    { id: 'daycare-half', name: 'Half Day Care', price: 2500 },
    { id: 'daycare-full', name: 'Full Day Care', price: 4500 },
    { id: 'observation', name: 'Observation Charge', price: 1500 },
  ]},
  ipd: { name: 'IPD (In-Patient)', charges: [
    { id: 'room-general', name: 'General Ward (per day)', price: 3000 },
    { id: 'room-semi', name: 'Semi-Private Room (per day)', price: 6000 },
    { id: 'room-private', name: 'Private Room (per day)', price: 10000 },
    { id: 'icu', name: 'ICU (per day)', price: 15000 },
  ]},
};

const BillingPage = () => {
  const ctx = useContext(HospitalContext) || {};
  const bills = ctx.bills || [];
  const patients = ctx.patients || [];
  const updateBillPayment = ctx.updateBillPayment;

  const [selectedItems, setSelectedItems] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [billType, setBillType] = useState('opd');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`;

  const addItem = (item) => {
    setSelectedItems(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: (p.qty||1) + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id) => setSelectedItems(prev => prev.filter(i => i.id !== id));

  const setQty = (id, qty) => setSelectedItems(prev => prev.map(i => i.id === id ? { ...i, qty: Number(qty)||1 } : i));

  const computeTotal = () => selectedItems.reduce((s, it) => s + ((it.qty||1) * (it.price||0)), 0);

  const generateBill = () => {
    if (!patientName) {
      alert('Please enter or select patient name');
      return;
    }
    if (selectedItems.length === 0) {
      alert('Please add at least one charge');
      return;
    }
    const bill = {
      id: `BILL-${Date.now()}`,
      patientName,
      items: selectedItems,
      totalAmount: computeTotal(),
      date: new Date().toLocaleString(),
      billType: billType,
      paymentMethod: paymentMethod,
      status: 'Pending',
      amountPaid: 0
    };
    if (ctx.addBill) ctx.addBill(bill);
    // reset
    setSelectedItems([]);
    setPatientName('');
    setBillType('opd');
    setPaymentMethod('cash');
    alert('Bill generated');
  };

  const markPaid = (bill) => {
    if (!updateBillPayment) return;
    updateBillPayment(bill.id, { amountPaid: bill.totalAmount ?? bill.amount ?? 0, status: 'Paid' });
  };

  const recordPayment = (bill) => {
    if (!updateBillPayment) return;
    const input = prompt('Enter payment amount', String(bill.amountPaid || ''));
    if (input == null) return;
    const paid = Number(input) || 0;
    const total = bill.totalAmount ?? bill.amount ?? 0;
    const newPaid = (bill.amountPaid || 0) + paid;
    const status = newPaid >= total ? 'Paid' : (newPaid > 0 ? 'Partial' : 'Pending');
    updateBillPayment(bill.id, { amountPaid: newPaid, status });
  };

  const openRazorpayPayment = (bill) => {
    setSelectedBill(bill);
    setShowRazorpayModal(true);
  };

  const handlePaymentSuccess = (payment) => {
    if (selectedBill && updateBillPayment) {
      const total = selectedBill.totalAmount ?? selectedBill.amount ?? 0;
      const outstanding = total - (selectedBill.amountPaid || 0);
      const newPaid = (selectedBill.amountPaid || 0) + outstanding;
      const status = 'Paid';
      
      updateBillPayment(selectedBill.id, { 
        amountPaid: newPaid, 
        status,
        paymentMethod: 'razorpay',
        razorpayPaymentId: payment.id,
        razorpayOrderId: payment.orderId
      });
      
      // Close modal after success
      setTimeout(() => {
        setShowRazorpayModal(false);
        setSelectedBill(null);
      }, 2000);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '1.5rem', color: '#1f2937' }}>Billing Management</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Create Bill Form */}
        <div style={{ padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1f2937' }}>Create Bill</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Patient</label>
            {patients.length > 0 ? (
              <select value={patientName} onChange={e => setPatientName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p.id} value={p.name || p.fullName || p.patientName}>{p.name || p.fullName || p.patientName}</option>)}
              </select>
            ) : (
              <input placeholder="Patient name" value={patientName} onChange={e => setPatientName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', boxSizing: 'border-box' }} />
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Bill Type</label>
            <select value={billType} onChange={e => setBillType(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <option value="opd">OPD</option>
              <option value="ipd">IPD</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <option value="cash">💵 Cash</option>
              <option value="credit-card">💳 Credit Card</option>
              <option value="debit-card">💳 Debit Card</option>
              <option value="upi">📱 UPI</option>
              <option value="razorpay">🔐 Razorpay</option>
            </select>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            {Object.keys(CHARGE_CATEGORIES).map(catKey => (
              <div key={catKey} style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {CHARGE_CATEGORIES[catKey].name}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {CHARGE_CATEGORIES[catKey].charges.map(ch => (
                    <button key={ch.id} type="button" 
                      onClick={() => addItem(ch)}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '0.5rem',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}>
                      <span>{ch.name}</span>
                      <span style={{ fontWeight: '600', color: '#2563eb', marginLeft: '0.5rem' }}>₹{ch.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div style={{ padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1f2937' }}>Summary</h2>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {selectedItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontStyle: 'italic' }}>No charges added</div>
            ) : (
              selectedItems.map(it => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ fontWeight: '500', color: '#374151' }}>{it.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>₹{it.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <input type="number" min="1" value={it.qty || 1} onChange={e => setQty(it.id, e.target.value)}
                      style={{ width: '45px', padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '3px', textAlign: 'center', fontSize: '0.85rem' }} />
                    <div style={{ fontWeight: '600', color: '#1f2937', minWidth: '60px', textAlign: 'right' }}>
                      ₹{((it.qty||1) * (it.price||0)).toFixed(2)}
                    </div>
                    <button onClick={() => removeItem(it.id)}
                      style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              <span>Total:</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>₹{computeTotal().toFixed(2)}</span>
            </div>
            <button onClick={generateBill}
              style={{ width: '100%', padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
              Generate Bill
            </button>
          </div>
        </div>
      </div>

      {/* Bills History Table */}
      <div style={{ overflowX: 'auto', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937', marginBottom: '1rem' }}>Bills History</h2>
        
        {bills.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>No bills created yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead style={{ background: '#f3f4f6', fontWeight: '600' }}>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Patient</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Payment</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Method</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#2563eb' }}>Amount</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id} style={{ transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>{bill.patientName || '--'}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: (bill.status || '').toLowerCase() === 'paid' ? '#dcfce7' : '#fef3c7',
                      color: (bill.status || '').toLowerCase() === 'paid' ? '#15803d' : '#92400e'
                    }}>
                      {bill.status || (bill.amountPaid ? 'Partial' : 'Pending')}
                    </span>
                    {(bill.amountPaid||0) > 0 && <div style={{ fontSize: '12px', color: '#6b7280' }}>Paid: ₹{(bill.amountPaid||0).toFixed(2)}</div>}
                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button onClick={() => recordPayment(bill)}
                        style={{ padding: '0.5rem 0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Record Payment
                      </button>
                      <button onClick={() => markPaid(bill)}
                        style={{ padding: '0.5rem 0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Mark Paid
                      </button>
                      <button onClick={() => openRazorpayPayment(bill)}
                        style={{ padding: '0.5rem 0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                        💳 Pay with Razorpay
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: ((bill.billType||bill.type)||'').toLowerCase() === 'ipd' ? '#dcfce7' : '#dbeafe',
                      color: ((bill.billType||bill.type)||'').toLowerCase() === 'ipd' ? '#15803d' : '#1e40af'
                    }}>
                      {((bill.billType||bill.type)||'').toUpperCase() || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: '#f3e8ff',
                      color: '#6d28d9'
                    }}>
                      {(() => {
                        const m = (bill.paymentMethod || 'cash').toLowerCase();
                        const map = { 'cash': '💵 Cash', 'credit-card': '💳 Credit', 'debit-card': '💳 Debit', 'upi': '📱 UPI' };
                        return map[m] || m;
                      })()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{bill.date || bill.createdAt || '--'}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#2563eb' }}>
                    {formatCurrency(bill.totalAmount ?? bill.amount ?? 0)}
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    <button onClick={() => {alert('Print functionality would open receipt PDF');}}
                      style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Print Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Razorpay Payment Modal */}
      {showRazorpayModal && selectedBill && (
        <RazorpayPaymentModal 
          bill={selectedBill}
          onClose={() => {
            setShowRazorpayModal(false);
            setSelectedBill(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payment History and Analytics */}
      <div style={{ marginTop: '2rem' }}>
        <PaymentHistory />
      </div>
    </div>
  );
};

export default BillingPage;