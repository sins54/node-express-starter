import { Router } from 'express';
import userRoutes from './userRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/users', userRoutes);

export default router;
