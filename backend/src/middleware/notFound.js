const AppError = require('../utils/ApiError');

module.exports = (req, res, next) =>
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
