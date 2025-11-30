import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Handle casting errors from MongoDB
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, message };
};

/**
 * Handle duplicate key errors from MongoDB
 */
const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return { statusCode: 400, message };
};

/**
 * Handle validation errors from MongoDB
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { statusCode: 400, message };
};

/**
 * Send error response for development environment
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send error response for production environment
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    logger.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.env === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
      const { statusCode, message } = handleCastError(err);
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = true;
    }
    if (err.code === 11000) {
      const { statusCode, message } = handleDuplicateKeyError(err);
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = true;
    }
    if (err.name === 'ValidationError') {
      const { statusCode, message } = handleValidationError(err);
      error.statusCode = statusCode;
      error.message = message;
      error.isOperational = true;
    }

    sendErrorProd(error, res);
  }
};

export default errorHandler;
