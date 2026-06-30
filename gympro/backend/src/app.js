const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { setupPassport } = require('./config/passport');

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — allow Vite dev + production frontend
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body + cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Passport (Google OAuth)
setupPassport();
app.use(passport.initialize());

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'GymPro API', ts: new Date().toISOString() })
);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

// 404
app.use((_req, res) => res.status(404).json({ status: 'error', message: 'Route not found.' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ status: 'error', message: err.message || 'Internal server error.' });
});

module.exports = app;
