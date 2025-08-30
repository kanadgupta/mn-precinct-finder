import { describe, expect, it } from 'vitest';

import precinctData from '../src/lib/data/mn-precincts.json' with { type: 'json' };
import pollingPlacesData from '../src/lib/data/mpls-2021-polling-places.json' with { type: 'json' };
import getPollingPlace from '../src/lib/get-polling-place.js';

describe('#getPollingPlace', () => {
  it('should retrieve polling place data for valid precinct name', () => {
    expect(getPollingPlace('Minneapolis W-1 P-3')).toMatchSnapshot();
  });

  it('should retrieve polling place data for valid precinct name with zeros', () => {
    expect(getPollingPlace('Minneapolis W-1 P-3')).toMatchSnapshot();
  });

  it('should return fallback for invalid precinct name', () => {
    expect(getPollingPlace('Minneapolis W-1000')).toBeNull();
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
