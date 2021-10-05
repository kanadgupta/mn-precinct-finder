const { default: contains } = require('@turf/boolean-point-in-polygon');

const geojson = require('./data/mn-precincts.json');
const precinctData = require('./data/precinct-table-processed.json');

module.exports = function findPrecinct(coordinates) {
  const precinctMatches = geojson.features.filter(feature => contains(coordinates, feature));

  if (precinctMatches.length > 1) throw new Error('Big fucking yikes');
  if (precinctMatches.length < 1) throw new Error('No precinct found');

  const { properties } = precinctMatches[0];
  const additionalProperties = precinctData[properties.PrecinctID];

  // We're doing a weird filtering thing here.
  // We have several values listed twice, so we're just going to
  // remove any keys from the `additionalProperties` object
  // that are already listed in the original `properties` object.
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
