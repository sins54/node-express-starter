import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import validate from '../src/middlewares/validate.js';
import { z } from 'zod';

describe('Validate Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should pass validation with valid body', () => {
    const schema = {
      body: z.object({
        name: z.string()
      })
    };
    mockReq.body = { name: 'Test' };

    validate(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockReq.body.name).toBe('Test');
  });

  it('should call next with AppError on validation failure', () => {
    const schema = {
      body: z.object({
        name: z.string().min(1, 'Name is required')
      })
    };
    mockReq.body = { name: '' };

    validate(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('Validation error');
  });

  it('should validate query parameters', () => {
    const schema = {
      query: z.object({
        page: z.string()
      })
    };
    mockReq.query = { page: '1' };

    validate(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should validate route parameters', () => {
    const schema = {
      params: z.object({
        id: z.string()
      })
    };
    mockReq.params = { id: '123' };

    validate(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });
});
