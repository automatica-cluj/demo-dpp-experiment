import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DashboardApp from './DashboardApp';
import AboutPage from './AboutPage';
import CustomerDashboard from './CustomerDashboard';
import RepairShopDashboard from './RepairShopDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardApp />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/repair" element={<RepairShopDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;