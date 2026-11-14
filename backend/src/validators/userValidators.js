const { body } = require('express-validator');
exports.signupRules = [
  body('username').isString().bail().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters'),
  body('email').isString().bail().trim().isEmail().withMessage('Must be a valid email').toLowerCase(),
  body('password').isString().bail().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];
exports.loginRules = [
  body('email').optional().isString().trim(),
  body('username').optional().isString().trim(),
  body('password').isString().withMessage('Password is required').bail().notEmpty().withMessage('Password is required'),
];