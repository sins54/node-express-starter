import request from 'supertest';
import app from '../src/app.js';

describe('Security Middleware', () => {
  describe('Helmet', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/api/v1/health');

      // Helmet sets various security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });

  describe('HPP (HTTP Parameter Pollution)', () => {
    it('should handle duplicate query parameters', async () => {
      const response = await request(app).get('/api/v1/health?test=1&test=2');

      expect(response.status).toBe(200);
    });
  });
});

describe('Swagger Documentation', () => {
  it('should serve Swagger UI at /api-docs', async () => {
    const response = await request(app).get('/api-docs/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('swagger');
  });
});
