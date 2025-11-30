import { v7 as uuidv7 } from 'uuid';
import { createRequestLogger } from '#config/logger';

/**
 * Middleware to generate and attach correlation ID to each request
 * Enables request tracing across the system
 */
const correlationId = (req, res, next) => {
  // Check for existing correlation ID in headers (for distributed tracing)
  const existingId = req.headers['x-correlation-id'] || req.headers['x-request-id'];

  // Generate new UUID v7 if not provided (time-ordered for better tracing)
  const corrId = existingId || uuidv7();

  // Attach to request object
  req.correlationId = corrId;

  // Create a child logger with correlation ID
  req.log = createRequestLogger(corrId);

  // Set correlation ID in response headers
  res.setHeader('x-correlation-id', corrId);

  next();
};

export default correlationId;
