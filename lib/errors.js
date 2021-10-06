const shortenAddress = require('./shorten-address');

module.exports.GeocodingError = class extends Error {
  constructor(results, query) {
    let message;
    let suggestion = '';
    let status = 404;

    if (results.length < 1) {
      message = `We weren't able to find any addresses in Minneapolis for '${query}'.`;
    }

    if (results.length > 1) {
      message = `We found multiple matches for '${query}'.`;
      status = 400;
      suggestion = 'Did you mean one of these ones?';
    }

    // Creates an object that contains a URL and a parameter
    const addresses = results.map(result => {
      const [long, lat] = result.center;
      const text = shortenAddress(result.place_name);
      const href = `?${new URLSearchParams({ long, lat }).toString()}`;
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

module.exports.GeocodingError.prototype.toJSON = function () {
  return {
    error: this.name,
    message: this.message,
    query: this.query,
    suggestions: this.addresses.map(address => address.text),
  };
};
