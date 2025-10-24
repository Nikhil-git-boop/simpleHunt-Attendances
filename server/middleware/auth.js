const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

function authMiddleware(role) {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      if (role === 'admin') {
        const admin = await Admin.findById(payload.id);
        if (!admin) return res.status(403).json({ error: 'Admin not found' });
      } else if (role === 'employee') {
        const emp = await Employee.findById(payload.id);
        if (!emp) return res.status(403).json({ error: 'Employee not found' });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { authMiddleware };
