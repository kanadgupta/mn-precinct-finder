const { default: contains } = require('@turf/boolean-point-in-polygon');

const geojson = require('./data/mn-precincts.json');
const precinctData = require('./data/precinct-table-processed.json');

/**
 * Takes in a geographic coordinate and returns all the metadata
 * for the precinct it's contained in.
 * @param {Object} coordinates Either a GeoJSON point or a longitude/latitude array
 * @returns An object containing all the precinct properties
 * @example findPrecinct([-93.2497537, 45.013565]);
 * @example findPrecinct({ type: 'Point', coordinates: [-93.2497537, 45.013565] });
 */
module.exports = function findPrecinct(coordinates) {
  const precinctMatches = geojson.features.filter(feature => contains(coordinates, feature));

  if (precinctMatches.length !== 1) throw new Error('Unable to find a precinct match');

  const { properties } = precinctMatches[0];
  const additionalProperties = precinctData[properties.PrecinctID];

  // We're doing a weird filtering thing here.
  // We have several values listed twice, so we're just going to
  // remove any keys from the `additionalProperties` object
  // that are already listed in the original `properties` object.

  // TODO: this is disgusting and bad and you should feel bad...
  // just extract properties from `additionalProperties` and call it a day!
  const everything = { ...properties, ...additionalProperties };

  delete everything['County Name'];
  delete everything['County Code'];
  delete everything['Precinct Name'];
  delete everything.Congressional;
  delete everything.Senate;
  delete everything.Legislative;
  delete everything.Commissioner;

  // Now, we need to remove spaces from a few leftover keys:
  everything.SoilAndWater = everything['Soil and Water'];
  delete everything['Soil and Water'];
  everything.PrecinctCode = everything['Precinct Code'];
  delete everything['Precinct Code'];
  everything.MCDCode = everything['MCD Code'];
  delete everything['MCD Code'];
  everything.MCDName = everything['MCD Name'];
  delete everything['MCD Name'];

  return everything;
};
