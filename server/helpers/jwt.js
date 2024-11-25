const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

const generateToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: '24h' }; 

  return jwt.sign(payload, secretKey, options);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
