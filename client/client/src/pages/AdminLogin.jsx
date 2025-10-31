import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'

const API = import.meta.env.VITE_API_URL;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/admin/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err); // For debugging
    }
  };

  return (
    <div className="bg-page">
        <div className="center-card">
           <h1 className='loginH1 ' >Simple<span className='spanH1'>Hunt</span></h1>
          <div className="pages_shifting">
              <h2 className='h1'>Admin Login</h2> <p>or</p>
            <Link className='link' to="/employee/login">Employee Login</Link>
          </div>
    
      <form onSubmit={onSubmit}>
        <input
         className="input-box"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="input-box"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <Link to="/admin/register"></Link>
      </div>
      <div className='link-box'>
      
      </div>
    </div>
    </div>
  
  );
}
