import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import BillingPage from './pages/BillingPage';
import DoctorsPage from './pages/DoctorsPage';
import StaffPage from './pages/StaffPage';
import OPDPage from './pages/OPDPage';
import IPDPage from './pages/IPDPage';
import AppointmentsPage from './pages/AppointmentsPage';
import LaboratoryPage from './pages/LaboratoryPage';
import WardsPage from './pages/WardsPage';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ReportsPage from './pages/ReportsPage';
import TPAPage from './pages/TPAPage';
import EnhancedTPAPage from './pages/EnhancedTPAPage';
import Header from './components/Header';
import Sidebar from './components/Navigation/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const authContext = useContext(AuthContext);

  if (!authContext.isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/receptionist-dashboard" 
              element={
                <ProtectedRoute requiredRoles={['RECEPTIONIST']}>
                  <ReceptionistDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opd" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
                  <OPDPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ipd" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE']}>
                  <IPDPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                  <PatientManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/billing" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'ACCOUNTANT']}>
                  <BillingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
                  <AppointmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/laboratory" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'LAB_TECHNICIAN', 'DOCTOR']}>
                  <LaboratoryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wards" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'NURSE', 'DOCTOR']}>
                  <WardsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AuthPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctors" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'RECEPTIONIST']}>
                  <DoctorsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <StaffPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'ACCOUNTANT']}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tpa" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'ACCOUNTANT']}>
                  <TPAPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/enhanced-tpa" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'ACCOUNTANT']}>
                  <EnhancedTPAPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;