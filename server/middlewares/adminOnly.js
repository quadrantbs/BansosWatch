const { createForbiddenError } = require("../middlewares/errorHandler");

const adminOnly = (req, res, next) => {
  if (req.user?.data.role !== "admin") {
    return next(
      createForbiddenError("Access denied. Only admins can access this.")
    );
  }
  next();
};

module.exports = adminOnly;
