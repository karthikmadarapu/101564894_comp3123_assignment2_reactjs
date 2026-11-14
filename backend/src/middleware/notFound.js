<<<<<<< HEAD
const AppError = require('../utils/AppError');
=======
const AppError = require('../utils/ApiError');
>>>>>>> phase2-frontend

module.exports = (req, res, next) =>
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
