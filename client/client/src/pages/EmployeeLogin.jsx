import React, {useState} from 'react';
import api, { setAuth } from '../api';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Logo (5)[1].png";
import './Login.css'
const API = import.meta.env.VITE_API_URL;

export default function EmployeeLogin(){
  const [employeeId,setEmployeeId]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`${API}/api/auth/employee/login`, { employeeId, password });
      localStorage.setItem('token', res.data.token);
      setAuth(res.data.token);
      navigate('/employee/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="bg-page">
      <div className="center-card">
        <img src={logo} alt="Logo" />
          <h1 className='loginH1 ' >Simple<span className='spanH1'>Hunt</span></h1>
      <h2 className='h1'>Employee Login</h2>
      <form onSubmit={onSubmit}>
        <input className="input-box" placeholder="Employee ID" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} required/>
        <input className="input-box" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        <button className="login-Btn" type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}
