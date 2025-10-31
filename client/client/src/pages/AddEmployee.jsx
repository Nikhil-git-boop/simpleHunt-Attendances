import React, {useState} from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

export default function AddEmployee(){
  const [name,setName]=useState('');
  const [employeeId,setEmployeeId]=useState('');
  const [phone,setPhone]=useState('');
  const [password,setPassword]=useState('');
  const [division,setDivision]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API}/api/admin/employee`, { name, employeeId, phone, password, division });
      alert('Employee created');
      navigate('/admin/home');
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="center-card">
        <h3>Add Employee</h3>
        <form onSubmit={submit}>
          <input className="input-box" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required/>
          <input className="input-box" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} placeholder="Employee ID" required/>
          <input className="input-box" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" required/>
          <input className="input-box" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/>
          <input className="input-box" value={division} onChange={e=>setDivision(e.target.value)} placeholder="Department" />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}
