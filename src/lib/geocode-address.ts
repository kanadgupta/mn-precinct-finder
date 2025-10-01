import { Client, ReverseGeocodingLocationType } from '@googlemaps/google-maps-services-js';
import { getRuntimeKey } from 'hono/adapter';

import buildMapsUrl from './build-maps-url.js';
import GeocodingError from './errors.js';
import findPrecinct, { type ExtendedPrecinctProps } from './find-precinct.js';
import shortenAddress from './shorten-address.js';

const googlemaps = new Client({});

interface GeocodeResult {
  address: string;
  cache: 'HIT' | 'MISS';
  gmaps: string;
  precinct: ExtendedPrecinctProps;
  type: 'success';
}

type GoogleMapsEnv = Pick<Env, 'GOOGLE_MAPS_API_KEY' | 'GOOGLE_MAPS_RESULTS'>;

/**
 * Takes an address string and returns a formatted address, a Google Maps URL, and the corresponding precinct.
 */
export async function forwardGeocode(
  /** The current environment. May or may not contain Cloudflare KV bindings */
  env: GoogleMapsEnv,
  address: string,
): Promise<GeocodeResult> {
  const runtime = getRuntimeKey();

  // if we're on Cloudflare Workers and have a KV binding, check for a cached result and return it if found
  if (runtime === 'workerd' && env.GOOGLE_MAPS_RESULTS) {
    const cached = await env.GOOGLE_MAPS_RESULTS.get(address);
    if (cached) {
      try {
        return { ...JSON.parse(cached), cache: 'HIT' } as GeocodeResult;
      } catch {
        // delete bad record and fetch a new result
        await env.GOOGLE_MAPS_RESULTS.delete(address);
      }
    }
  }

  return googlemaps
    .geocode({
      adapter: 'fetch',
      params: {
        address,
        bounds: { southwest: { lat: 44.889222, lng: -93.330446 }, northeast: { lat: 45.055223, lng: -93.20494 } },
        key: env.GOOGLE_MAPS_API_KEY,
      },
    })
    .then(async ({ data }) => {
      if (data?.status !== 'OK') throw new GeocodingError(data.results || [], address);

      const { results } = data;

      const filtered = results.filter(result => result?.geometry?.location_type === 'ROOFTOP');

      if (filtered.length !== 1) throw new GeocodingError(filtered || [], address);

      const {
        geometry: { location },
        formatted_address: formattedAddress,
        place_id: placeId,
      } = filtered[0];

      try {
        const precinct = findPrecinct([location.lng, location.lat]);
        const gmaps = buildMapsUrl(formattedAddress, placeId);
        const result = {
          address: shortenAddress(formattedAddress),
          cache: 'MISS',
          gmaps,
          precinct,
          type: 'success',
        } as const satisfies GeocodeResult;

        // cache the result if we're on Cloudflare Workers and have a KV binding
        if (runtime === 'workerd' && env.GOOGLE_MAPS_RESULTS) {
          await env.GOOGLE_MAPS_RESULTS.put(address, JSON.stringify(result));
        }
        return result;
      } catch {
        throw new GeocodingError([], address);
      }
    })
    .catch(err => {
      if (err instanceof GeocodingError) throw err;
      throw new GeocodingError([], address, {
        message: `Our geocoder ran into an unexpected issue (${err.message})`,
        status: 500,
      });
    });
}

/**
 * Takes latitude and longitude coordinates and returns a formatted address and a Google Maps URL.
 *
 * @deprecated I don't think we need to support this anymore.
 */
export async function reverseGeocode(
  /** The current environment. May or may not contain Cloudflare KV bindings */
  env: GoogleMapsEnv,
  long: number | string,
  lat: number | string,
) {
  return googlemaps
    .reverseGeocode({
      params: {
        key: env.GOOGLE_MAPS_API_KEY,
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
