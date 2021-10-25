const getPollingPlace = require('../lib/get-polling-place');
const pollingPlacesData = require('../lib/data/mpls-2021-polling-places.json');
const precinctData = require('../lib/data/mn-precincts.json');

describe('#getPollingPlace', () => {
  it('should retrieve polling place data for valid precinct name', () => {
    expect(getPollingPlace('Minneapolis W-1 P-3')).toStrictEqual({
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
    expect(precinctData.features.some(feature => feature.properties.Precinct === key)).toBe(true);
  });
});
