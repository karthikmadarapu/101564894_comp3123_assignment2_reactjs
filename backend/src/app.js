// app.js configures the app (middleware and routes)
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
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
app.use(cors({ origin: corsOrigins, credentials: true }));

app.use(express.json());

// Rate limits
app.use('/api', apiLimiter);
app.use('/api/v1/user/login', authLimiter);
app.use('/api/v1/user/signup', authLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
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