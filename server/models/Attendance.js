const mongoose = require('mongoose');
const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  date: { type: Date }, // date at midnight
  status: { type: String, enum: ['present','absent'], default: 'absent' },
  markedBy: { type: String }, // 'employee' or 'admin'
  markedAt: { type: Date, default: Date.now }
});
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', AttendanceSchema);
