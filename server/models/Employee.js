const mongoose = require('mongoose');
const EmployeeSchema = new mongoose.Schema({
  name: String,
  employeeId: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  division: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Employee', EmployeeSchema);
