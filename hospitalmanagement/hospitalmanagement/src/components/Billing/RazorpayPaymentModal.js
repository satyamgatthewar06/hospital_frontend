import React, { useState, useEffect } from 'react';
import razorpayService from '../../services/razorpayService';
import '../styles/RazorpayPayment.css';

const RazorpayPaymentModal = ({ bill, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Check if payment already exists for this bill
    const existingPayment = razorpayService.checkPaymentStatus(bill.id);
    if (existingPayment) {
      setPaymentDetails(existingPayment);
    }
  }, [bill.id]);

  const handlePaymentClick = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Create order
      const order = await razorpayService.createOrder(
        bill.totalAmount,
        bill.id,
        bill.patientName
      );

      // Open payment modal
      razorpayService.openPaymentModal(
        order,
        bill.id,
        bill.patientName,
        (payment) => {
          setPaymentDetails(payment);
          setIsProcessing(false);
          
          // Show success message
          setTimeout(() => {
            if (onPaymentSuccess) {
              onPaymentSuccess(payment);
            }
          }, 1500);
        },
        (errorMsg) => {
          setError(errorMsg);
          setIsProcessing(false);
        }
      );
    } catch (err) {
      setError('Failed to initiate payment: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!paymentDetails) return;
    
    const receiptData = razorpayService.generateReceiptData(paymentDetails, bill);
    const receiptText = `
===========================================
        PAYMENT RECEIPT
===========================================
Receipt Number: ${receiptData.receiptNumber}
Bill ID: ${receiptData.billId}
Payment ID: ${receiptData.paymentId}
Patient Name: ${receiptData.patientName}
Bill Type: ${receiptData.billType}
Amount: ₹${receiptData.amount.toFixed(2)}
Currency: ${receiptData.currency}
Status: ${receiptData.status}
Date & Time: ${new Date(receiptData.timestamp).toLocaleString()}
===========================================
Thank you for your payment!
===========================================
    `;

    // Download as text file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptText));
    element.setAttribute('download', `receipt-${receiptData.receiptNumber}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!bill) return null;

  return (
    <div className="razorpay-modal-overlay">
      <div className="razorpay-modal">
        <div className="razorpay-modal-header">
          <h2>💳 Payment Gateway</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="razorpay-modal-body">
          {/* Bill Summary */}
          <div className="bill-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Bill ID:</span>
              <strong>{bill.id}</strong>
            </div>
            <div className="summary-row">
              <span>Patient Name:</span>
              <strong>{bill.patientName}</strong>
            </div>
            <div className="summary-row">
              <span>Bill Type:</span>
              <strong>{bill.billType?.toUpperCase() || 'OPD'}</strong>
            </div>
            <div className="summary-row">
              <span>Original Amount:</span>
              <strong>₹{bill.totalAmount?.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Already Paid:</span>
              <strong>₹{(bill.amountPaid || 0).toFixed(2)}</strong>
            </div>
            <div className="summary-row divider">
              <span>Outstanding Amount:</span>
              <strong className="amount-due">₹{((bill.totalAmount || 0) - (bill.amountPaid || 0)).toFixed(2)}</strong>
            </div>
          </div>

          {/* Payment Status */}
          {paymentDetails && (
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h4>Payment Successful!</h4>
              <p>Your payment has been processed successfully.</p>
              <div className="payment-info">
                <div className="info-row">
                  <span>Payment ID:</span>
                  <code>{paymentDetails.id}</code>
                </div>
                <div className="info-row">
                  <span>Status:</span>
                  <strong className="status-badge success">Success</strong>
                </div>
                <div className="info-row">
                  <span>Date & Time:</span>
                  <span>{new Date(paymentDetails.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <button className="receipt-btn" onClick={handleDownloadReceipt}>
                📄 Download Receipt
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Payment Methods */}
          {!paymentDetails && (
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="methods-list">
                <div className="method-card razorpay">
                  <div className="method-icon">💳</div>
                  <div className="method-content">
                    <h4>Razorpay</h4>
                    <p>Credit Card, Debit Card, UPI, Wallets</p>
                  </div>
                  <button 
                    className="method-btn"
                    onClick={handlePaymentClick}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
              <p className="payment-info-text">
                Secure payment powered by Razorpay. Your payment information is encrypted and secure.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="razorpay-modal-footer">
          {paymentDetails ? (
            <button className="close-modal-btn" onClick={onClose}>Close</button>
          ) : (
            <>
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
              <div className="footer-info">
                Secure payment gateway by Razorpay
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RazorpayPaymentModal;
