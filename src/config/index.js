import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment variable validation schema using Zod
 * Crash the application if required variables are missing
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info')
});

/**
 * Parse and validate environment variables
 * Will throw an error and crash if validation fails
 */
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    const errors = Object.entries(formatted)
      .filter(([key]) => key !== '_errors')
      .map(([key, value]) => `${key}: ${value._errors?.join(', ')}`)
      .join('\n');

    // eslint-disable-next-line no-console
    console.error('❌ Environment validation failed:\n', errors);
    process.exit(1);
  }

  return result.data;
};

const env = parseEnv();

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  mongodbUri: env.MONGODB_URI,
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX
  },
  logLevel: env.LOG_LEVEL
};
