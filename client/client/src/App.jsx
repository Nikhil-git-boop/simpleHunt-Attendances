import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import AddEmployee from './pages/AddEmployee';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/add-employee" element={<AddEmployee />} />

      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
    </Routes>
  );
}
export default App;
