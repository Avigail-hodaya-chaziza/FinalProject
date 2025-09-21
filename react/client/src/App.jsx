// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TreatmentsList from './Components/TreatmentsList';
import CalendarWithDisabledDates from './Components/CalendarWithDisabledDates';
import Login from './pages/login';
import Summary from './pages/SummaryPage';
import Qastion from './pages/Qastion';
import Navbar from './pages/Navbar';
import IsContact from './pages/IsContact';
import AdminLogin from './pages/AdminLogin';
import AddTreatmentForm from './Components/AddTreatmentForm';
import CustomerForm from './Slice/Customer/CustomerForm';
import About from './pages/About';
import UpdateTreatment from './Components/UpdateTreatment';
import Bay from './pages/bay';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/question" element={<Qastion />} />
      <Route path="/treatments" element={<TreatmentsList />} />
      <Route path="/IsContact" element={<IsContact />} />
      <Route path="/About" element={<About />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/calendar" element={<CalendarWithDisabledDates />} />
      <Route path="/login" element={<Login />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/AddTreatmentForm" element={<AddTreatmentForm />} />
      <Route path="/CustomerForm" element={<CustomerForm />} />
      <Route path="/UpdateTreatment/:id" element={<UpdateTreatment />} />
      <Route path="/bay" element={<Bay />} />
    </Routes>
  );
}

export default App;