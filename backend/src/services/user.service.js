const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../utils/ApiError');

exports.register = async ({ username, email, password }) => {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new ApiError('Username or email already exists', 409, 'DUPLICATE');
  return User.create({ username, email, password });
};

// Returns the user if the credentials are right, otherwise null
exports.authenticate = async ({ email, username, password }) => {
  const query = email ? { email: email.toLowerCase().trim() } : { username: username.trim() };
  const user = await User.findOne(query).select('+password');
  if (!user || !(await user.comparePassword(password))) return null;
  return user;
};

exports.signToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });