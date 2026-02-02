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
import AdminLogin from './components/AdminLogin';
import { HospitalProvider } from './context/HospitalContext';
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
        <Route path="/admin/login" component={AdminLogin} />
      </Switch>
      {location.pathname === '/' && <Footer />}
    </div>
  );
};

const App = () => (
  <HospitalProvider>
    <Router>
      <Sidebar />
      <MainContent />
    </Router>
  </HospitalProvider>
);

export default App;