import { z } from 'zod';

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

export const updateUserSchema = {
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.enum(['user', 'admin']).optional(),
    active: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().min(1, 'User ID is required')
  })
};

export const getUserSchema = {
  params: z.object({
    id: z.string().min(1, 'User ID is required')
  })
};
