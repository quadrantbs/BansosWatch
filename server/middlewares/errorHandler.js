class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      error: err.details.map((detail) => ({
        message: detail.message,
        path: detail.path[0],
      })),
    });
  }

  if (err.name === "MongoError" || err.name === "SequelizeDatabaseError") {
    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: err.message,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication Failed",
      error: err.message,
    });
  }

  if (err.name === "Forbidden") {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
      error: err.message,
    });
  }

  if (err.name === "NotFound") {
    return res.status(404).json({
      success: false,
      message: "Resource Not Found",
      error: err.message,
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

const createError = (message, statusCode) => {
  return new CustomError(message, statusCode);
};

const createDatabaseError = (message) => {
  const error = new Error(message);
  error.name = "MongoError";
  return error;
};

const createAuthError = (message) => {
  const error = new Error(message);
  error.name = "JsonWebTokenError";
  return error;
};

const createForbiddenError = (message) => {
  const error = new Error(message);
  error.name = "Forbidden";
  return error;
};

const createNotFoundError = (message) => {
  const error = new Error(message);
  error.name = "NotFound";
  return error;
};

module.exports = {
  errorHandler,
  createError,
  createDatabaseError,
  createAuthError,
  createForbiddenError,
  createNotFoundError,
};
