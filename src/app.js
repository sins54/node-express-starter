import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';

import config from './config/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import correlationId from './middlewares/correlationId.js';
import logger from './utils/logger.js';
import swaggerSpec from './docs/swagger.js';

const app = express();

// Trust proxy (needed for rate limiter behind reverse proxy)
app.set('trust proxy', 1);

// Correlation ID middleware (should be early in the chain)
app.use(correlationId);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.env === 'production' ? false : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-request-id']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// HTTP request logging with Morgan (stream to Winston with correlation ID)
const morganStream = {
  write: (message) => logger.http(message.trim())
};
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(morganFormat, { stream: morganStream }));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: [] // Add parameters that can have multiple values
}));

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Node Express Starter API Docs'
}));

// API routes
app.use('/api/v1', routes);

// Handle undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
