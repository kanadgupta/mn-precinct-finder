/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fastify } from 'fastify';
import fastifyAccepts from 'fastify-accepts';
import fastifyFormbody from 'fastify-formbody';
import fastifyStatic from 'fastify-static';
import fastifySwagger from 'fastify-swagger';
import handlebars from 'handlebars';
import pointOfView from 'point-of-view';

import buildMapsUrl from './lib/build-maps-url.js';
import findPrecinct from './lib/find-precinct.js';
import { forwardGeocode, reverseGeocode } from './lib/geocode-address.js';
import getPollingPlace from './lib/get-polling-place.js';
import seo from './seo.json' assert { type: 'json' };

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

// Instantiate fastify
const app = fastify({
  ignoreTrailingSlash: true,
  logger: false,
});

const env = process.env.NODE_ENV;

// Add support for application/x-www-form-urlencoded
// @ts-expect-error bad plugin type, going to remove this when we migrate to Hono
app.register(fastifyFormbody);

// Setup our static files
// @ts-expect-error bad plugin type, going to remove this when we migrate to Hono
app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/', // optional: default '/'
});

// point-of-view is a templating manager for fastify
// @ts-expect-error bad plugin type, going to remove this when we migrate to Hono
app.register(pointOfView, {
  engine: {
    handlebars,
  },
});

// fastify-accepts parses the Accept header
// @ts-expect-error bad plugin type, going to remove this when we migrate to Hono
app.register(fastifyAccepts);

// @ts-expect-error bad plugin type, going to remove this when we migrate to Hono
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'MPLS Poll Finder API',
      description: 'An API for retrieving MN Precinct Data and Minneapolis Polling Places.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://mpls.vote',
      },
    ],
  },
});

/**
 * Creates default object for usage across various endpoints
 * @param {Object} request The Fastify `request` object
 * @param {*} reply The Fastify `reply` object
 * @returns An object containing the default return data
 */
async function createDefaultParams(request, reply) {
  let params = {};

  if (request.query.lat && request.query.long) {
    const { lat, long } = request.query;
    try {
      const precinct = findPrecinct([long, lat]);
      const { address, gmaps } = await reverseGeocode(long, lat);
      params = {
        address,
        gmaps,
        precinct,
      };
    } catch (e) {
      reply.code(404);
      params = {
        addressError: e.message,
      };
    }
  }

  if (request.query.address) {
    try {
      params = await forwardGeocode(request.query.address);
    } catch (error) {
      reply.code(error.status);
      params = { error };
    }
  }

  if (request.query.example) {
    const address = '2506 Central Ave NE, Minneapolis, MN 55418';
    const precinct = findPrecinct([-93.2497537, 45.013565]);
    const gmaps = buildMapsUrl(address);
    params = { address, gmaps, precinct };
  }

  // @ts-expect-error will revisit this when we migrate to Hono
  if (params?.precinct?.Precinct) {
    // @ts-expect-error will revisit this when we migrate to Hono
    params.mplsPollingPlace21 = getPollingPlace(params.precinct.Precinct);
  }

  return params;
}

function replyWithJsonParams(params, reply) {
  if (params.error) return reply.send({ ...params.error.toJSON() });
  return reply.send(params);
}

const opts = {
  schema: {
    summary: 'Get Precinct Data',
    description: 'Retrieves precinct data',
    querystring: {
      type: 'object',
      properties: {
        address: {
          description:
            'A Minnesota street address to retrieve the precinct data for. For best results, include a full street address and a ZIP code.',
          example: '2505 central ave ne 55418',
          type: 'string',
        },
      },
    },
    response: {
      200: {
        description: 'Successful precinct and polling place response',
        type: 'object',
        properties: {
          address: {
            description: 'A formatted address (formatted by the Google Geocoding API) based on the request parameters',
            example: '2506 Central Ave NE, Minneapolis, MN 55418',
            type: 'string',
          },
          gmaps: {
            description: 'A link to Google Maps for the street address in the `address` parameter.',
            example: 'https://www.google.com/maps/search/?api=1&query=2506+Central+Ave+NE%2C+Minneapolis%2C+MN+55418',
            type: 'string',
          },
          mplsPollingPlace21: {
            description:
              'An object containing data for the Minneapolis polling place. For non-Minneapolis addresses, this will be an empty object.',
            type: 'object',
            properties: {
              address: {
                description: 'The address for the Minneapolis polling place',
                example: '2030 Monroe St NE',
                type: 'string',
              },
              building: {
                description: 'The building for the Minneapolis polling place',
                example: 'Edison High School (Gym lobby)',
                type: 'string',
              },
              directions: {
                description: 'The directions for the Minneapolis polling place',
                example: '',
                type: 'string',
              },
              gmapsUrl: {
                description: 'The gmapsUrl for the Minneapolis polling place',
                example:
                  'https://www.google.com/maps/search/?api=1&query=Edison+High+School+%28Gym+lobby%29+2030+Monroe+St+NE&query_place_id=ChIJx58zzJIts1IRDTGIN8Fm7tk',
                type: 'string',
              },
            },
          },
          precinct: {
            description: 'An object containing Minnesota electoral boundaries.',
            type: 'object',
            properties: {
              CongDist: { description: 'U.S. Congressional District', example: '5', type: 'string' },
              County: { description: 'County', example: 'Hennepin', type: 'string' },
              CountyID: { description: 'County ID', example: '27', type: 'string' },
              CtyComDist: { description: 'County Commissioner District', example: '2', type: 'string' },
              Hospital: { description: 'Hospital District ID', example: undefined, type: 'string' },
              Judicial: { description: 'Judicial District', example: '04', type: 'string' },
              MCDCode: { description: 'Minor Civil Division Code', example: '135', type: 'string' },
              MCDName: { description: 'Minor Civil Division Name', example: 'Minneapolis', type: 'string' },
              MNLegDist: { description: 'Minnesota House District', example: '60A', type: 'string' },
              MNSenDist: { description: 'Minnesota Senate District', example: '60', type: 'string' },
              Park: { description: 'Park District', example: '1', type: 'string' },
              Precinct: { description: 'Precinct Name', example: 'Minneapolis W-1 P-9', type: 'string' },
              PrecinctCode: {
                description: 'Precinct Code — this is specific to each County (see `PrecinctID`)',
                example: '1400',
                type: 'string',
              },
              PrecinctID: {
                title: 'Precinct ID',
                description: [
                  'Precinct ID — concatenation of the following: [MN FIPS Code] + [County FIPS Code] + [Precinct Code]',
                  '- MN FIPS Code is 27',
                  '- County FIPS Code can be calculated from `CountyID` using this formula: (`CountyID` * 2) – 1 (zero-padded to three characters)',
                  '- `PrecinctCode` (zero-padded to four characters)',
                ].join('\n'),
                example: '270531400',
                type: 'string',
              },
              SoilAndWater: { description: 'Soil And Water District ID', example: undefined, type: 'string' },
              Ward: { description: 'City Ward', example: 'W-01', type: 'string' },
            },
          },
        },
      },
    },
  },
};

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
app.get('/', opts, async function GET(request, reply) {
  const accept = request.accepts(); // Accepts object via fastify-accepts

  const params = await createDefaultParams(request, reply);

  // @ts-expect-error will revisit this when we migrate to Hono
  if (request.query.format === 'json') return replyWithJsonParams(params, reply);

  switch (accept.type(['html', 'json'])) {
    case 'html':
      return reply.view('/src/pages/index.hbs', { ...params, seo });
    case 'json':
      return replyWithJsonParams(params, reply);
    default:
      return reply.view('/src/pages/index.hbs', { ...params, seo });
  }
});

if (!['ci', 'test'].includes(env)) {
  // Run the server and report out to the logs
  app.listen(process.env.PORT || 3000, '0.0.0.0', function start(err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log(`Your app is listening on ${address}`);
    app.log.info(`server listening on ${address}`);
  });
}

export default app;
