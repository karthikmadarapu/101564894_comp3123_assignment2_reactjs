// Sends rejected promises from async controllers to errorHandler.
// Works on Express 4 and 5 without needing express-async-errors.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);