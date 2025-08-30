import { describe, expect, it } from 'vitest';

import findPrecinct from '../src/lib/find-precinct.js';

describe('#findPrecinct', () => {
  it('should return precinct data if passed as array', () => {
    const precinct = findPrecinct([-93.265, 44.9778]);
    expect(precinct).toMatchSnapshot();
  });

  it('should return precinct data if passed as geojson coordinate', () => {
    const precinct = findPrecinct({ type: 'Point', coordinates: [-93.265, 44.9778] });
    expect(precinct).toMatchSnapshot();
  });

  it('should throw error if non-Minnesota coordinates are passed', () => {
    expect(() => findPrecinct({ type: 'Point', coordinates: [0, 0] })).toThrow('Unable to find a precinct match');
  });

  it('should throw error if total garbage is passed', () => {
    // @ts-expect-error deliberately passing invalid data
    expect(() => findPrecinct(['yo'])).toThrow('coordinates must be at least 2 numbers long');
  });
});
