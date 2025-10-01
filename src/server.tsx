import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { Hono, type Context } from 'hono';
import { env as adapterEnv } from 'hono/adapter';
import { basicAuth } from 'hono/basic-auth';
import { logger } from 'hono/logger';
import { UAParser } from 'ua-parser-js';

import Page from './components/index.js';
import buildMapsUrl from './lib/build-maps-url.js';
import GeocodingError from './lib/errors.js';
import findPrecinct, { type ExtendedPrecinctProps } from './lib/find-precinct.js';
import { forwardGeocode, reverseGeocode } from './lib/geocode-address.js';
import getPollingPlace, { type PollingPlace } from './lib/get-polling-place.js';
import seo from './seo.json' with { type: 'json' };

const app = new Hono();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

type Params =
  | {
      address: string;
      gmaps: string;
      mplsPollingPlace21?: PollingPlace;
      precinct: ExtendedPrecinctProps;
      type: 'success';
    }
  | {
      addressError?: string;
      error?: InstanceType<typeof GeocodingError>;
      type: 'error';
    }
  | { type: 'default' };

export type Props = Params & {
  seo: typeof seo;
};

function replyWithJsonParams(params: Params, c: Context) {
  const errorStatus = c.res.status >= 400 ? (c.res.status as ContentfulStatusCode) : 400;
  switch (params.type) {
    case 'success':
      return c.json(params);
    case 'error':
      return c.json({ ...params.error?.toJSON() }, errorStatus);
    default:
      return c.json({});
  }
}

if (process.env.USERNAME || process.env.PASSWORD) {
  app.use(
    basicAuth({
      verifyUser: (username, password, c) => {
        const env = adapterEnv<Env>(c);
        return username === env.USERNAME && password === env.PASSWORD;
      },
    }),
  );
}

app.get('/', async c => {
  const { req } = c;

  let params: Params = { type: 'default' };

  const addressQuery = req.query('address');
  const latQuery = req.query('lat');
  const longQuery = req.query('long');

  const env = adapterEnv<Env>(c);

  const { browser } = UAParser(req.header('User-Agent'));

  if (req.query('example')) {
    const address = '2506 Central Ave NE, Minneapolis, MN 55418';
    const precinct = findPrecinct([-93.2497537, 45.013565]);
    const gmaps = buildMapsUrl(address);
    params = { address, gmaps, precinct, type: 'success' };
  } else if (latQuery && longQuery) {
    try {
      const precinct = findPrecinct([Number(longQuery), Number(latQuery)]);
      const { address, gmaps } = await reverseGeocode(env, longQuery, latQuery);
      params = {
        address,
        gmaps,
        precinct,
        type: 'success',
      };
    } catch (e) {
      c.status(404);
      params = {
        addressError: e.message,
        type: 'error',
      };
    }
  } else if (addressQuery) {
    try {
      params = await forwardGeocode(env, addressQuery);
    } catch (error) {
      if (error instanceof GeocodingError) {
        c.status(error.status);
        params = { error, type: 'error' };
      }
    }
  }

  if (params?.type === 'success' && params.precinct?.Precinct) {
    params.mplsPollingPlace21 = getPollingPlace(params.precinct.Precinct);
  }

  const isGoogleSheetsRequest = req.header('User-Agent')?.includes('GoogleDocs; apps-spreadsheets');

  if (!isGoogleSheetsRequest && (req.query('format') === 'json' || !browser.name))
    return replyWithJsonParams(params, c);

  return c.html(<Page seo={seo} {...params} />);
});

export default app;
