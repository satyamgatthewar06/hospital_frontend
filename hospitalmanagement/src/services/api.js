const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let patients = [];
let doctors = [];
let billings = [];
let appointments = [];

// optional nodemailer (will gracefully no-op if not installed or not configured)
let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // nodemailer not available
}

// Patient Routes
app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.post('/api/patients', (req, res) => {
  const patient = {
    id: patients.length + 1,
    ...req.body
  };
  patients.push(patient);
  res.json(patient);
});

app.delete('/api/patients/:id', (req, res) => {
  patients = patients.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Patient deleted' });
});

// Doctor Routes
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

app.post('/api/doctors', (req, res) => {
  const doctor = {
    id: doctors.length + 1,
    ...req.body
  };
  doctors.push(doctor);
  res.json(doctor);
});

// Billing Routes
app.get('/api/billings', (req, res) => {
  res.json(billings);
});

app.post('/api/billings', (req, res) => {
  const billing = {
    id: billings.length + 1,
    ...req.body
  };
  billings.push(billing);
  res.json(billing);
});

// Appointments Routes
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
  const appointment = { id: appointments.length + 1, ...req.body };
  appointments.push(appointment);

  // Try to send email if email present and nodemailer configured via env
  try {
    const to = req.body.email || req.body.contact;
    const smtpHost = process.env.SMTP_HOST;
    if (nodemailer && to && smtpHost) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || 'no-reply@hospital.local',
        to,
        subject: 'Appointment Confirmation',
        text: `Your appointment is confirmed with ${appointment.doctor} on ${appointment.date} at ${appointment.time}. Reason: ${appointment.reason || 'N/A'}`,
        html: `<p>Your appointment is confirmed with <strong>${appointment.doctor}</strong> on <strong>${appointment.date}</strong> at <strong>${appointment.time}</strong>.</p><p>Reason: ${appointment.reason || 'N/A'}</p>`
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error('Failed to send appointment email', err.message || err);
    // don't fail the request because of email failure
  }

  res.json(appointment);
});

// Payments - supports Stripe Checkout when STRIPE_SECRET is provided, otherwise mock
let stripe = null;
if (process.env.STRIPE_SECRET) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET);
  } catch (e) {
    console.warn('Stripe package not installed or invalid STRIPE_SECRET');
  }
}

app.post('/api/payments', async (req, res) => {
  const { amount, currency = 'inr', description, billId, successUrl, cancelUrl } = req.body || {};
  // minimal validation
  if (!amount) return res.status(400).json({ error: 'Missing amount' });

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price_data: { currency, product_data: { name: description || 'Hospital Payment' }, unit_amount: Math.round(Number(amount) * 100) }, quantity: 1 }],
        mode: 'payment',
        success_url: successUrl || `${req.headers.origin || 'http://localhost:3000'}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.headers.origin || 'http://localhost:3000'}/payments/cancel`
      });
      return res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error('Stripe checkout error', err.message || err);
      return res.status(500).json({ error: 'Stripe error' });
    }
  }

  // Mock fallback: return a URL that simulates success (frontend will handle)
  const mockUrl = `${req.headers.origin || 'http://localhost:3000'}/mock-pay?billId=${encodeURIComponent(billId || '')}&amount=${encodeURIComponent(amount)}`;
  return res.json({ url: mockUrl });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});