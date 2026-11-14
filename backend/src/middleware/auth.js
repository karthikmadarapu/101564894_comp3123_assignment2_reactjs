const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function auth(req, res, next) {
  //1. read the header
  const header = req.headers.authorization;

<<<<<<< HEAD
  if (!header || !header.startsWith('Bearer')) {
=======
  if (!header || !header.startsWith('Bearer ')) {
>>>>>>> phase2-frontend
    return res.status(401).json({ message: 'Missing or malformed Authorization header' });
  }

  const token = header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    //2. Verify signature + expiry (throws if either fails)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //3. Make sure the user still exists , then attach it
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
