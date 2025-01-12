import { Client, ReverseGeocodingLocationType } from '@googlemaps/google-maps-services-js';

import buildMapsUrl from './build-maps-url.js';
import GeocodingError from './errors.js';
import findPrecinct from './find-precinct.js';
import shortenAddress from './shorten-address.js';

const googlemaps = new Client({});
const key = process.env.GOOGLE_MAPS_API_KEY;

export function forwardGeocode(address) {
  return googlemaps
    .geocode({
      params: {
        address,
        bounds: { southwest: { lat: 44.889222, lng: -93.330446 }, northeast: { lat: 45.055223, lng: -93.20494 } },
        key,
      },
    })
    .then(({ data }) => {
      if (data?.status !== 'OK') throw new GeocodingError(data.results || [], address);

      const { results } = data;

      const filtered = results.filter(result => result?.geometry?.location_type === 'ROOFTOP');

      if (filtered.length !== 1) throw new GeocodingError(filtered || [], address);

      const {
        geometry: { location },
        formatted_address: formattedAddress,
        place_id: placeId,
      } = filtered[0];

      let precinct;
      try {
        precinct = findPrecinct([location.lng, location.lat]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        throw new GeocodingError([], address);
      }
      const gmaps = buildMapsUrl(formattedAddress, placeId);

      return { address: shortenAddress(formattedAddress), gmaps, precinct };
    });
}

export function reverseGeocode(long, lat) {
  return googlemaps
    .reverseGeocode({
      params: {
        key,
        latlng: `${lat}, ${long}`,
        location_type: [ReverseGeocodingLocationType.ROOFTOP],
      },
    })
    .then(({ data }) => {
      const { results } = data;

      const { formatted_address: formattedAddress, place_id: placeId } = results[0];
      const gmaps = buildMapsUrl(formattedAddress, placeId);

      return { address: shortenAddress(formattedAddress), gmaps };
    });
}
