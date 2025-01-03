import { describe, it, expect } from 'vitest';

const precinctData = require('../lib/data/mn-precincts.json');
const pollingPlacesData = require('../lib/data/mpls-2021-polling-places.json');
const getPollingPlace = require('../lib/get-polling-place');

describe('#getPollingPlace', () => {
  it('should retrieve polling place data for valid precinct name', () => {
    expect(getPollingPlace('Minneapolis W-01 P-03')).toStrictEqual({
      address: '2955 Hayes St NE',
      building: 'Northeast Middle School',
      directions: 'enter via side/rear off 29th Ave NE',
      gmapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Northeast+Middle+School+2955+Hayes+St+NE&query_place_id=ChIJf6uXUNAts1IRx9gO5VPsm0M',
    });
  });

  it('should retrieve polling place data for valid precinct name with zeros', () => {
    expect(getPollingPlace('Minneapolis W-01 P-03')).toStrictEqual({
      address: '2955 Hayes St NE',
      building: 'Northeast Middle School',
      directions: 'enter via side/rear off 29th Ave NE',
      gmapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Northeast+Middle+School+2955+Hayes+St+NE&query_place_id=ChIJf6uXUNAts1IRx9gO5VPsm0M',
    });
  });

  it('should return fallback for invalid precinct name', () => {
    expect(getPollingPlace('Minneapolis W-1000')).toStrictEqual({});
  });
});

describe('polling place data', () => {
  const precinctKeys = Object.keys(pollingPlacesData);

  it.each(precinctKeys)('precinct %s exists in geojson data', key => {
    expect(
      precinctData.features.some(
        feature =>
          feature.properties.Precinct === key ||
          feature.properties.Precinct.replace(/W-0/g, 'W-').replace(/P-0/g, 'P-') === key,
      ),
    ).toBe(true);
  });

  it.todo('should check if all the Minneapolis precincts in the MN data exist in the polling place list');
});
