// Razorpay Payment Gateway Integration

export const RazorpayService = {
  // Load Razorpay script
  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  // Initialize payment
  initiatePayment: async (paymentDetails) => {
    const isLoaded = await RazorpayService.loadRazorpayScript();
    
    if (!isLoaded) {
      throw new Error('Razorpay script failed to load');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_key', // Get from env
        amount: paymentDetails.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Hospital Management System',
        description: paymentDetails.description || `Payment for Bill #${paymentDetails.billId}`,
        image: '/logo.png', // Your hospital logo
        order_id: paymentDetails.orderId,
        customer_notif: 1,
        timeout: 600,
        handler: function (response) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            timestamp: new Date().toISOString()
          });
        },
        prefill: {
          name: paymentDetails.patientName || '',
          email: paymentDetails.email || '',
          contact: paymentDetails.phone || ''
        },
        notes: {
          billId: paymentDetails.billId,
          patientId: paymentDetails.patientId
        },
        theme: {
          color: '#2196F3'
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        reject({
          error: response.error.code,
          description: response.error.description
        });
      });

      razorpay.open();
    });
  },

  // Verify payment on backend
  verifyPayment: async (paymentData) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  },

  // Save payment record
  savePaymentRecord: async (paymentRecord) => {
    try {
      const response = await fetch('/api/payments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRecord)
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save payment record:', error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await fetch(`/api/payments/status/${paymentId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId, amount) => {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, amount })
      });
      return await response.json();
    } catch (error) {
      console.error('Refund failed:', error);
      throw error;
    }
  }
};

export default RazorpayService;
