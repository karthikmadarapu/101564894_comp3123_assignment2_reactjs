<<<<<<< HEAD
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Turn known library errors into clean AppErrors
const normalize = (err) => {
  if (err instanceof AppError) return err;
  if (err.type === 'entity.parse.failed')
    return new AppError('Malformed JSON in request body', 400);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return new AppError(`${field} already exists`, 409);
  }
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return new AppError('Validation failed', 400, details);
  }
  if (err.name === 'CastError') return new AppError(`Invalid ${err.path}`, 400);
  if (err.name === 'TokenExpiredError') return new AppError('Token expired', 401);
  if (err.name === 'JsonWebTokenError') return new AppError('Invalid token', 401);
  return new AppError('Server error', 500); // unknown = bug, hide details
};

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const appErr = normalize(err);
  const context = {
    method: req.method,
    path: req.originalUrl,
    status: appErr.statusCode,
    ip: req.ip,
  };

  if (appErr.statusCode >= 500) {
    logger.error(err.message, { ...context, stack: err.stack });
  } else {
    logger.warn(appErr.message, context);
  }

  const body = { status: false, message: appErr.message };
  if (appErr.details) body.errors = appErr.details;
  if (process.env.NODE_ENV === 'development') body.stack = err.stack;

  res.status(appErr.statusCode).json(body);
};
=======
// middleware/errorHandler.js
const fs = require('fs');
const multer = require('multer');
const logger = require('../utils/logger');

const MULTER = {
  LIMIT_FILE_SIZE: ['FILE_TOO_LARGE', 'Image must be 2 MB or smaller'],
  LIMIT_UNEXPECTED_FILE: ['UNEXPECTED_FILE', 'Send one image in the profile_picture field'],
  LIMIT_FILE_COUNT: ['UNEXPECTED_FILE', 'Only one image is allowed'],
};

module.exports = (err, req, res, next) => {
  if (req.file) fs.unlink(req.file.path, () => {});   // orphan cleanup on ANY error

  let status = err.status || 500, code = err.code || (status < 500 ? 'ERROR' : 'INTERNAL_ERROR'), message = err.message, errors = err.errors;

  if (err instanceof multer.MulterError) {
    [code, message] = MULTER[err.code] || ['UPLOAD_ERROR', err.message]; status = 400;
  } else if (err.name === 'CastError') {
    status = 400; code = 'INVALID_ID'; message = 'Invalid id';
  } else if (err.code === 11000) {
    status = 409; code = 'DUPLICATE'; message = 'Already exists';
  }
  if (status >= 500) { logger.error(err.stack); message = 'Something went wrong'; }

  res.status(status).json({ status: false, message, code, ...(errors && { errors }) });
};
>>>>>>> phase2-frontend
