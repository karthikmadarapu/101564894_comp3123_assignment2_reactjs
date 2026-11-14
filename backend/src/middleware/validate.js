// middleware/validate.js
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
module.exports = (req, res, next) => {
  const r = validationResult(req);
  if (r.isEmpty()) return next();
  next(new ApiError( 'Validation failed', 400, 'VALIDATION_ERROR', 
    r.array().map(e => ({ field: e.path, message: e.msg }))));
};