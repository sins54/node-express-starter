import request from 'supertest';
import app from '../src/app.js';

describe('Correlation ID', () => {
  it('should return correlation ID in response headers', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.headers['x-correlation-id']).toBeDefined();
    expect(response.headers['x-correlation-id']).toMatch(/^[0-9a-f-]+$/i);
  });

  it('should use provided correlation ID when passed in headers', async () => {
    const correlationId = 'test-correlation-id-123';
    const response = await request(app)
      .get('/api/v1/health')
      .set('x-correlation-id', correlationId);

    expect(response.headers['x-correlation-id']).toBe(correlationId);
  });

  it('should accept x-request-id as correlation ID', async () => {
    const requestId = 'test-request-id-456';
    const response = await request(app)
      .get('/api/v1/health')
      .set('x-request-id', requestId);

    expect(response.headers['x-correlation-id']).toBe(requestId);
  });
});
