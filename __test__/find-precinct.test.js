const findPrecinct = require('../lib/find-precinct');

describe('#findPrecinct', () => {
  it('should return precinct data if passed as array', () => {
    const precinct = findPrecinct([-93.265, 44.9778]);
    expect(precinct).toStrictEqual({
      CongDist: '5',
      County: 'Hennepin',
      CountyID: '27',
      CtyComDist: '4',
      Hospital: 'no data',
      Judicial: '04',
      MCDCode: '135',
      MCDName: 'Minneapolis',
      MNLegDist: '59B',
      MNSenDist: '59',
      Park: '4',
      Precinct: 'Minneapolis W-3 P-9',
      PrecinctCode: '1500',
      PrecinctID: '270531500',
      SoilAndWater: 'no data',
      Ward: 'W-03',
    });
  });

  it('should return precinct data if passed as geojson coordinate', () => {
    const precinct = findPrecinct({ type: 'Point', coordinates: [-93.265, 44.9778] });
    expect(precinct).toStrictEqual({
      CongDist: '5',
      County: 'Hennepin',
      CountyID: '27',
      CtyComDist: '4',
      Hospital: 'no data',
      Judicial: '04',
      MCDCode: '135',
      MCDName: 'Minneapolis',
      MNLegDist: '59B',
      MNSenDist: '59',
      Park: '4',
      Precinct: 'Minneapolis W-3 P-9',
      PrecinctCode: '1500',
      PrecinctID: '270531500',
      SoilAndWater: 'no data',
      Ward: 'W-03',
    });
  });

  it('should throw error if non-Minnesota coordinates are passed', () => {
    expect(() => findPrecinct({ type: 'Point', coordinates: [0, 0] })).toThrow('Unable to find a precinct match');
  });

  it('should throw error if total garbage is passed', () => {
    expect(() => findPrecinct(['yo'])).toThrow('coord must be GeoJSON Point or an Array of numbers');
  });
});
