const { default: contains } = require('@turf/boolean-point-in-polygon');

const geojson = require('./data/mn-precincts.json');
const precinctData = require('./data/precinct-table-processed.json');

/**
 * Takes in a geographic coordinate and returns all the metadata
 * for the precinct it's contained in.
 * @param {Object} coordinates Either a GeoJSON point or a longitude/latitude array
 * @returns An object containing all the precinct properties
 * @example findPrecinct([-93.265, 44.9778]);
 * @example findPrecinct({ type: 'Point', coordinates: [-93.265, 44.9778] });
 */
module.exports = function findPrecinct(coordinates) {
  const precinctMatches = geojson.features.filter(feature => contains(coordinates, feature));

  if (precinctMatches.length !== 1) throw new Error('Unable to find a precinct match');

  const { properties } = precinctMatches[0];
  const additionalProperties = precinctData[properties.PrecinctID];

  // Extracts everything from main GeoJSON file and
  // adds several additional properties from precinct table file
  const everything = properties;
  everything.Hospital = additionalProperties.Hospital;
  everything.Judicial = additionalProperties.Judicial;
  everything.MCDCode = additionalProperties['MCD Code'];
  everything.MCDName = additionalProperties['MCD Name'];
  everything.Park = additionalProperties.Park;
  everything.PrecinctCode = additionalProperties['Precinct Code'];
  everything.SoilAndWater = additionalProperties['Soil and Water'];
  everything.Ward = additionalProperties.Ward;

  return everything;
};
