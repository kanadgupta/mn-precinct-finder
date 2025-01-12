import buildMapsUrl from './build-maps-url.js';
import data from './data/mpls-2021-polling-places.json' with { type: 'json' };

/**
 * Retrieves polling place.
 * @param {String} precinct The precinct name, as listed in the `Precinct` field in mn-precincts.json
 * @returns {Object} an object containing the polling place object
 * @link Place ID lookup site: https://developers.google.com/maps/documentation/places/web-service/place-id
 */
export default function getPollingPlace(precinct) {
  const alternativePrecinctSpelling = precinct.replace(/W-0/g, 'W-').replace(/P-0/g, 'P-');
  let pollingPlace = data[precinct] || data[alternativePrecinctSpelling] || {};
  if (Object.keys(pollingPlace).length) {
    const { address, building, directions, gmapsPlaceId } = pollingPlace;
    const gmapsUrl = buildMapsUrl(`${building} ${address}`, gmapsPlaceId);
    // The reason we recreate the object is because deleting properties
    // would cause weird bugs where the place ID would be undefined
    // when constructing the maps URL.
    pollingPlace = { address, building, directions, gmapsUrl };
  }
  return pollingPlace;
}
