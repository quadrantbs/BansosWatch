const { createForbiddenError } = require("./errorHandler");

const creatorPrivilage = (req, res, next) => {
  if (
    report.creatorId !== req.user.data._id ||
    req.user.data.role !== "admin"
  ) {
    return next(
      createForbiddenError("You are not authorized to delete this report")
    );
  }
  next();
};

module.exports = creatorPrivilage;
