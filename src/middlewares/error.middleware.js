import config from '#config/index';
import logger from '#config/logger';

/**
 * Handle casting errors from MongoDB
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, message, isOperational: true };
};

/**
 * Handle duplicate key errors from MongoDB
 */
const handleDuplicateKeyError = (err) => {
  const match = err.errmsg?.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return { statusCode: 400, message, isOperational: true };
};

/**
 * Handle validation errors from MongoDB
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { statusCode: 400, message, isOperational: true };
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
  isOperational: true
});

/**
 * Handle JWT expired errors
 */
const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Your token has expired. Please log in again.',
  isOperational: true
});

/**
 * Send error response for development environment
 */
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    correlationId: req.correlationId
  });
};

/**
 * Send error response for production environment
 */
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      correlationId: req.correlationId
    });
  } else {
    // Log the error for debugging
    logger.error('Unexpected error 💥', { error: err, correlationId: req.correlationId });

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      correlationId: req.correlationId
    });
  }
};

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log all errors with correlation ID
  const requestLogger = req.log || logger;
  requestLogger.error(`${err.statusCode} - ${err.message}`, {
    stack: err.stack,
    correlationId: req.correlationId
  });

  if (config.env === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.status = err.status;
    error.statusCode = err.statusCode;

    if (err.name === 'CastError') {
      const { statusCode, message, isOperational } = handleCastError(err);
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = isOperational;
    }
    if (err.code === 11000) {
      const { statusCode, message, isOperational } = handleDuplicateKeyError(err);
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = isOperational;
    }
    if (err.name === 'ValidationError') {
      const { statusCode, message, isOperational } = handleValidationError(err);
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = isOperational;
    }
    if (err.name === 'JsonWebTokenError') {
      const { statusCode, message, isOperational } = handleJWTError();
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = isOperational;
    }
    if (err.name === 'TokenExpiredError') {
      const { statusCode, message, isOperational } = handleJWTExpiredError();
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = isOperational;
    }

    sendErrorProd(error, req, res);
  }
};

export default errorMiddleware;
