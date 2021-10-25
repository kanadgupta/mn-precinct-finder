const buildMapsUrl = require('./build-maps-url');
const data = require('./data/mpls-2021-polling-places.json');

/**
 * Retrieves polling place.
 * @param {String} precinct The precinct name, as listed in the `Precinct` field in mn-precincts.json
 * @returns {Object} an object containing the polling place object
 * @link Place ID lookup site: https://developers.google.com/maps/documentation/places/web-service/place-id
 */
module.exports = function getPollingPlace(precinct) {
  const pollingPlace = data[precinct] || {};
  if (Object.keys(pollingPlace).length) {
    const { address, building, gmapsPlaceId } = pollingPlace;
    delete pollingPlace.gmapsPlaceId;
    pollingPlace.gmapsUrl = buildMapsUrl(`${building} ${address}`, gmapsPlaceId);
  }
  return pollingPlace;
};
