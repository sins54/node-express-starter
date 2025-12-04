import { z } from 'zod';

/**
 * MongoDB ObjectId validation regex
 */
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

/**
 * Zod schema for MongoDB ObjectId
 */
export const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid MongoDB ObjectId');

/**
 * Schema for creating a new user
 */
export const createUserSchema = {
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required'
      })
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Invalid email address'),
    role: z.enum(['user', 'admin']).optional()
  })
};

/**
 * Schema for updating an existing user
 */
export const updateUserSchema = {
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.enum(['user', 'admin']).optional(),
    active: z.boolean().optional()
  }),
  params: z.object({
    id: objectIdSchema
  })
};

/**
 * Schema for getting a user by ID
 */
export const getUserSchema = {
  params: z.object({
    id: objectIdSchema
  })
};
