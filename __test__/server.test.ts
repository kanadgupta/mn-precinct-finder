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

      await expect(response.json()).resolves.toStrictEqual({
        address: '2506 Central Ave NE, Minneapolis, MN 55418',
        gmaps: 'https://www.google.com/maps/search/?api=1&query=2506+Central+Ave+NE%2C+Minneapolis%2C+MN+55418',
        mplsPollingPlace21: {
          address: '1320 29th Ave NE',
          building: 'Audubon Park Recreation Center',
          directions: '',
          gmapsUrl:
            'https://www.google.com/maps/search/?api=1&query=Audubon+Park+Recreation+Center+1320+29th+Ave+NE&query_place_id=ChIJMzNMT9sts1IRYwD7TCQu1p4',
        },
        precinct: {
          CongDist: '5',
          County: 'Hennepin',
          CountyID: '27',
          CtyComDist: '02',
          Hospital: 'no data',
          Judicial: '04',
          MCDCode: '135',
          MCDName: 'Minneapolis',
          MNLegDist: '60A',
          MNSenDist: '60',
          Park: '1',
          Precinct: 'Minneapolis W-1 P-4',
          PrecinctCode: '1375',
          PrecinctID: '270531375',
          SoilAndWater: 'no data',
          Ward: 'W-01',
        },
        type: 'success',
      });
      expect(response.status).toBe(200);
    });
  });

  describe.todo('GET actual precinct data');
});
