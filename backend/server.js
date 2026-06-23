// AI PDF Summarizer Backend
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize database tables
require('./models/User');
require('./models/Summary');

const authRoutes = require('./routes/authRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();
const path = require('path');

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve static assets from the frontend build folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Route all non-API requests to the React frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
