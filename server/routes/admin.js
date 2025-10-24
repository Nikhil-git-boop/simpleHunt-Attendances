const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { authMiddleware } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Add employee
router.post('/employee', authMiddleware('admin'), async (req, res) => {
  const { name, employeeId, phone, password, division } = req.body;
  if (!employeeId || !password) return res.status(400).json({ error: 'employeeId and password required' });
  try {
    const exists = await Employee.findOne({ employeeId });
    if (exists) return res.status(400).json({ error: 'Employee with this ID exists' });
    const hash = await bcrypt.hash(password, 10);
    const emp = new Employee({ name, employeeId, phone, passwordHash: hash, division });
    await emp.save();
    res.json({ success: true, employee: emp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List employees with optional search
router.get('/employees', authMiddleware('admin'), async (req, res) => {
  const { q } = req.query;
  const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
  const list = await Employee.find(filter).sort({ name: 1 }).select('-passwordHash');
  res.json({ employees: list });
});

// Mark attendance by admin for an employee (admin can mark check/uncheck)
router.post('/attendance/mark', authMiddleware('admin'), async (req, res) => {
  const { employeeId, dateStr, status } = req.body; // dateStr like '2025-10-24'
  try {
    const emp = await Employee.findOne({ employeeId });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    let att = await Attendance.findOne({ employee: emp._id, date });
    if (!att) {
      att = new Attendance({ employee: emp._id, date, status, markedBy: 'admin' });
    } else {
      att.status = status;
      att.markedBy = 'admin';
      att.markedAt = new Date();
    }
    await att.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get month data for an employee
router.get('/employee/:employeeId/month/:year/:month', authMiddleware('admin'), async (req, res) => {
  const { employeeId, year, month } = req.params;
  try {
    const emp = await Employee.findOne({ employeeId });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const y = parseInt(year), m = parseInt(month); // month 1-12
    const start = new Date(y, m-1, 1);
    const end = new Date(y, m, 1);
    const daysInMonth = new Date(y, m, 0).getDate();
    const records = await Attendance.find({ employee: emp._id, date: { $gte: start, $lt: end } });
    // Build day map and fill absent for missing days
    const map = {};
    records.forEach(r => {
      const d = new Date(r.date);
      const day = d.getDate();
      map[day] = r.status;
    });
    const result = [];
    for (let d=1; d<=daysInMonth; d++) {
      result.push({ day: d, status: map[d] || 'absent' });
    }
    res.json({ employee: emp.employeeId, month: m, year: y, days: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
