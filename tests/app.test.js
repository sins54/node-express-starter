import request from 'supertest';
import app from '../src/app.js';

describe('Health Check Endpoint', () => {
  it('should return 200 and success status', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Server is running');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('404 Handler', () => {
  it('should return 404 for undefined routes', async () => {
    const response = await request(app).get('/api/v1/undefined-route');
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('fail');
  });
});

describe('Rate Limiting', () => {
  it('should have rate limiting headers', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.headers['ratelimit-limit']).toBeDefined();
    expect(response.headers['ratelimit-remaining']).toBeDefined();
  });
});
