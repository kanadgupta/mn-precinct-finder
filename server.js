/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require('path');
const findPrecinct = require('./lib/find-precinct');
const { forwardGeocode, reverseGeocode } = require('./lib/geocode-address');

// Require the fastify framework and instantiate it
const fastify = require('fastify')({
  ignoreTrailingSlash: true,
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/', // optional: default '/'
});

// point-of-view is a templating manager for fastify
fastify.register(require('point-of-view'), {
  engine: {
    // eslint-disable-next-line global-require
    handlebars: require('handlebars'),
  },
});

// fastify-accepts parses the Accept header
fastify.register(require('fastify-accepts'));

// Load and parse SEO data
const seo = require('./src/seo.json');

if (seo.url === 'glitch-default') {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Creates default object for usage across various endpoints
 * @param {Object} request The Fastify `request` object
 * @param {*} reply The Fastify `reply` object
 * @returns An object containing the default return data
 */
async function createDefaultParams(request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {};

  if (request.query.lat && request.query.long) {
    const { lat, long } = request.query;
    try {
      const precinct = findPrecinct([long, lat]);
      const address = await reverseGeocode(long, lat);
      params = {
        address,
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

  // If someone clicked the option for a random address it'll be passed in the querystring
  if (request.query.example) {
    // This is for Fair State? Idk
    const precinct = findPrecinct([-93.2497537, 45.013565]);
    params = { address: '2506 Central Ave NE, Minneapolis, MN 55418', precinct };
  }

  return params;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get('/', async function (request, reply) {
  const accept = request.accepts(); // Accepts object via fastify-accepts

  const params = await createDefaultParams(request, reply);

  switch (accept.type(['json', 'html'])) {
    case 'json':
      if (params.error) reply.send({ ...params.error.toJSON() });
      else reply.send(params);
      break;
    // The Handlebars code will be able to access the parameter values and build them into the page
    case 'html':
      reply.view('/src/pages/index.hbs', { ...params, seo });
      break;
    default:
      reply.view('/src/pages/index.hbs', { ...params, seo });
      break;
  }
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT || 3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
