const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const router = express.Router();

// Admin register
router.post('/admin/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Admin exists' });
    const hash = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, phone, email, passwordHash: hash });
    await admin.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Compare password using the correct field
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY || '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Employee login
router.post('/employee/login', async (req, res) => {
  const { employeeId, password } = req.body;
  try {
    const emp = await Employee.findOne({ employeeId });
    if (!emp) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, emp.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: emp._id, role: 'employee' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, employee: { id: emp._id, name: emp.name }});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
