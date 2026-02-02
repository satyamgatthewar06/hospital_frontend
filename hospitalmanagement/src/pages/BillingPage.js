import React, { useContext, useState } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/BillingPage.css';

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

  const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`;

  const generateBillHTML = (bill) => {
    const items = bill.items || [];
    const itemsRows = items.length
      ? items.map(it => `<tr>
          <td style="padding:6px;border:1px solid #ddd;">${it.name}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center;">${it.qty ?? 1}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:right;">${formatCurrency(it.price)}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:right;">${formatCurrency((it.qty ?? 1) * (it.price ?? 0))}</td>
        </tr>`).join('')
      : `<tr><td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:center;">No itemized charges</td></tr>`;

    const total = bill.totalAmount ?? bill.amount ?? (items.reduce((s, it)=> s + ((it.qty ??1)*(it.price??0)), 0));

    return `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt - ${bill.patientName || 'Bill'}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color:#111; margin:20px; }
          .header { text-align:center; margin-bottom:12px; }
          .hospital { font-size:20px; font-weight:700; }
          .sub { font-size:12px; color:#555; margin-top:6px; }
          table { width:100%; border-collapse:collapse; margin-top:12px; }
          th, td { border:1px solid #ddd; padding:8px; }
          th { background:#f3f4f6; text-align:left; }
          .totals { margin-top:12px; width:100%; display:flex; justify-content:flex-end; }
          .totals .amount { font-weight:700; font-size:18px; padding:8px 12px; background:#f9fafb; border-radius:6px; }
          .meta { margin-top:8px; font-size:13px; color:#333; }
          @media print {
            .no-print { display:none !important; }
            body { margin:0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital">Gadewar's Accident &amp; Maternity Hospital</div>
          <div class="sub">Near Ashwini Hospital, Wadiya Factory, Shivaji Nagar, Nanded, Maharashtra, 431602 | Tel: 02462247499</div>
          <div class="sub" style="margin-top:8px;">Receipt / Invoice</div>
        </div>

        <div class="meta">
          <div><strong>Patient:</strong> ${bill.patientName || '—'}</div>
          <div><strong>Bill Type:</strong> ${(bill.billType || bill.type || '').toUpperCase() || '—'}</div>
          <div><strong>Date:</strong> ${bill.date || bill.createdAt || new Date().toLocaleString()}</div>
          <div><strong>Bill ID:</strong> ${bill.id || ''}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:55%;">Description</th>
              <th style="width:15%;text-align:center;">Qty</th>
              <th style="width:15%;text-align:right;">Unit</th>
              <th style="width:15%;text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals">
          <div class="amount">Total: ${formatCurrency(total)}</div>
        </div>

        <div style="margin-top:18px;font-size:12px;color:#666;">
          <div>Director: Dr. P V Gadewar | Co-Director: Dr. P P Gadewar</div>
          <div style="margin-top:6px;">This is a computer generated receipt and does not require a signature.</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 250);
          };
        </script>
      </body>
      </html>
    `;
  };

  const printBill = (bill) => {
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      alert('Please allow popups to print the receipt.');
      return;
    }
    w.document.open();
    w.document.write(generateBillHTML(bill));
    w.document.close();
  };

  const printAll = () => {
    const consolidatedHTML = `
      <!doctype html>
      <html><head><meta charset="utf-8"><title>All Bills</title></head><body>
      ${bills.map(b => `<div style="page-break-after:always;">${generateBillHTML(b)}</div>`).join('')}
      </body></html>`;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) { alert('Please allow popups to print the receipts.'); return; }
    w.document.open();
    w.document.write(consolidatedHTML);
    w.document.close();
    // print will be triggered by individual bill HTML; for consolidated we call print once
    w.onload = () => setTimeout(()=> w.print(), 300);
  };

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
      status: 'Pending',
      amountPaid: 0
    };
    if (ctx.addBill) ctx.addBill(bill);
    // reset
    setSelectedItems([]);
    setPatientName('');
    setBillType('opd');
    alert('Bill generated');
  };

  const markPaid = (bill) => {
    if (!updateBillPayment) return;
    updateBillPayment(bill.id, { amountPaid: bill.totalAmount ?? bill.amount ?? 0, status: 'Paid' });
  };

  const payOnline = async (bill) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: bill.totalAmount ?? bill.amount ?? 0, description: `Payment for ${bill.patientName}`, billId: bill.id })
      });
      const data = await res.json();
      if (data && data.url) {
        window.open(data.url, '_blank', 'noopener');
      } else {
        // fallback: mark paid locally
        updateBillPayment(bill.id, { amountPaid: bill.totalAmount ?? bill.amount ?? 0, status: 'Paid' });
        alert('Payment recorded (mock)');
      }
    } catch (err) {
      console.error('Payment initiation failed', err);
      alert('Payment failed to start.');
    }
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

  return (
    <div className="billing-page">
      {/* ...existing header and bill list ... */}
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <button className="btn-generate no-print" onClick={printAll}>Print All Bills</button>
      </div>

      <div className="billing-container">
        <div className="bill-form">
          <h2>Create Bill</h2>
          <div className="form-group">
            <label>Patient</label>
            {patients.length > 0 ? (
              <select value={patientName} onChange={e => setPatientName(e.target.value)}>
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p.id} value={p.name || p.fullName || p.patientName}>{p.name || p.fullName || p.patientName}</option>)}
              </select>
            ) : (
              <input placeholder="Patient name" value={patientName} onChange={e => setPatientName(e.target.value)} />
            )}
          </div>

          <div className="form-group">
            <label>Bill Type</label>
            <select value={billType} onChange={e => setBillType(e.target.value)}>
              <option value="opd">OPD</option>
              <option value="ipd">IPD</option>
            </select>
          </div>

          <div className="charges-section">
            {Object.keys(CHARGE_CATEGORIES).map(catKey => (
              <div key={catKey} className="charge-category">
                <h4>{CHARGE_CATEGORIES[catKey].name}</h4>
                <div className="charge-buttons">
                  {CHARGE_CATEGORIES[catKey].charges.map(ch => (
                    <button key={ch.id} type="button" className="charge-btn" onClick={() => addItem(ch)}>
                      <span>{ch.name}</span>
                      <span className="price">₹{ch.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="bill-summary">
          <h2>Summary</h2>
          <div className="charges-list">
            {selectedItems.length === 0 && <div className="empty-state">No charges added</div>}
            {selectedItems.map(it => (
              <div className="charge-item" key={it.id}>
                <div className="charge-info">
                  <div className="charge-name">{it.name}</div>
                  <div className="charge-price">₹{it.price}</div>
                </div>
                <div className="charge-controls">
                  <input className="qty-input" type="number" min="1" value={it.qty || 1} onChange={e => setQty(it.id, e.target.value)} />
                  <div className="subtotal">₹{((it.qty||1) * (it.price||0)).toFixed(2)}</div>
                  <button className="btn-remove" onClick={() => removeItem(it.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bill-totals">
            <div className="total-row">Total: <span className="total-amount">₹{computeTotal().toFixed(2)}</span></div>
            <button className="btn-generate" onClick={generateBill}>Generate Bill</button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Payment</th>
              <th>Type</th>
              <th>Date</th>
              <th className="amount">Amount</th>
              <th className="no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id}>
                <td>{bill.patientName || '--'}</td>
                <td>
                  <span className={`status ${((bill.status||'pending').toLowerCase())}`}>
                    {bill.status || (bill.amountPaid ? 'Partial' : 'Pending')}
                  </span>
                  <div style={{fontSize:12,color:'#6b7280'}}>{(bill.amountPaid||0) > 0 ? `Paid: ₹${(bill.amountPaid||0).toFixed(2)}` : ''}</div>
                  <div className="no-print" style={{marginTop:6,display:'flex',gap:6}}>
                    <button className="btn" onClick={() => recordPayment(bill)}>Record Payment</button>
                    <button className="btn" onClick={() => markPaid(bill)}>Mark Paid</button>
                  </div>
                </td>
                <td>
                  <span className={`badge ${((bill.billType||bill.type)||'').toLowerCase()}`}>
                    {((bill.billType||bill.type)||'').toUpperCase() || '—'}
                  </span>
                </td>
                <td>{bill.date || bill.createdAt || '--'}</td>
                <td className="amount">{formatCurrency(bill.totalAmount ?? bill.amount ?? 0)}</td>
                <td className="no-print">
                  <button className="btn" onClick={() => printBill(bill)}>Print Receipt</button>
                  <button className="btn" onClick={() => payOnline(bill)}>Pay Online</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingPage;