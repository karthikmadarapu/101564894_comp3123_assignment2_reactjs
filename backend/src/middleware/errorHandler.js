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