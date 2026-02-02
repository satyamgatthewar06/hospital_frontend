import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ExportService } from '../services/exportService';
import { RazorpayService } from '../services/razorpayService';
import { NotificationService } from '../services/notificationService';
import '../styles/BillingActions.css';

const BillingActions = ({ bill, bills, allData }) => {
  const { theme } = useContext(ThemeContext);

  // Normalize bill data to handle different property names
  const normalizeBill = (billData) => {
    if (!billData) return null;
    return {
      billId: billData.billId || billData.id,
      patientName: billData.patientName,
      patientId: billData.patientId,
      totalAmount: billData.totalAmount || billData.amount,
      finalAmount: billData.finalAmount || billData.totalAmount || billData.amount,
      billDate: billData.billDate || billData.date,
      email: billData.email,
      phone: billData.phone,
      ...billData
    };
  };

  const handleDownloadPDF = async () => {
    try {
      if (!bill) {
        alert('Please select a bill first');
        return;
      }
      const normalizedBill = normalizeBill(bill);
      await ExportService.downloadBillPDF(normalizedBill);
      alert('Bill PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Error downloading PDF: ' + error.message);
    }
  };

  const handleProcessPayment = async () => {
    try {
      if (!bill) {
        alert('Please select a bill first');
        return;
      }
      const normalizedBill = normalizeBill(bill);
      const paymentResult = await RazorpayService.initiatePayment({
        amount: normalizedBill.finalAmount,
        billId: normalizedBill.billId,
        patientName: normalizedBill.patientName,
        patientId: normalizedBill.patientId,
        email: normalizedBill.email || 'patient@hospital.com',
        phone: normalizedBill.phone || '9999999999',
        description: `Payment for Bill ${normalizedBill.billId}`
      });

      // Verify payment
      const verifyResult = await RazorpayService.verifyPayment(paymentResult);
      
      if (verifyResult.success) {
        // Update bill status
        bill.paymentStatus = 'Paid';
        bill.paymentMethod = 'Razorpay';
        
        // Send notification
        try {
          await NotificationService.sendPaymentSMS(normalizedBill.phone, normalizedBill.billId, normalizedBill.finalAmount);
          await NotificationService.sendPaymentReceipt(normalizedBill.email, normalizedBill);
        } catch (e) {
          console.log('Notification failed:', e);
        }
        
        alert('Payment successful! Receipt has been sent.');
      }
    } catch (error) {
      alert('Payment failed: ' + error.message);
    }
  };

  const handleExportBills = () => {
    try {
      ExportService.exportBills(bills);
      alert('Bills exported as CSV successfully!');
    } catch (error) {
      alert('Error exporting bills: ' + error.message);
    }
  };

  const handleBackupData = () => {
    try {
      ExportService.backupData(allData, 'hospital_data_backup');
      alert('Data backup created successfully!');
    } catch (error) {
      alert('Error backing up data: ' + error.message);
    }
  };

  const handleSendPaymentReminder = async () => {
    try {
      if (!bill) {
        alert('Please select a bill first');
        return;
      }
      const normalizedBill = normalizeBill(bill);
      await NotificationService.sendPaymentSMS(
        normalizedBill.phone, 
        normalizedBill.billId, 
        normalizedBill.finalAmount
      );
      alert('Payment reminder sent via SMS!');
    } catch (error) {
      alert('Error sending reminder: ' + error.message);
    }
  };

  return (
    <div className="billing-actions" style={{ backgroundColor: theme.colors.surface, color: theme.colors.text }}>
      <div className="action-group">
        <h4>Bill Actions</h4>
        <button className="btn btn-primary" onClick={handleDownloadPDF} title="Download bill as PDF">
          📄 Download PDF
        </button>
        <button className="btn btn-success" onClick={handleProcessPayment} title="Process payment via Razorpay">
          💳 Pay Now (Razorpay)
        </button>
        <button className="btn btn-info" onClick={handleSendPaymentReminder} title="Send payment reminder via SMS">
          📱 Send Reminder
        </button>
      </div>

      <div className="action-group">
        <h4>Data Management</h4>
        <button className="btn btn-secondary" onClick={handleExportBills} title="Export all bills as CSV">
          📊 Export Bills (CSV)
        </button>
        <button className="btn btn-warning" onClick={handleBackupData} title="Backup all hospital data">
          💾 Backup Data
        </button>
      </div>
    </div>
  );
};

export default BillingActions;
