const service = require('../services/user.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const isStr = (v) => typeof v === 'string' && v.trim() !== '';

// POST /api/v1/user/signup
exports.signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await service.register({ username, email, password });
  logger.info('User registered', { userId: user._id.toString(), ip: req.ip });
  res.status(201).json({ status: true, message: 'User created successfully.', user_id: user._id });
});

// POST /api/v1/user/login
exports.login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(isStr(email) || isStr(username)) || !isStr(password)) {
    throw new ApiError('Email or username, and password are required', 400);
  }

  const user = await service.authenticate({ email: isStr(email) ? email : null, username, password });
  if (!user) {
    logger.warn('Login failed', { identifier: email || username, ip: req.ip });
    throw new ApiError('Invalid username or password', 401);
  }

  logger.info('Login succeeded', { userId: user._id.toString(), ip: req.ip });
  const token = service.signToken(user);
  res.status(200).json({
    status: true,
    message: 'Login successful.',
    token, // name used in the assignment spec example
    jwt_token: token, // name used by the A1 Postman collection
    user: { id: user._id, username: user.username, email: user.email }, // React uses this for the navbar
  });
});