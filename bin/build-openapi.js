import fs from 'fs';

import app from '../src/server';

const outfile = 'openapi.json';

async function run() {
  try {
    await app.ready();
    const spec = JSON.stringify(app.swagger());
    fs.writeFileSync(outfile, spec, { encoding: 'utf-8' });
    // eslint-disable-next-line no-console
    console.log('successfully wrote file to', outfile);
    process.exit(0);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error syncing file!');
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
}

run();
