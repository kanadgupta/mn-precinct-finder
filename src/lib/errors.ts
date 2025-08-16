import type { GeocodeResult } from '@googlemaps/google-maps-services-js';
import type { StatusCode } from 'hono/utils/http-status';

import shortenAddress from './shorten-address.js';

export default class GeocodingError extends Error {
  public addresses: { href: string; text: string }[];

  public query: string;

  public status: StatusCode;

  public suggestion: string;

  constructor(results: GeocodeResult[], query: string, opts: { message?: string; status?: StatusCode } = {}) {
    let message;
    let suggestion = '';
    let status = opts.status ?? 404;

    if (results.length < 1) {
      message = `We weren't able to find any addresses in Minnesota for '${query}'.`;
    }

    if (results.length > 1) {
      message = `We found multiple matches for '${query}'.`;
      status = 400;
      suggestion = 'Did you mean one of these ones?';
    }

    // Creates an object that contains a URL and a parameter
    const addresses = results.map(result => {
      const address = result.formatted_address;
      const text = shortenAddress(address);
      const href = `?${new URLSearchParams({ address }).toString()}`;
      return { href, text };
    });

    super(opts.message ?? message);

    this.name = 'GeocodingError';
    this.addresses = addresses;
    this.query = query;
    this.status = status;
    this.suggestion = suggestion;
    Object.setPrototypeOf(this, GeocodingError.prototype);
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      query: this.query,
      suggestions: this.addresses.map(address => address.text),
    };
  }
}
