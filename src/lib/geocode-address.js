require('dotenv').config();
const { Client } = require('@googlemaps/google-maps-services-js');

const buildMapsUrl = require('./build-maps-url');
const { GeocodingError } = require('./errors');
const findPrecinct = require('./find-precinct');
const shortenAddress = require('./shorten-address');

const googlemaps = new Client({});
const key = process.env.GOOGLE_MAPS_API_KEY;

module.exports.forwardGeocode = function forward(address) {
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
      } catch (err) {
        throw new GeocodingError([], address);
      }
      const gmaps = buildMapsUrl(formattedAddress, placeId);

      return { address: shortenAddress(formattedAddress), gmaps, precinct };
    });
};

module.exports.reverseGeocode = function reverse(long, lat) {
  return googlemaps
    .reverseGeocode({
      params: {
        key,
        latlng: `${lat}, ${long}`,
        location_type: 'ROOFTOP',
      },
    })
    .then(({ data }) => {
      const { results } = data;

      const { formatted_address: formattedAddress, place_id: placeId } = results[0];
      const gmaps = buildMapsUrl(formattedAddress, placeId);

      return { address: shortenAddress(formattedAddress), gmaps };
    });
};
