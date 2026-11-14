const { body, param, query } = require('express-validator');
const AppError = require('../utils/ApiError');

const text = (name, label, optional) => {
  const chain = optional ? body(name).optional() : body(name).exists().withMessage(`${label} is required`);
  return chain
    .isString().withMessage(`${label} must be text`).bail()   // blocks objects like {"$gt": ""}
    .trim()
    .notEmpty().withMessage(`${label} is required`)
    .isLength({ max: 100 }).withMessage(`${label} is too long`);
};

const employeeFields = (optional) => {
  const opt = (chain) => (optional ? chain.optional() : chain);
  return [
    text('first_name', 'First name', optional),
    text('last_name', 'Last name', optional),
    text('position', 'Position', optional),
    text('department', 'Department', optional),
    opt(body('email'))
      .isString().bail()
      .trim().isEmail().withMessage('Must be a valid email')
      .toLowerCase(),   // not normalizeEmail(), which silently removes dots from Gmail addresses
    opt(body('salary'))
      .trim()
      .isFloat({ min: 0, max: 10_000_000 }).withMessage('Salary must be a positive number')
      .toFloat(),       // multipart sends "55000" as a string
    opt(body('date_of_joining'))
      .trim()
      .isISO8601({ strict: true }).withMessage('Date must be YYYY-MM-DD')
      .toDate(),
  ];
};

exports.eidParamRules = [param('eid').isMongoId().withMessage('Invalid employee id')];
exports.eidQueryRules = [query('eid').isMongoId().withMessage('Invalid employee id')];

exports.createRules = employeeFields(false);
exports.updateRules = [
  ...employeeFields(true),
  body('remove_picture').optional().isBoolean().withMessage('remove_picture must be true or false').toBoolean(),
];

const searchField = (name) =>
  query(name).optional()
    .isString().withMessage(`${name} must be text`).bail()
    .trim().isLength({ min: 1, max: 50 }).withMessage(`${name} must be 1–50 characters`);

exports.searchRules = [
  searchField('department'),
  searchField('position'),
  (req, res, next) =>
    req.query.department || req.query.position
      ? next()
      : next(new AppError('Provide department and/or position', 400)),
];