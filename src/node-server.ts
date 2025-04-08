import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

import app from './server.js';

app.use('/style.css', serveStatic({ path: './public/style.css' }));

// port 3000 is what we specify for fly.io (see Dockerfile and fly.toml)
serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, info => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${info.port}`);
});
