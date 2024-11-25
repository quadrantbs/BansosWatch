const { createAuthError } = require('../middlewares/errorHandler');
const { verifyToken } = require('../helpers/jwt');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return next(createAuthError('Token tidak ditemukan. Silakan login terlebih dahulu.'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return next(createAuthError('Token tidak valid atau telah kedaluwarsa.'));
  }
};

module.exports = authenticate;
