# TODO 🚧

- [x] Implement GeoJSON precinct finder via [`@turf`](https://www.npmjs.com/package/@turf/boolean-point-in-polygon)
- [x] Add workflow for syncing changes to Glitch
- [x] Geocoding functionality via Mapbox(?) API
- [x] Add endpoint for Twilio
- [x] (sigh) Migrate to Google Maps Geocoder so we can link out to Google Maps... links:
  - [Server-side API](https://developers.google.com/maps/documentation/geocoding/overview)
  - [Client-side Autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete)
  - [Maps URL Reference](https://developers.google.com/maps/documentation/urls/get-started)
- [ ] Remove reverse geocoder, link to coordinates instead
- [ ] Add address verification prior to running through geocoder to sanitize geocoder API requests
- [ ] Add support for Google Sheets user-agent
- [ ] [Schema Validation](https://www.fastify.io/docs/latest/Validation-and-Serialization/)
- [ ] OpenAPI generation via [`fastify-swagger`](https://github.com/fastify/fastify-swagger)
- [ ] JSON Schema Validation for processed data file(s)
- [ ] Docs on ReadMe! :owl:
- [ ] Unit tests for `findPrecinct` and `geocodeAddress` functions
- [ ] Enhance error handling for `findPrecinct`

## Nice To have
- [ ] Address autocomplete via Google Maps Places API
