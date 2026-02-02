import React, { useState, useContext, useMemo } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/ComprehensiveBilling.css';

const ComprehensiveBilling = () => {
  const ctx = useContext(HospitalContext) || {};
  const bills = ctx.bills || [];
  const patients = ctx.patients || [];
  const addBill = ctx.addBill || (() => {});

  const [activeTab, setActiveTab] = useState('list');
  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    billDate: new Date().toISOString().split('T')[0],
    roomCharges: '',
    procedureCharges: '',
    labCharges: '',
    medicineCharges: '',
    doctorCharges: '',
    otherCharges: '',
    paymentStatus: 'Pending',
    paymentMethod: '',
  });

  const [selectedBill, setSelectedBill] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount =
      (parseInt(form.roomCharges) || 0) +
      (parseInt(form.procedureCharges) || 0) +
      (parseInt(form.labCharges) || 0) +
      (parseInt(form.medicineCharges) || 0) +
      (parseInt(form.doctorCharges) || 0) +
      (parseInt(form.otherCharges) || 0);

    if (form.patientName && totalAmount > 0) {
      addBill({
        id: Date.now(),
        billId: `BILL-${Date.now()}`,
        ...form,
        totalAmount,
        discountAmount: 0,
        finalAmount: totalAmount,
      });
      setForm({
        patientName: '',
        patientId: '',
        billDate: new Date().toISOString().split('T')[0],
        roomCharges: '',
        procedureCharges: '',
        labCharges: '',
        medicineCharges: '',
        doctorCharges: '',
        otherCharges: '',
        paymentStatus: 'Pending',
        paymentMethod: '',
      });
      setActiveTab('list');
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter(b => !filterStatus || b.paymentStatus === filterStatus);
  }, [bills, filterStatus]);

  const billStats = useMemo(() => {
    return {
      totalBills: bills.length,
      pendingBills: bills.filter(b => b.paymentStatus === 'Pending').length,
      paidBills: bills.filter(b => b.paymentStatus === 'Paid').length,
      totalRevenue: bills.reduce((sum, b) => sum + (parseInt(b.finalAmount) || 0), 0),
      pendingAmount: bills
        .filter(b => b.paymentStatus === 'Pending')
        .reduce((sum, b) => sum + (parseInt(b.finalAmount) || 0), 0),
    };
  }, [bills]);

  const generateInvoice = (bill) => {
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice ${bill.billId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; }
            .details { display: flex; justify-content: space-between; margin: 20px 0; }
            .charges { margin: 20px 0; }
            .charge-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total { border-top: 2px solid #333; font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>Hospital Invoice</h1>
              <p>Bill ID: ${bill.billId}</p>
            </div>
            <div class="details">
              <div>
                <p><strong>Patient:</strong> ${bill.patientName}</p>
                <p><strong>Date:</strong> ${bill.billDate}</p>
              </div>
            </div>
            <div class="charges">
              ${bill.roomCharges ? `<div class="charge-row"><span>Room Charges</span><span>₹${bill.roomCharges}</span></div>` : ''}
              ${bill.doctorCharges ? `<div class="charge-row"><span>Doctor Charges</span><span>₹${bill.doctorCharges}</span></div>` : ''}
              ${bill.procedureCharges ? `<div class="charge-row"><span>Procedure Charges</span><span>₹${bill.procedureCharges}</span></div>` : ''}
              ${bill.labCharges ? `<div class="charge-row"><span>Lab Charges</span><span>₹${bill.labCharges}</span></div>` : ''}
              ${bill.medicineCharges ? `<div class="charge-row"><span>Medicine Charges</span><span>₹${bill.medicineCharges}</span></div>` : ''}
              ${bill.otherCharges ? `<div class="charge-row"><span>Other Charges</span><span>₹${bill.otherCharges}</span></div>` : ''}
              <div class="charge-row total">
                <span>Total Amount</span>
                <span>₹${bill.finalAmount}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="comprehensive-billing fade-in">
      <h1>Comprehensive Billing & Payment System</h1>

      {/* Statistics */}
      <div className="billing-stats card">
        <h2>Billing Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Bills</span>
            <span className="stat-value">{billStats.totalBills}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Bills</span>
            <span className="stat-value">{billStats.pendingBills}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{billStats.totalRevenue}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Amount</span>
            <span className="stat-value">₹{billStats.pendingAmount}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-navigation card">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Bills List
        </button>
        <button 
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('form');
            setForm({
              patientName: '',
              patientId: '',
              billDate: new Date().toISOString().split('T')[0],
              roomCharges: '',
              procedureCharges: '',
              labCharges: '',
              medicineCharges: '',
              doctorCharges: '',
              otherCharges: '',
              paymentStatus: 'Pending',
              paymentMethod: '',
            });
          }}
        >
          Generate Bill
        </button>
      </div>

      {/* Generate Bill Form */}
      {activeTab === 'form' && (
        <div className="form-section card">
          <h2>Generate New Bill</h2>
          <form onSubmit={handleSubmit} className="billing-form">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleInputChange}
                  placeholder="Select patient"
                  list="patientList"
                  required
                />
                <datalist id="patientList">
                  {patients.map(p => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>Bill Date</label>
                <input
                  type="date"
                  name="billDate"
                  value={form.billDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h3>Charges Breakdown</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Room Charges (₹)</label>
                <input
                  type="number"
                  name="roomCharges"
                  value={form.roomCharges}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Doctor Charges (₹)</label>
                <input
                  type="number"
                  name="doctorCharges"
                  value={form.doctorCharges}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Procedure Charges (₹)</label>
                <input
                  type="number"
                  name="procedureCharges"
                  value={form.procedureCharges}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Lab Test Charges (₹)</label>
                <input
                  type="number"
                  name="labCharges"
                  value={form.labCharges}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Medicine Charges (₹)</label>
                <input
                  type="number"
                  name="medicineCharges"
                  value={form.medicineCharges}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Other Charges (₹)</label>
                <input
                  type="number"
                  name="otherCharges"
                  value={form.otherCharges}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Status</label>
                <select name="paymentStatus" value={form.paymentStatus} onChange={handleInputChange}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial Payment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleInputChange}>
                  <option value="">-- Select Method --</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online Transfer</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Generate Bill</button>
          </form>
        </div>
      )}

      {/* Bills List */}
      {activeTab === 'list' && (
        <div className="list-section card">
          <div className="list-header">
            <h2>All Bills ({filteredBills.length})</h2>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial Payment</option>
            </select>
          </div>

          <div className="bills-grid">
            {filteredBills.length > 0 ? (
              filteredBills.map((bill, idx) => (
                <div key={bill.id} className="bill-card" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="bill-header">
                    <h4>{bill.billId}</h4>
                    <span className={`status ${bill.paymentStatus?.toLowerCase().replace(' ', '-')}`}>{bill.paymentStatus}</span>
                  </div>

                  <div className="bill-details">
                    <p><strong>Patient:</strong> {bill.patientName}</p>
                    <p><strong>Date:</strong> {bill.billDate}</p>
                    <p className="amount"><strong>Total:</strong> ₹{bill.finalAmount}</p>
                  </div>

                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => setSelectedBill(selectedBill?.id === bill.id ? null : bill)}
                  >
                    {selectedBill?.id === bill.id ? 'Hide' : 'View Details'}
                  </button>

                  {selectedBill?.id === bill.id && (
                    <div className="bill-expanded">
                      <div className="charges-summary">
                        {bill.roomCharges && <p>Room: ₹{bill.roomCharges}</p>}
                        {bill.doctorCharges && <p>Doctor: ₹{bill.doctorCharges}</p>}
                        {bill.procedureCharges && <p>Procedure: ₹{bill.procedureCharges}</p>}
                        {bill.labCharges && <p>Lab: ₹{bill.labCharges}</p>}
                        {bill.medicineCharges && <p>Medicine: ₹{bill.medicineCharges}</p>}
                        {bill.otherCharges && <p>Other: ₹{bill.otherCharges}</p>}
                      </div>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => generateInvoice(bill)}
                      >
                        Print Invoice
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No bills found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveBilling;
