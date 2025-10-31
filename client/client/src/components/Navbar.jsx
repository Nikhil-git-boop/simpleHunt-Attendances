import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './Nav.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div  className="navbar-s" style={{ position:'relative' }}>
      <div >
        <Link className='linkss' to="/admin/home">
          <div className="brand">
        
          <div>
            <h1 className="nav-h1">Simple<span className="span-h1">Hunt</span></h1>
            <div style={{fontSize:'1rem', color:'black', fontWeight:500,top:-1,}}>Media Techologies LLP</div>
          </div>
        </div>

        </Link>
        
        <div className="nav-actions">
          
          <button className="menu-btn" onClick={() => setMenuOpen(s => !s)}>Menu ▾</button>
          
        </div>
      </div>

      {menuOpen && (
        <div className="menu-list" onMouseLeave={() => setMenuOpen(false)}>
           <Link to="/admin/home">Home</Link>
            <Link to="#">About</Link>
            <Link to="#">Contact</Link>
            <Link to="/admin/login">Logout</Link>
            <Link to="/admin/add-employee">Add Employee</Link>
        </div>
      )}
    </div>
  );
}
