// config/index.js
const path = require('path');
module.exports = {
  port: Number(process.env.PORT) || 5000,
  uploadDir: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
  maxUploadBytes: (Number(process.env.MAX_UPLOAD_MB) || 2) * 1024 * 1024,
  corsOrigins: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 10,
};