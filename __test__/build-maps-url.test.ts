import { describe, it, expect } from 'vitest';

import buildMapsUrl from '../src/lib/build-maps-url';

describe('#buildMapsUrl', () => {
  it('should return URL with place ID if it is passed', () => {
    expect(buildMapsUrl('123 Main St', 'test_id')).toBe(
      'https://www.google.com/maps/search/?api=1&query=123+Main+St&query_place_id=test_id',
    );
  });

  it('should return URL without place ID if none is passed', () => {
    expect(buildMapsUrl('123 Main St')).toBe('https://www.google.com/maps/search/?api=1&query=123+Main+St');
  });
});
