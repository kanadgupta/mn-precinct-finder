require('dotenv').config();
const unionBustingTrash = require('@mapbox/mapbox-sdk/services/geocoding');
const { GeocodingError } = require('./errors');
const findPrecinct = require('./find-precinct');
const shortenAddress = require('./shorten-address');

const geocodingClient = unionBustingTrash({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

function extractResults(response) {
  let results = response.body.features.filter(
    feature => feature.relevance === 1 && feature.address && feature.properties.accuracy !== 'approximate'
  );

  // If perfect matches are found, widen threshold to 75% relevance threshold or higher
  if (!results.length) results = response.body.features.filter(feature => feature.relevance >= 0.75 && feature.address);

  return results;
}

module.exports.forwardGeocode = function forward(query) {
  return (
    geocodingClient
      // Docs on parameters: https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#parameters-41
      .forwardGeocode({
        query,
        // Bounding box for Minneapolis (via my eye-balling on Google Maps)
        // Source: https://www.mngeo.state.mn.us/chouse/coordinates.html
        bbox: [-93.330446, 44.889222, -93.20494, 45.055223],
        // Focus results in center of Minneapolis
        // According to Google this is the center?
        proximity: [-93.265, 44.9778],
        // filter for addresses
        types: ['address'],
        // We're assuming every input is complete
        autocomplete: false,
      })
      .send()
      .then(response => {
        const results = extractResults(response);

        // If at this point we have one of the following:
        // - multiple perfect matches
        // - multiple imperfect matches
        // - no matches whatsoever
        // we throw an error!
        if (results.length !== 1) throw new GeocodingError(results, query);

        // Blame the union busters for this camelcase trash, not me!
        // eslint-disable-next-line camelcase
        const { geometry, place_name } = results[0];

        const precinct = findPrecinct(geometry);
        return { precinct, address: shortenAddress(place_name) };
      })
  );
};

module.exports.reverseGeocode = function reverse(long, lat) {
  let query = [];
  try {
    query = [parseFloat(long), parseFloat(lat)];
  } catch (e) {
    throw new Error(e.message);
  }

  return (
    geocodingClient
      // Docs on parameters: https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#parameters-42
      .reverseGeocode({
        query,
        types: ['address'],
      })
      .send()
      .then(response => {
        const results = extractResults(response);
        // TODO: add some sort of check + error-handling for results
        return shortenAddress(results[0].place_name);
      })
  );
};
