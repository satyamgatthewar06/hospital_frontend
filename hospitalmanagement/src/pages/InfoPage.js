import React from 'react';
import '../styles/InfoPage.css';

function InfoPage() {
  const steps = [
    {
      id: 1,
      title: '📋 Patient Registration',
      description: 'Register new patients in the system',
      details: [
        'Click on "Patients" in navigation',
        'Fill in patient details (Name, Age, Contact)',
        'Select patient type (OPD/IPD)',
        'Click "Add Patient" to register'
      ],
      color: '#667eea'
    },
    {
      id: 2,
      title: '👨‍⚕️ Doctor Management',
      description: 'Manage doctor profiles and specialties',
      details: [
        'Go to "Doctors" section',
        'View all registered doctors',
        'Check specialty and experience',
        'Contact doctors for appointments'
      ],
      color: '#764ba2'
    },
    {
      id: 3,
      title: '👔 Staff Management',
      description: 'Manage hospital staff members',
      details: [
        'Navigate to "Staff" page',
        'View all staff members',
        'Check roles and departments',
        'Monitor staff assignments'
      ],
      color: '#f59e0b'
    },
    {
      id: 4,
      title: '💳 Billing Management',
      description: 'Handle patient billing and payments',
      details: [
        'Go to "Billing" section',
        'View all billing records',
        'Check payment status',
        'Generate invoices'
      ],
      color: '#10b981'
    },
    {
      id: 5,
      title: '💰 Accountant Dashboard',
      description: 'Track all payments and revenue',
      details: [
        'Access "Accountant" page',
        'Add payment records',
        'Track Cash & UPI payments',
        'View payment summaries'
      ],
      color: '#3b82f6'
    },
    {
      id: 6,
      title: '📊 Dashboard Overview',
      description: 'Get complete hospital statistics',
      details: [
        'View total patients',
        'Check doctor count',
        'Monitor staff members',
        'See billing overview'
      ],
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📚 How to Use Hospital Management System</h2>

      <div className="info-intro">
        <p className="intro-text">
          Welcome to <strong>Gadewar's Accident and Maternity Hospital</strong> Management System. 
          Follow these steps to navigate and use the application effectively.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step-card" style={{ borderLeftColor: step.color }}>
            <div className="step-header" style={{ backgroundColor: step.color }}>
              <span className="step-number">{step.id}</span>
              <h3 className="step-title">{step.title}</h3>
            </div>
            
            <div className="step-content">
              <p className="step-description">{step.description}</p>
              
              <div className="step-details">
                <h4>Steps:</h4>
                <ul>
                  {step.details.map((detail, index) => (
                    <li key={index}>
                      <span className="detail-number">{index + 1}</span>
                      <span className="detail-text">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-tips">
        <h3 className="tips-title">💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">🔐</span>
            <h4>Security</h4>
            <p>Always keep patient data confidential and secure</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📱</span>
            <h4>Mobile Friendly</h4>
            <p>Access the system on any device - Desktop, Tablet, or Mobile</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⚡</span>
            <h4>Real-time Updates</h4>
            <p>All data updates instantly across the system</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Easy Navigation</h4>
            <p>Simple menu structure for quick access to all modules</p>
          </div>
        </div>
      </div>

      <div className="contact-info">
        <h3 className="info-title">📞 Contact Information</h3>
        <div className="contact-details">
          <div className="contact-item">
            <span className="contact-icon">🏥</span>
            <div>
              <h4>Hospital Name</h4>
              <p>Gadewar's Accident and Maternity Hospital</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div>
              <h4>Address</h4>
              <p>123 Medical Street, Health City</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <h4>Phone</h4>
              <p>+91 1234567890</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>info@gadewarshospital.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h3 className="faq-title">❓ Frequently Asked Questions</h3>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I register a new patient?</h4>
            <p>Go to the "Patients" section and fill in the required details. Click "Add Patient" to complete registration.</p>
          </div>
          <div className="faq-item">
            <h4>How can I track payments?</h4>
            <p>Use the "Accountant" section to track all cash and UPI payments with detailed summaries.</p>
          </div>
          <div className="faq-item">
            <h4>Where can I view billing records?</h4>
            <p>All billing records are available in the "Billing" section with payment status.</p>
          </div>
          <div className="faq-item">
            <h4>How do I access doctor information?</h4>
            <p>Click on "Doctors" to view all registered doctors with their specialties and experience.</p>
          </div>
          <div className="faq-item">
            <h4>Can I manage staff details?</h4>
            <p>Yes, the "Staff" section allows you to view and manage all hospital staff members.</p>
          </div>
          <div className="faq-item">
            <h4>Is the system mobile-friendly?</h4>
            <p>Yes, the system is fully responsive and works on all devices including mobile phones.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;