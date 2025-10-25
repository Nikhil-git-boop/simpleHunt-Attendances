import React, {useEffect, useState} from 'react';
import api, { setAuth } from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css'
const API = import.meta.env.VITE_API_URL;

export default function EmployeeDashboard(){
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [todayStatus, setTodayStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/employee/login'); return; }
    setAuth(token);
    // We can't easily fetch employee name without adding an endpoint; just show welcome
    setName('Employee');
    fetchTodayStatus();
  }, []);

  async function fetchTodayStatus() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth()+1;
    const res = await api.get(`${API}/api/employee/me/month/${y}/${m}`);
    const day = now.getDate();
    setTodayStatus(res.data.days.find(d=>d.day===day)?.status || 'absent');
  }

  function getDistanceFromOffice(lat, lng) {
    const R = 6371000; // meters
    const toRad = (v)=> v * Math.PI / 180;
    const lat1 = toRad(parseFloat(import.meta.env.VITE_OFFICE_LAT || 0));
    const lon1 = toRad(parseFloat(import.meta.env.VITE_OFFICE_LNG || 0));
    const lat2 = toRad(lat);
    const lon2 = toRad(lng);
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a = Math.sin(dlat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2;
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const mark = async (status) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const dist = getDistanceFromOffice(lat, lng);
      const allowed = dist <= (parseInt(import.meta.env.VITE_MARK_DISTANCE_METERS || '100'));
      if (!allowed) {
        alert(`You are ${Math.round(dist)} m away from office. Cannot mark. Must be within ${import.meta.env.VITE_MARK_DISTANCE_METERS || 100} m.`);
        return;
      }
      const today = new Date();
      const localDateStr = today.toLocaleDateString('en-CA'); // e.g., "2025-10-25"
      try {
        await api.post(`${API}/api/employee/mark`, { status, dateStr: localDateStr });
        setMessage('Marked ' + status);
        fetchTodayStatus();
      } catch (err) {
        alert(err.response?.data?.error || 'Error marking');
      }
    }, (err) => {
      alert('Geolocation denied or error: ' + err.message);
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  return (
    <div className="bg-page">
       <div className="center-card">
      <h2>Welcome to Attendance App</h2>
      <div>{name}</div>
      <div>Local date: {new Date().toLocaleString()}</div>
      <div>Today status: <strong>{todayStatus}</strong></div>
      <div className="buttons">
        <button  className="present-btn" onClick={()=>mark('present')}>Mark Present</button>
        <button  className="absent-btn" onClick={()=>mark('absent')}>Mark Absent</button>
      </div>
      <div>{message}</div>
    </div>
    </div>
  );
}
