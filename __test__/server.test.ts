import nock from 'nock';
import { format } from 'prettier';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import app from '../src/server.js';

const browserUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const curlUserAgent = 'curl/8.7.1';

// example google sheets user agent
const googleSheetsUserAgent = 'Mozilla/5.0 (compatible; GoogleDocs; apps-spreadsheets; +http://docs.google.com)';

describe('server tests', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('GET /', () => {
    it('should return 200 with standard template', async () => {
      const response = await app.request('/', {
        method: 'GET',
        headers: { 'user-agent': browserUserAgent },
      });

      const formatted = await format(await response.text(), { parser: 'html' });
      expect(formatted).toMatchSnapshot();
      expect(response.status).toBe(200);
    });

    it('should return 200 with standard template for google sheets user agent', async () => {
      const response = await app.request('/', {
        method: 'GET',
        headers: { 'user-agent': googleSheetsUserAgent },
      });

      const formatted = await format(await response.text(), { parser: 'html' });
      expect(formatted).toMatchSnapshot();
      expect(response.status).toBe(200);
    });

    it('should return 200 with JSON for curl user-agent', async () => {
      const response = await app.request('/', {
        method: 'GET',
        headers: { 'user-agent': curlUserAgent },
      });

      const formatted = await response.json();
      expect(formatted).toStrictEqual({});
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

      const formatted = await format(await response.text(), { parser: 'html' });
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

  describe('GET actual precinct data', () => {
    it('should return 200 for valid mpls precinct with no polling place', async () => {
      const mock = nock('https://maps.googleapis.com:443')
        .get('/maps/api/geocode/json')
        .query(true)
        .reply(200, {
          results: [
            {
              formatted_address: 'some formatted address',
              geometry: {
                // precinct 7-11, which doesn't have a polling place since it wasn't a thing back in 2021
                location: { lat: 44.9778, lng: -93.265 },
                location_type: 'ROOFTOP',
              },
              place_id: 'test',
            },
          ],
          status: 'OK',
        });

      const response = await app.request('/?address=unformatted+address', {
        method: 'GET',
        headers: { 'user-agent': browserUserAgent },
      });

      mock.done();

      const formatted = await format(await response.text(), { parser: 'html' });
      expect(formatted).toMatchSnapshot();
      expect(response.status).toBe(200);
    });

    it('should return 200 for valid mpls precinct with polling place', async () => {
      const mock = nock('https://maps.googleapis.com:443')
        .get('/maps/api/geocode/json')
        .query(true)
        .reply(200, {
          results: [
            {
              formatted_address: 'some formatted address',
              geometry: {
                location: { lat: 44.967, lng: -93.28 },
                location_type: 'ROOFTOP',
              },
              place_id: 'test',
            },
          ],
          status: 'OK',
        });

      const response = await app.request('/?address=unformatted+address', {
        method: 'GET',
        headers: { 'user-agent': browserUserAgent },
      });

      mock.done();

      const formatted = await format(await response.text(), { parser: 'html' });
      expect(formatted).toMatchSnapshot();
      expect(response.status).toBe(200);
    });

    it.todo('should return 404 for invalid mpls precinct');

    it.todo('should handle 403 errors gracefully');
  });
});
