// app.js configures the app (middleware and routes)
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { uploadDir, corsOrigins } = require('./config');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employee.routes');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');

const app = express();
app.set('trust proxy', 1);

app.use(requestLogger);

// 'cross-origin' lets React on :3000 display images served from :5000
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Step 4: allow the React app (CORS_ORIGIN in .env) to call this API
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Without this the browser hides Retry-After and the UI cannot say "try again in N minutes"
    exposedHeaders: ['Retry-After', 'RateLimit', 'RateLimit-Policy'],
  }),
);

app.use(express.json());

// Rate limits
app.use('/api', apiLimiter);
app.use('/api/v1/user/login', authLimiter);
app.use('/api/v1/user/signup', authLimiter);

// Health check
// Health check (used by the Docker healthcheck): 503 when Mongo is not connected
app.get('/health', (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? 'ok' : 'degraded',
    db: dbUp ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Step 5: serve uploaded pictures at http://localhost:5000/uploads/<file>
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// These must stay LAST
app.use(notFound);
app.use(errorHandler);

module.exports = app;