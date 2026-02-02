// Razorpay Payment Service
class RazorpayPaymentService {
  constructor() {
    // These should be stored in environment variables in production
    this.keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'; // Test key
    this.apiBaseUrl = 'https://api.razorpay.com/v1';
  }

  /**
   * Initialize Razorpay script
   */
  loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Create Razorpay order on backend
   */
  async createOrder(amount, billId, patientName) {
    try {
      // In a real application, this would call your backend API
      // For now, we'll create a mock order structure
      const order = {
        id: `order_${Date.now()}`,
        entity: 'order',
        amount: Math.round(amount * 100), // Convert to paise
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency: 'INR',
        receipt: billId,
        status: 'created',
        attempts: 0,
        notes: {
          billId: billId,
          patientName: patientName,
        },
        created_at: Math.floor(Date.now() / 1000),
      };

      // Store order in localStorage for demo
      const orders = JSON.parse(localStorage.getItem('razorpay_orders') || '[]');
      orders.push(order);
      localStorage.setItem('razorpay_orders', JSON.stringify(orders));

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay payment modal
   */
  async openPaymentModal(order, billId, patientName, onSuccess, onError) {
    const isLoaded = await this.loadRazorpayScript();

    if (!isLoaded) {
      onError('Failed to load Razorpay. Please check your internet connection.');
      return;
    }

    const options = {
      key: this.keyId,
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: 'Hospital Management System',
      description: `Payment for Bill ${billId}`,
      order_id: order.id,
      customer_notif: 1,
      notes: {
        billId: billId,
        patientName: patientName,
      },
      handler: (response) => {
        this.verifyPayment(response, order.id, billId, onSuccess, onError);
      },
      modal: {
        ondismiss: () => {
          onError('Payment cancelled by user');
        },
      },
      theme: {
        color: '#2563eb',
      },
      prefill: {
        name: patientName || 'Patient',
        contact: '',
        email: '',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  /**
   * Verify payment (mock implementation)
   */
  verifyPayment(response, orderId, billId, onSuccess, onError) {
    try {
      // Store payment details
      const payment = {
        id: response.razorpay_payment_id,
        orderId: orderId,
        signature: response.razorpay_signature,
        billId: billId,
        timestamp: new Date().toISOString(),
        status: 'success',
        amount: 0, // Will be updated with actual amount
      };

      // Store payment in localStorage
      const payments = JSON.parse(localStorage.getItem('razorpay_payments') || '[]');
      payments.push(payment);
      localStorage.setItem('razorpay_payments', JSON.stringify(payments));

      // Update order status
      const orders = JSON.parse(localStorage.getItem('razorpay_orders') || '[]');
      const updatedOrders = orders.map(o => 
        o.id === orderId 
          ? { ...o, status: 'paid', amount_paid: o.amount, amount_due: 0 }
          : o
      );
      localStorage.setItem('razorpay_orders', JSON.stringify(updatedOrders));

      onSuccess(payment);
    } catch (error) {
      onError('Payment verification failed: ' + error.message);
    }
  }

  /**
   * Get payment history
   */
  getPaymentHistory() {
    try {
      return JSON.parse(localStorage.getItem('razorpay_payments') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Get order details
   */
  getOrderDetails(orderId) {
    try {
      const orders = JSON.parse(localStorage.getItem('razorpay_orders') || '[]');
      return orders.find(o => o.id === orderId);
    } catch {
      return null;
    }
  }

  /**
   * Check payment status
   */
  checkPaymentStatus(billId) {
    try {
      const payments = JSON.parse(localStorage.getItem('razorpay_payments') || '[]');
      return payments.find(p => p.billId === billId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Generate payment receipt
   */
  generateReceiptData(payment, bill) {
    return {
      receiptNumber: `RCP-${Date.now()}`,
      paymentId: payment.id,
      billId: payment.billId,
      amount: bill.totalAmount,
      currency: 'INR',
      status: 'Success',
      timestamp: payment.timestamp,
      patientName: bill.patientName,
      billType: bill.billType,
    };
  }
}

export default new RazorpayPaymentService();
