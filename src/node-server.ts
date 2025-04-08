import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

import app from './server.js';

app.use('/style.css', serveStatic({ path: './public/style.css' }));

serve({ fetch: app.fetch, port: 1234 }, info => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${info.port}`);
});
