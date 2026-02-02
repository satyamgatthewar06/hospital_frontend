// Notifications Service - SMS & Email
// This would integrate with your backend

export const NotificationService = {
  // Send appointment reminder via SMS
  sendAppointmentSMS: async (phoneNumber, appointmentDetails) => {
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: `Reminder: Your appointment is scheduled for ${appointmentDetails.date} at ${appointmentDetails.time} with Dr. ${appointmentDetails.doctorName}`,
          type: 'appointment_reminder'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  },

  // Send appointment reminder via Email
  sendAppointmentEmail: async (email, appointmentDetails) => {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject: 'Appointment Reminder - Hospital Management System',
          template: 'appointment_reminder',
          data: appointmentDetails
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  // Send payment receipt via Email
  sendPaymentReceipt: async (email, billDetails) => {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject: 'Payment Receipt - Hospital Management System',
          template: 'payment_receipt',
          data: billDetails
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  // Send SMS for payment confirmation
  sendPaymentSMS: async (phoneNumber, billId, amount) => {
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: `Payment of ₹${amount} received for Bill #${billId}. Thank you for using our services!`,
          type: 'payment_confirmation'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  },

  // Send prescription via Email
  sendPrescriptionEmail: async (email, prescriptionData) => {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject: 'Your Prescription - Hospital Management System',
          template: 'prescription',
          data: prescriptionData,
          attachment: prescriptionData.pdfUrl
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
};

export default NotificationService;
