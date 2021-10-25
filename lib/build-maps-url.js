/**
 * A simple helper that returns a formatted Google Maps URL.
 * @param {String} query The query that will be used for the Google Maps result
 * if `placeId` is not present and valid.
 * @param {String} placeId
 * @returns {String} A formatted Google Maps URL.
 * @link https://developers.google.com/maps/documentation/urls/get-started
 */
module.exports = function buildMapsUrls(query, placeId = '') {
  const searchParams = new URLSearchParams({ api: '1', query });
  if (placeId) searchParams.set('query_place_id', placeId);
  const gmaps = new URL('https://www.google.com/maps/search/');
  gmaps.search = searchParams.toString();
  return gmaps.toString();
};
