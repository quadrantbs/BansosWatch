const { createForbiddenError } = require('../middlewares/errorHandler');

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {  
    return next(createForbiddenError('Akses ditolak. Hanya admin yang bisa mengakses ini.'));
  }
  
  next();
};

module.exports = adminOnly;
