import AppError from '../src/utils/AppError.js';

describe('AppError', () => {
  it('should create an error with correct status code and status', () => {
    const error = new AppError('Test error', 404);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  it('should set status to error for 5xx errors', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });

  it('should set status to fail for 4xx errors', () => {
    const error = new AppError('Client error', 400);
    expect(error.status).toBe('fail');
  });
});
