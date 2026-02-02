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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});