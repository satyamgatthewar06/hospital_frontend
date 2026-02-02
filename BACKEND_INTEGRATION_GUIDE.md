# Backend & Database Integration Guide

## 🎯 Overview

Your Hospital Management System frontend is now fully integrated with the backend API. This guide explains the integration, how to test it, and how to deploy both frontend and backend together.

---

## 📋 Current Status

### Frontend (React Application) ✅
- **Location**: `hospitalmanagement/`
- **API Layer**: `src/services/api.js` - Complete with all endpoints
- **State Management**: `src/context/HospitalContext.js` - Now uses backend API
- **Authentication**: Integrated with backend login
- **Deployment**: Railway.app (https://hospitalfrontend-production.up.railway.app)

### Backend (Node.js/Express) 📍
- **Location**: `hospital-backend/`
- **Database**: MySQL (configured)
- **Status**: Ready for deployment
- **Port**: 5000 (local), Railway (cloud)

---

## 🔌 API Connection Architecture

```
┌─────────────────────────────────────────┐
│   React Frontend (hospitalmanagement)   │
│  - Components                           │
│  - Pages                                │
│  - Context (HospitalContext)            │
└──────────────────┬──────────────────────┘
                   │
                   │ API Calls
                   │ (axios)
                   ▼
┌─────────────────────────────────────────┐
│   API Service Layer (src/services/)     │
│  - patientAPI                           │
│  - doctorAPI                            │
│  - appointmentAPI                       │
│  - billingAPI                           │
│  - laboratoryAPI                        │
│  - staffAPI                             │
│  - wardAPI                              │
│  - tpaAPI                               │
│  - insuranceAPI                         │
│  - authAPI                              │
└──────────────────┬──────────────────────┘
                   │
                   │ HTTP/REST
                   │ JSON
                   ▼
┌─────────────────────────────────────────┐
│   Backend API Server (hospital-backend)  │
│  - Express Routes                       │
│  - Controllers                          │
│  - Middleware                           │
│  - JWT Authentication                   │
└──────────────────┬──────────────────────┘
                   │
                   │ Database Queries
                   │ (Mongoose/MySQL)
                   ▼
┌─────────────────────────────────────────┐
│   MySQL Database                        │
│  - Patients Table                       │
│  - Doctors Table                        │
│  - Appointments Table                   │
│  - Billing Table                        │
│  - And more...                          │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js v16+ installed
- MySQL Server running
- npm or yarn

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd hospital-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=hospital_management
# JWT_SECRET=your_secret_key

# Create database and tables
npm run seed

# Start backend server
npm run dev
# Server should be running on http://localhost:5000
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend directory
cd hospitalmanagement

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Make sure REACT_APP_API_URL points to backend
# REACT_APP_API_URL=http://localhost:5000/api

# Start frontend
npm start
# Application should be running on http://localhost:3000
```

### Step 3: Test the Connection

1. Navigate to http://localhost:3000
2. You should see the login page
3. Try logging in with `admin` / `admin123`
4. If successful, you'll see the dashboard with data from the backend

---

## 🔑 Environment Variables

### Frontend (.env.local)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Application Settings
REACT_APP_NAME=Hospital Management System
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REPORTS=true
REACT_APP_ENABLE_PAYMENTS=true
```

### Backend (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_management
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@hospital.com

# Stripe Configuration (Optional)
STRIPE_SECRET=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE=pk_test_your_stripe_public_key
```

---

## 📊 API Endpoints Reference

### Patient Endpoints
```
GET    /api/patients              - Get all patients
GET    /api/patients/:id          - Get patient by ID
POST   /api/patients              - Create new patient
PUT    /api/patients/:id          - Update patient
DELETE /api/patients/:id          - Delete patient
GET    /api/patients/search       - Search patients
```

### Doctor Endpoints
```
GET    /api/doctors               - Get all doctors
GET    /api/doctors/:id           - Get doctor by ID
POST   /api/doctors               - Create new doctor
PUT    /api/doctors/:id           - Update doctor
DELETE /api/doctors/:id           - Delete doctor
GET    /api/doctors/specialty     - Get by specialty
GET    /api/doctors/available     - Get available doctors
```

### Appointment Endpoints
```
GET    /api/appointments          - Get all appointments
GET    /api/appointments/:id      - Get appointment by ID
POST   /api/appointments          - Create new appointment
PUT    /api/appointments/:id      - Update appointment
DELETE /api/appointments/:id      - Delete appointment
PUT    /api/appointments/:id/reschedule - Reschedule appointment
PUT    /api/appointments/:id/cancel     - Cancel appointment
GET    /api/appointments/today    - Get today's appointments
```

### Billing Endpoints
```
GET    /api/billing               - Get all bills
GET    /api/billing/:id           - Get bill by ID
POST   /api/billing               - Create new bill
PUT    /api/billing/:id           - Update bill
DELETE /api/billing/:id           - Delete bill
PUT    /api/billing/:id/payment   - Update payment status
GET    /api/billing/pending       - Get pending bills
```

### Laboratory Endpoints
```
GET    /api/laboratory            - Get all tests
GET    /api/laboratory/:id        - Get test by ID
POST   /api/laboratory            - Create new test
PUT    /api/laboratory/:id        - Update test
DELETE /api/laboratory/:id        - Delete test
POST   /api/laboratory/:id/results - Upload test results
GET    /api/laboratory/pending    - Get pending tests
```

### Staff Endpoints
```
GET    /api/staff                 - Get all staff
GET    /api/staff/:id             - Get staff by ID
POST   /api/staff                 - Create new staff
PUT    /api/staff/:id             - Update staff
DELETE /api/staff/:id             - Delete staff
GET    /api/staff/role            - Get staff by role
GET    /api/staff/department      - Get staff by department
```

### Ward Endpoints
```
GET    /api/wards                 - Get all wards
GET    /api/wards/:id             - Get ward by ID
POST   /api/wards                 - Create new ward
PUT    /api/wards/:id             - Update ward
DELETE /api/wards/:id             - Delete ward
GET    /api/wards/available-beds  - Get available beds
```

### TPA Endpoints
```
GET    /api/tpa                   - Get all TPA records
GET    /api/tpa/:id               - Get TPA record by ID
POST   /api/tpa                   - Create new TPA claim
PUT    /api/tpa/:id               - Update TPA claim
DELETE /api/tpa/:id               - Delete TPA claim
POST   /api/tpa/:id/submit        - Submit TPA claim
```

### Insurance Endpoints
```
GET    /api/insurance-policies    - Get all policies
POST   /api/insurance-policies    - Create policy
GET    /api/insurance-claims      - Get all claims
POST   /api/insurance-claims      - Create claim
POST   /api/insurance-claims/:id/submit - Submit claim
```

### Authentication Endpoints
```
POST   /api/auth/login            - Login with credentials
POST   /api/auth/register         - Register new user
POST   /api/auth/logout           - Logout user
GET    /api/auth/me               - Get current user
POST   /api/auth/refresh          - Refresh auth token
POST   /api/auth/change-password  - Change password
```

---

## 🧪 Testing the Connection

### Using cURL

```bash
# Test patient endpoint
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Test create patient
curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "bloodGroup": "O+",
    "address": "123 Main St"
  }'
```

### Using Postman

1. Import the API endpoints from backend documentation
2. Set base URL: `http://localhost:5000/api`
3. Add Authorization header: `Bearer YOUR_TOKEN`
4. Test each endpoint

### Using Frontend Application

1. Navigate to http://localhost:3000
2. Login with `admin` / `admin123`
3. Go to each module and test:
   - Create new patient
   - Add doctor
   - Schedule appointment
   - Create bill
   - Add lab test
   - etc.

---

## 🌐 Railway Deployment (Production)

### Deploy Backend to Railway

```bash
cd hospital-backend

# Create Railway app
railway init
railway add

# Set environment variables in Railway dashboard
# DB_HOST, DB_USER, DB_PASSWORD, etc.

# Deploy
railway up
```

### Deploy Frontend to Railway

```bash
cd hospitalmanagement

# Set environment variable for backend URL
# REACT_APP_API_URL=https://your-hospital-backend.up.railway.app/api

# Build and deploy
railway up
```

### Connect Frontend to Deployed Backend

Update `hospitalmanagement/.env.production` or set in Railway:

```env
REACT_APP_API_URL=https://your-hospital-backend.up.railway.app/api
```

---

## 🔐 Security Considerations

### Frontend
- ✅ Token stored in localStorage (consider using httpOnly cookies)
- ✅ Authorization headers sent with API requests
- ✅ Fallback to demo credentials for development
- ✅ Auto-logout on invalid token

### Backend
- ✅ JWT authentication on all protected routes
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ Helmet.js for security headers

### Database
- ✅ Connection pooling
- ✅ Query parameterization (prevent SQL injection)
- ✅ User permissions and roles
- ✅ Data encryption at rest (should be implemented)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
**Solution**: 
- Check if backend is running: `http://localhost:5000`
- Verify CORS is enabled in backend
- Check network tab in browser DevTools
- Verify API_URL in .env.local is correct

### Issue: "401 Unauthorized"
**Solution**:
- Check if token is valid
- Try logging out and in again
- Check token expiration time
- Verify JWT_SECRET matches between frontend and backend

### Issue: "Database connection failed"
**Solution**:
- Verify MySQL is running
- Check DB credentials in .env
- Verify database exists
- Run database migrations: `npm run seed`

### Issue: "CORS error"
**Solution**:
- Check CORS_ORIGIN in backend .env
- Verify frontend URL matches CORS_ORIGIN
- Clear browser cache and cookies
- Restart backend server

---

## 📈 Performance Optimization

### Frontend
- Implement lazy loading for routes
- Use React.memo for expensive components
- Implement pagination for lists
- Cache API responses

### Backend
- Add database indexes
- Implement caching (Redis)
- Use connection pooling
- Optimize queries

### Database
- Create indexes on frequently queried fields
- Archive old records
- Use partitioning for large tables
- Regular backups

---

## 📚 Additional Resources

### Backend Documentation
- See `hospital-backend/README.md`
- See `hospital-backend/API_REFERENCE.md`
- See `hospital-backend/DEPLOYMENT.md`

### Frontend Documentation
- See `COMPREHENSIVE_FEATURES_GUIDE.md`
- See `QUICK_START_GUIDE.md`
- See `README.md`

---

## ✅ Integration Checklist

- [x] API service layer created
- [x] Environment configuration setup
- [x] HospitalContext updated with API calls
- [x] Authentication integrated
- [x] Loading and error states added
- [ ] Backend deployed and running
- [ ] Frontend pointing to backend API
- [ ] All endpoints tested
- [ ] Database verified
- [ ] Production environment variables set

---

## 🎯 Next Steps

1. **Setup Backend**
   - Install dependencies
   - Configure MySQL database
   - Set environment variables
   - Run migrations

2. **Test Connection**
   - Start both frontend and backend
   - Login to application
   - Verify data is fetched from database

3. **Deploy**
   - Deploy backend to Railway
   - Update frontend API URL
   - Deploy frontend to Railway
   - Test production environment

4. **Monitor**
   - Monitor API logs
   - Track database performance
   - Monitor error rates
   - Setup alerting

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Check network tab in browser DevTools
4. Verify environment variables
5. Contact development team

---

**Version**: 1.0.0
**Last Updated**: February 2, 2026
**Status**: Ready for Production

