/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require('path');

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
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get('/', function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {};

  if (request.query.lat && request.query.long) {
    params = {
      address: `${request.query.lat} and ${request.query.long}`,
    };
    // do something with the address!
  }

  if (request.query.address) {
    params = {
      address: request.query.address,
    };
    // do something with the address!
  }

  // If someone clicked the option for a random address it'll be passed in the querystring
  if (request.query.example) {
    // Add the color properties to the params object
    params = {
      address: '123 Main Street',
    };
  }

  const accept = request.accepts(); // Accepts object via fastify-accepts

  switch (accept.type(['json', 'html'])) {
    case 'json':
      reply.send(params);
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
