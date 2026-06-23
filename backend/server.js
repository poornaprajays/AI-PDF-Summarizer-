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

// CORS — allow Netlify frontend in production, localhost in dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL, // e.g. https://yourapp.netlify.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/summary', summaryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', env: process.env.NODE_ENV || 'development' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AI PDF Summarizer API is running.' });
});

// Start server (not used in serverless/Netlify Functions context)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
