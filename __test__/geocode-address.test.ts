import nock from 'nock';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { forwardGeocode, reverseGeocode } from '../src/lib/geocode-address.js';

describe('#forwardGeocode', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  it('should return valid data for valid query', async () => {
    nock('https://maps.googleapis.com:443')
      .get('/maps/api/geocode/json')
      .query(true)
      .reply(200, {
        results: [
          {
            formatted_address: 'some formatted address',
            geometry: {
              location: { lat: 44.9778, lng: -93.265 },
              location_type: 'ROOFTOP',
            },
            place_id: 'test',
          },
        ],
        status: 'OK',
      });

    await expect(forwardGeocode({ GOOGLE_MAPS_API_KEY: '' }, 'unformatted address')).resolves.toMatchSnapshot();
  });

  it('should throw if response returns empty results', async () => {
    nock('https://maps.googleapis.com:443').get('/maps/api/geocode/json').query(true).reply(200, {
      results: [],
      status: 'ZERO_RESULTS',
    });

    await expect(forwardGeocode({ GOOGLE_MAPS_API_KEY: '' }, 'zero results address')).rejects.toMatchInlineSnapshot(
      "[GeocodingError: We weren't able to find any addresses in Minnesota for 'zero results address'.]",
    );
  });

  it('should throw if response is unknown error', async () => {
    nock('https://maps.googleapis.com:443').get('/maps/api/geocode/json').query(true).reply(400, {
      error_message: 'some error message',
      status: 'UNKNOWN_ERROR',
    });

    await expect(forwardGeocode({ GOOGLE_MAPS_API_KEY: '' }, 'unknown error address')).rejects.toMatchInlineSnapshot(
      '[GeocodingError: Our geocoder ran into an unexpected issue (Request failed with status code 400)]',
    );
  });

  it('should throw if none of the results are of the rooftop location type', async () => {
    nock('https://maps.googleapis.com:443')
      .get('/maps/api/geocode/json')
      .query(true)
      .reply(200, {
        results: [
          {
            formatted_address: 'some formatted address',
            geometry: {
              location: { lat: 44.9778, lng: -93.265 },
              location_type: 'RANGE_INTERPOLATED',
            },
            place_id: 'test',
          },
        ],
        status: 'OK',
      });

    await expect(forwardGeocode({ GOOGLE_MAPS_API_KEY: '' }, 'non-rooftop address')).rejects.toMatchInlineSnapshot(
      "[GeocodingError: We weren't able to find any addresses in Minnesota for 'non-rooftop address'.]",
    );
  });

  it('should throw if geocoded result does not yield a precinct (i.e. outside of MN)', async () => {
    nock('https://maps.googleapis.com:443')
      .get('/maps/api/geocode/json')
      .query(true)
      .reply(200, {
        results: [
          {
            formatted_address: 'some formatted address',
            geometry: {
              location: { lat: 0, lng: 0 },
              location_type: 'ROOFTOP',
            },
            place_id: 'test',
          },
        ],
        status: 'OK',
      });

    await expect(forwardGeocode({ GOOGLE_MAPS_API_KEY: '' }, 'non-MN address')).rejects.toMatchInlineSnapshot(
      "[GeocodingError: We weren't able to find any addresses in Minnesota for 'non-MN address'.]",
    );
  });

  it('should throw if multiple valid results', async () => {
    const results = [
      {
        formatted_address: 'some formatted address',
        geometry: {
          location: { lat: 44.9778, lng: -93.265 },
          location_type: 'ROOFTOP',
        },
        place_id: 'test',
      },
      {
        formatted_address: 'another formatted address',
        geometry: {
          location: { lat: 44.9778, lng: -93.265 },
          location_type: 'ROOFTOP',
        },
        place_id: 'test-again',
      },
    ];

    nock('https://maps.googleapis.com:443').get('/maps/api/geocode/json').query(true).reply(200, {
      results,
      status: 'OK',
    });

    await expect(forwardGeocode({ GOOGLE_MAPS_API_KEY: '' }, 'non-MN address')).rejects.toMatchInlineSnapshot(
      "[GeocodingError: We found multiple matches for 'non-MN address'.]",
    );
  });
});

describe('#reverseGeocode', () => {
  it('should properly reverse geocode result', async () => {
    nock('https://maps.googleapis.com:443')
      .get('/maps/api/geocode/json')
      .query(true)
      .reply(200, {
        results: [
          {
            formatted_address: 'a reverse geocoded address',
            geometry: {
              location: { lat: 0, lng: 0 },
              location_type: 'ROOFTOP',
            },
            place_id: 'test',
          },
        ],
        status: 'OK',
      });

    await expect(reverseGeocode({ GOOGLE_MAPS_API_KEY: '' }, 0, 0)).resolves.toMatchSnapshot();
  });
});
