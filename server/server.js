require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
mongoose.connect(process.env.MONGODB_URI)
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
