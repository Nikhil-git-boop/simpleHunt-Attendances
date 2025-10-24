const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true, sparse: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Admin', AdminSchema);
