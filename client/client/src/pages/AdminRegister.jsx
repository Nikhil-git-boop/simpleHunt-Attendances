import React, { useState } from 'react';
import api, { setAuth } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'

const API = import.meta.env.VITE_API_URL;

export default function AdminRegister(){
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      await api.post(`${API}/api/auth/admin/register`, { name, phone, email, password });
      alert('Registered. Please login.');
      navigate('/admin/login');
    }catch(err){ alert(err.response?.data?.error || 'Error'); }
  };

  return (
    <div className="bg-page">
       <div className="center-card">
       <h1 className='loginH1 ' >Simple<span className='spanH1'>Hunt</span></h1>
      <h2>Admin Register</h2>
      <form onSubmit={onSubmit}>
        <input className="input-box" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="input-box" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} required/>
        <input className="input-box" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="input-box" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        <button className="input-box" type="submit">Register</button>
      </form>
      <div><Link to="/admin/login">Already have account? Login</Link></div>
    </div>
    </div>
   
  );
}
