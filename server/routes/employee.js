const express = require('express');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Employee marks attendance (only allowed if within distance — validate on client, server trusts but records marker and client should pass lat/lng)
router.post('/mark', authMiddleware('employee'), async (req, res) => {
  const { user } = req;
  const { status, dateStr } = req.body;
  try {
    const emp = await Employee.findById(user.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    let att = await Attendance.findOne({ employee: emp._id, date });
    if (!att) {
      att = new Attendance({ employee: emp._id, date, status, markedBy: 'employee' });
    } else {
      att.status = status;
      att.markedBy = 'employee';
      att.markedAt = new Date();
    }
    await att.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employee get own month
router.get('/me/month/:year/:month', authMiddleware('employee'), async (req, res) => {
  const { user } = req;
  try {
    const emp = await Employee.findById(user.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const y = parseInt(req.params.year), m = parseInt(req.params.month);
    const start = new Date(y, m-1, 1);
    const end = new Date(y, m, 1);
    const records = await Attendance.find({ employee: emp._id, date: { $gte: start, $lt: end } });
    const map = {};
    records.forEach(r => {
      const d = new Date(r.date);
      const day = d.getDate();
      map[day] = r.status;
    });
    const daysInMonth = new Date(y, m, 0).getDate();
    const result = [];
    for (let d=1; d<=daysInMonth; d++) result.push({ day: d, status: map[d] || 'absent' });
    res.json({ employee: emp.employeeId, days: result, month: m, year: y });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
