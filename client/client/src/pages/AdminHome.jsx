import React, {useEffect, useState} from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

function EmployeeCard({emp, onView}) {
  const [month, setMonth] = useState(new Date().getMonth()+1);
  return (
    <div className="emp-card">
      <h2>Name: {emp.name} </h2>
      <h5>Employee ID: {emp.employeeId}</h5>
      <div><h5>Division: {emp.division}</h5>
      </div>
      <div>
        <label>Month:
          <input type="number" min="1" max="12" value={month} onChange={e=>setMonth(e.target.value)} />
        </label>
      </div>
      <div>
          <button className="btn-view-details" onClick={() => onView(emp.employeeId, month)}>View Details</button>
      </div>
    </div>
  );
}

export default function AdminHome(){
  const [q, setQ] = useState('');
  const [emps, setEmps] = useState([]);
  useEffect(()=> {
    const token = localStorage.getItem('token');
    if (token) api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    fetchList();
  }, []);

  async function fetchList() {
    const res = await api.get(`${API}/api/admin/employees`, { params: { q } });
    setEmps(res.data.employees);
  }

  async function view(employeeId, month) {
    const year = new Date().getFullYear();
    const res = await api.get(`${API}/api/admin/employee/${employeeId}/month/${year}/${month}`);
    // simple viewer — show in alert for starter
    const rows = res.data.days.map(d => `${d.day}: ${d.status}`).join('\n');
    alert(`Attendance for ${employeeId} - ${month}/${year}\n\n${rows}`);
  }

  return (
    <div>
      <Navbar/>
      <div className="container">
        <h2>All Employees</h2>
        <div className="search">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name" />
          <button onClick={fetchList}>Search</button>
        
        </div>
        <div className="grid">
          {emps.map(emp => <EmployeeCard key={emp._id} emp={emp} onView={view} />)}
        </div>
      </div>
    </div>
  );
}
