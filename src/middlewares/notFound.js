import AppError from '../utils/AppError.js';

/**
 * Middleware to handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};

export default notFound;
