import shortenAddress from './shorten-address.js';

const GeocodingError = class extends Error {
  public addresses: { href: string; text: string }[];

  public query: string;

  public status: number;

  public suggestion: string;

  public toJSON: () => {
    error: string;
    message: string;
    query: string;
    suggestions: string[];
  };

  constructor(results, query) {
    let message;
    let suggestion = '';
    let status = 404;

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

    super(message);

    this.name = 'GeocodingError';
    this.addresses = addresses;
    this.query = query;
    this.status = status;
    this.suggestion = suggestion;
  }
};

GeocodingError.prototype.toJSON = function toJSON() {
  return {
    error: this.name,
    message: this.message,
    query: this.query,
    suggestions: this.addresses.map(address => address.text),
  };
};

export default GeocodingError;
