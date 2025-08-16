import * as prettier from 'prettier';
import { describe, it, expect } from 'vitest';

import app from '../src/server.js';

const browserUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

describe('server tests', () => {
  describe('GET /', () => {
    it('should return 200 with standard template', async () => {
      const response = await app.request('/', {
        method: 'GET',
        headers: { 'user-agent': browserUserAgent },
      });

      const formatted = await prettier.format(await response.text(), { parser: 'html' });
      expect(formatted).toMatchSnapshot();
      expect(response.status).toBe(200);
    });

    it('should return 200 when requesting JSON via query param (browser user agent)', async () => {
      const response = await app.request('/?format=json', {
        method: 'GET',
        headers: { 'user-agent': browserUserAgent },
      });

      await expect(response.text()).resolves.toBe('{}');
      expect(response.status).toBe(200);
    });

    it('should return 200 when requesting JSON via query param (no user agent)', async () => {
      const response = await app.request('/?format=json', {
        method: 'GET',
      });

      await expect(response.text()).resolves.toBe('{}');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /?example=go', () => {
    it('should return 200 with standard template', async () => {
      const response = await app.request('/?example=go', {
        method: 'GET',
        headers: { 'user-agent': browserUserAgent },
      });

      const formatted = await prettier.format(await response.text(), { parser: 'html' });
      expect(formatted).toMatchSnapshot();
      expect(response.status).toBe(200);
    });

    it('should return 200 when requesting JSON', async () => {
      const response = await app.request('/?example=go', {
        method: 'GET',
      });

      await expect(response.json()).resolves.toMatchSnapshot();
      expect(response.status).toBe(200);
    });
  });

  describe.todo('GET actual precinct data');
});
