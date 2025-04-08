import nock from 'nock';
import { describe, it, expect } from 'vitest';

import { forwardGeocode, reverseGeocode } from '../src/lib/geocode-address.js';

describe('#forwardGeocode', () => {
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

    await expect(forwardGeocode('', 'unformatted address')).resolves.toStrictEqual({
      address: 'some formatted address',
      gmaps: 'https://www.google.com/maps/search/?api=1&query=some+formatted+address&query_place_id=test',
      precinct: {
        Precinct: 'Minneapolis W-7 P-11',
        PrecinctID: '270531705',
        County: 'Hennepin',
        CountyID: '27',
        CongDist: '5',
        MNSenDist: '59',
        MNLegDist: '59B',
        CtyComDist: '03',
        Hospital: 'no data',
        Judicial: '04',
        MCDCode: '135',
        MCDName: 'Minneapolis',
        Park: '4',
        PrecinctCode: '1705',
        SoilAndWater: 'no data',
        Ward: 'W-07',
      },
      type: 'success',
    });
  });

  it('should throw if response returns empty results', async () => {
    nock('https://maps.googleapis.com:443').get('/maps/api/geocode/json').query(true).reply(200, {
      results: [],
      status: 'ZERO_RESULTS',
    });

    await expect(forwardGeocode('', 'zero results address')).rejects.toMatchInlineSnapshot(
      "[GeocodingError: We weren't able to find any addresses in Minnesota for 'zero results address'.]",
    );
  });

  it('should throw if response is unknown error', async () => {
    nock('https://maps.googleapis.com:443').get('/maps/api/geocode/json').query(true).reply(400, {
      error_message: 'some error message',
      status: 'UNKNOWN_ERROR',
    });

    await expect(forwardGeocode('', 'unknown error address')).rejects.toMatchInlineSnapshot(
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

    await expect(forwardGeocode('', 'non-rooftop address')).rejects.toMatchInlineSnapshot(
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

    await expect(forwardGeocode('', 'non-MN address')).rejects.toMatchInlineSnapshot(
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

    await expect(forwardGeocode('', 'non-MN address')).rejects.toMatchInlineSnapshot(
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

    await expect(reverseGeocode('', 0, 0)).resolves.toStrictEqual({
      address: 'a reverse geocoded address',
      gmaps: 'https://www.google.com/maps/search/?api=1&query=a+reverse+geocoded+address&query_place_id=test',
    });
  });
});
