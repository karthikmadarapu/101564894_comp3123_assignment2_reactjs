module.exports = class ApiError extends Error {
  constructor(message, status = 500, code, errors) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
};