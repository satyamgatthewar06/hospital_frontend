import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
// import Sidebar from './components/Navigation/Sidebar'; // Removed, used in Layout
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import BillingPage from './pages/BillingPage';
import DoctorsPage from './pages/DoctorsPage';
import StaffPage from './pages/StaffPage';
import AppointmentsPage from './pages/AppointmentsPage';
// import LaboratoryPage from './pages/LaboratoryPage'; // Replaced by LaboratoryModule
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
import PatientPortal from './pages/PatientPortal';
import ConsentsPage from './pages/ConsentsPage';
import SpecialOPD from './pages/SpecialOPD';
import AdminLogin from './components/AdminLogin';
import Layout from './components/Layout';
import { HospitalProvider } from './context/HospitalContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './animations.css';
// import Header from './components/Header'; // Removed, used in Layout
import Footer from './components/Footer';

const App = () => (
  <ThemeProvider>
    <HospitalProvider>
      <Router>
        <Switch>
          {/* Public Routes (No Layout) */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/patient-portal" component={PatientPortal} />

          {/* Protected/App Routes (With Layout) */}
          <Route path="/">
            <Layout>
              <Switch>
                <PrivateRoute path="/" exact component={Dashboard} />
                <PrivateRoute path="/patients" component={PatientManagement} roles={['admin', 'doctor', 'receptionist', 'nurse']} />
                <PrivateRoute path="/appointments" component={EnhancedAppointments} roles={['admin', 'doctor', 'receptionist']} />
                <PrivateRoute path="/billing" component={BillingPage} roles={['admin', 'accountant']} />
                <PrivateRoute path="/doctors" component={EnhancedDoctorModule} roles={['admin', 'doctor', 'receptionist']} />
                <PrivateRoute path="/staff" component={StaffPage} roles={['admin']} />
                <Route path="/laboratory" component={LaboratoryModule} />
                <Route path="/wards" component={WardPage} />
                <Route path="/ipd" component={IPDPage} />
                <Route path="/special-opd" component={SpecialOPD} />
                <Route path="/opd" component={OPDPage} />
                <Route path="/insurance-claims" component={InsuranceClaimsPage} />
                <Route path="/insurance-policies" component={InsurancePoliciesPage} />
                <Route path="/tpa" component={TPAPage} />
                <PrivateRoute path="/enhanced-patients" component={EnhancedPatientManagement} roles={['admin', 'doctor']} />
                <PrivateRoute path="/enhanced-doctors" component={EnhancedDoctorModule} roles={['admin', 'doctor', 'receptionist']} />
                <PrivateRoute path="/enhanced-appointments" component={EnhancedAppointments} roles={['admin', 'doctor', 'receptionist']} />
                <PrivateRoute path="/comprehensive-billing" component={ComprehensiveBilling} roles={['admin', 'accountant', 'doctor', 'receptionist']} />
                <PrivateRoute path="/admin-dashboard" component={AdminPanelDashboard} roles={['admin']} />
                <Route path="/laboratory-module" component={LaboratoryModule} />
                <Route path="/room-management" component={RoomManagement} />
                <Route path="/staff-management" component={EnhancedStaffManagement} />
                <Route path="/tpa-management" component={TPAManagement} />
                <Route path="/analytics" component={AnalyticsDashboard} />
                <Route path="/consents" component={ConsentsPage} />
              </Switch>
              <Footer />
            </Layout>
          </Route>
        </Switch>
      </Router>
    </HospitalProvider>
  </ThemeProvider>
);

export default App;