import { describe, it, expect } from 'vitest';

const findPrecinct = require('../src/lib/find-precinct');

describe('#findPrecinct', () => {
  it('should return precinct data if passed as array', () => {
    const precinct = findPrecinct([-93.265, 44.9778]);
    expect(precinct).toStrictEqual({
      Precinct: 'Minneapolis W-7 P-11',
      PrecinctID: '270531705',
      County: 'Hennepin',
      CountyID: '27',
      CongDist: '5',
      MNSenDist: '59',
      MNLegDist: '59B',
      CtyComDist: '03',
      Hospital: undefined,
      Judicial: '04',
      MCDCode: '135',
      MCDName: 'Minneapolis',
      Park: '4',
      PrecinctCode: '1705',
      SoilAndWater: undefined,
      Ward: 'W-07',
    });
  });

  it('should return precinct data if passed as geojson coordinate', () => {
    const precinct = findPrecinct({ type: 'Point', coordinates: [-93.265, 44.9778] });
    expect(precinct).toStrictEqual({
      Precinct: 'Minneapolis W-7 P-11',
      PrecinctID: '270531705',
      County: 'Hennepin',
      CountyID: '27',
      CongDist: '5',
      MNSenDist: '59',
      MNLegDist: '59B',
      CtyComDist: '03',
      Hospital: undefined,
      Judicial: '04',
      MCDCode: '135',
      MCDName: 'Minneapolis',
      Park: '4',
      PrecinctCode: '1705',
      SoilAndWater: undefined,
      Ward: 'W-07',
    });
  });

  it('should throw error if non-Minnesota coordinates are passed', () => {
    expect(() => findPrecinct({ type: 'Point', coordinates: [0, 0] })).toThrow('Unable to find a precinct match');
  });

  it('should throw error if total garbage is passed', () => {
    expect(() => findPrecinct(['yo'])).toThrow('coordinates must be at least 2 numbers long');
  });
});
