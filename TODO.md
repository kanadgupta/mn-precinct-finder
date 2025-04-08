# TODO 🚧

- [x] Implement GeoJSON precinct finder via [`@turf`](https://www.npmjs.com/package/@turf/boolean-point-in-polygon)
- [x] Add workflow for syncing changes to Glitch
- [x] Geocoding functionality via Mapbox(?) API
- [x] Add endpoint for Twilio
- [x] (sigh) Migrate to Google Maps Geocoder so we can link out to Google Maps... links:
  - [Server-side API](https://developers.google.com/maps/documentation/geocoding/overview)
  - [Client-side Autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete)
  - [Maps URL Reference](https://developers.google.com/maps/documentation/urls/get-started)
- [x] Unit tests for `findPrecinct` and `geocodeAddress` functions
- [x] [Schema Validation](https://www.fastify.io/docs/latest/Validation-and-Serialization/)
- [x] OpenAPI generation via [`fastify-swagger`](https://github.com/fastify/fastify-swagger)
- [x] Docs on ReadMe! :owl:
- [ ] Remove reverse geocoder, link to coordinates instead
- [ ] Separate coordinates and example into separate endpoints
- [ ] Add address verification prior to running through geocoder to sanitize geocoder API requests
- [ ] Add support for Google Sheets user-agent
- [ ] JSON Schema Validation for processed data file(s)
- [ ] Enhance error handling for `findPrecinct`

## Post-Hono Migration

- [ ] Bring back the OpenAPI generation workflow (removed in 58950b26c62fdea5e90d0d6068ad3454c86baa46)

## Nice To have

- [ ] Address autocomplete via Google Maps Places API
