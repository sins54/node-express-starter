import { jest } from '@jest/globals';
import catchAsync from '../src/utils/catchAsync.js';

describe('catchAsync', () => {
  it('should call next with error when async function throws', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const wrappedFn = catchAsync(mockFn);
    await wrappedFn(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it('should not call next when async function succeeds', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const wrappedFn = catchAsync(mockFn);
    await wrappedFn(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
