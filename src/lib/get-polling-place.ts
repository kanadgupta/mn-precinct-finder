import buildMapsUrl from './build-maps-url.js';
import data from './data/mpls-2021-polling-places.json' with { type: 'json' };

export type PollingPlace = {
  address: string;
  building: string;
  directions: string;
  gmapsUrl: string;
} | null;

/**
 * Retrieves polling place.
 * @param {String} precinct The precinct name, as listed in the `Precinct` field in mn-precincts.json
 * @returns {Object} an object containing the polling place object
 * @link Place ID lookup site: https://developers.google.com/maps/documentation/places/web-service/place-id
 */
export default function getPollingPlace(precinct: string): PollingPlace {
  const alternativePrecinctSpelling = precinct.replace(/W-0/g, 'W-').replace(/P-0/g, 'P-') as keyof typeof data;
  const pollingPlace = data[precinct as keyof typeof data] || data[alternativePrecinctSpelling];
  if (pollingPlace && Object.keys(pollingPlace).length) {
    const { address, building, directions, gmapsPlaceId } = pollingPlace;
    const gmapsUrl = buildMapsUrl(`${building} ${address}`, gmapsPlaceId);
    // The reason we recreate the object is because deleting properties
    // would cause weird bugs where the place ID would be undefined
    // when constructing the maps URL.
    return { address, building, directions, gmapsUrl } satisfies PollingPlace;
  }
  return null;
}
