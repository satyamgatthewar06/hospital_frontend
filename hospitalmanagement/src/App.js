import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import Sidebar from './components/Navigation/Sidebar';
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import BillingPage from './pages/BillingPage';
import DoctorsPage from './pages/DoctorsPage';
import StaffPage from './pages/StaffPage';
import AppointmentsPage from './pages/AppointmentsPage';
import LaboratoryPage from './pages/LaboratoryPage';
import WardPage from './pages/WardPage';
import IPDPage from './pages/IPDPage';
import OPDPage from './pages/OPDPage';
import InsuranceClaimsPage from './pages/InsuranceClaimsPage';
import InsurancePoliciesPage from './pages/InsurancePoliciesPage';
import TPAPage from './pages/TPAPage';
import EnhancedPatientManagement from './pages/EnhancedPatientManagement';
import EnhancedDoctorModule from './pages/EnhancedDoctorModule';
import EnhancedAppointments from './pages/EnhancedAppointments';
import ComprehensiveBilling from './pages/ComprehensiveBilling';
import AdminPanelDashboard from './pages/AdminPanelDashboard';
import LaboratoryModule from './pages/LaboratoryModule';
import RoomManagement from './pages/RoomManagement';
import EnhancedStaffManagement from './pages/EnhancedStaffManagement';
import TPAManagement from './pages/TPAManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminLogin from './components/AdminLogin';
import { HospitalProvider } from './context/HospitalContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './animations.css';
import Header from './components/Header';
import Footer from './components/Footer';

const MainContent = () => {
  const location = useLocation();
  return (
    <div className="main-content">
      {location.pathname === '/' && <Header />}
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/patients" component={PatientManagement} />
        <Route path="/appointments" component={AppointmentsPage} />
        <Route path="/billing" component={BillingPage} />
        <Route path="/doctors" component={DoctorsPage} />
        <Route path="/staff" component={StaffPage} />
        <Route path="/laboratory" component={LaboratoryPage} />
        <Route path="/wards" component={WardPage} />
        <Route path="/ipd" component={IPDPage} />
        <Route path="/opd" component={OPDPage} />
        <Route path="/insurance-claims" component={InsuranceClaimsPage} />
        <Route path="/insurance-policies" component={InsurancePoliciesPage} />
        <Route path="/tpa" component={TPAPage} />
        <Route path="/enhanced-patients" component={EnhancedPatientManagement} />
        <Route path="/enhanced-doctors" component={EnhancedDoctorModule} />
        <Route path="/enhanced-appointments" component={EnhancedAppointments} />
        <Route path="/comprehensive-billing" component={ComprehensiveBilling} />
        <Route path="/admin-dashboard" component={AdminPanelDashboard} />
        <Route path="/laboratory-module" component={LaboratoryModule} />
        <Route path="/room-management" component={RoomManagement} />
        <Route path="/staff-management" component={EnhancedStaffManagement} />
        <Route path="/tpa-management" component={TPAManagement} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/admin/login" component={AdminLogin} />
      </Switch>
      {location.pathname === '/' && <Footer />}
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <HospitalProvider>
      <Router>
        <Sidebar />
        <MainContent />
      </Router>
    </HospitalProvider>
  </ThemeProvider>
);

export default App;