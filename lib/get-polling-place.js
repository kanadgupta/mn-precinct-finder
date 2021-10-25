const data = require('./data/mpls-2021-polling-places.json');

/**
 * Retrieves polling place.
 * @param {String} precinct The precinct name, as listed in the `Precinct` field in mn-precincts.json
 * @returns {Object} an object containing the polling place object
 */
module.exports = function getPollingPlace(precinct) {
  return data[precinct] || {};
};
