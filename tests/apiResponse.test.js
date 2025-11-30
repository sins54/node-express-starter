import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import ApiResponse from '../src/utils/apiResponse.js';

describe('ApiResponse', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('success', () => {
    it('should return success response with default values', () => {
      ApiResponse.success(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Success'
      });
    });

    it('should return success response with custom values', () => {
      const data = { user: { name: 'John' } };
      ApiResponse.success(mockRes, 200, 'User found', data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User found',
        data: { user: { name: 'John' } }
      });
    });
  });

  describe('created', () => {
    it('should return 201 created response', () => {
      const data = { user: { id: '123' } };
      ApiResponse.created(mockRes, 'User created', data);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User created',
        data: { user: { id: '123' } }
      });
    });
  });

  describe('noContent', () => {
    it('should return 204 no content response', () => {
      ApiResponse.noContent(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe('successWithPagination', () => {
    it('should return success response with pagination', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 100 };
      ApiResponse.successWithPagination(mockRes, 200, 'Items retrieved', data, pagination);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Items retrieved',
        results: 2,
        pagination: { page: 1, limit: 10, total: 100 },
        data: [{ id: 1 }, { id: 2 }]
      });
    });
  });
});
