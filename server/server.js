require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    "https://simplehunt-attendances-frontend.onrender.com", // your deployed frontend
    "http://localhost:5173" // optional: for local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ✅ MongoDB Connection
const PORT = process.env.PORT || 10000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

// ✅ Default route (optional)
app.get('/', (req, res) => {
  res.send('Server is running fine ✅');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
