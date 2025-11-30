import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './index.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

/**
 * Custom log format for console output
 */
const consoleFormat = printf(({ level, message, timestamp, correlationId, stack }) => {
  const corrId = correlationId ? `[${correlationId}] ` : '';
  return `${timestamp} ${corrId}[${level}]: ${stack || message}`;
});

/**
 * Custom log format for file output (JSON for structured logging)
 */
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

/**
 * Daily rotate file transport for error logs
 */
const errorRotateTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat
});

/**
 * Daily rotate file transport for combined logs
 */
const combinedRotateTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat
});

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  defaultMeta: { service: 'node-express-starter' },
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat)
    }),
    errorRotateTransport,
    combinedRotateTransport
  ]
});

// Don't log to files in test environment
if (config.env === 'test') {
  logger.transports.forEach((t) => {
    if (t instanceof DailyRotateFile) {
      t.silent = true;
    }
  });
}

/**
 * Create a child logger with correlation ID attached
 * @param {string} correlationId - The correlation ID for the request
 * @returns {Object} Logger instance with correlation ID
 */
export const createRequestLogger = (correlationId) => {
  return logger.child({ correlationId });
};

export default logger;
