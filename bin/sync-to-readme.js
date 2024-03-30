const axios = require('axios').default;

const app = require('../server');

async function run() {
  await app.ready();
  const spec = JSON.stringify(app.swagger());

  const username = process.env.API_KEY;
  const id = process.env.SPEC_ID;

  const options = {
    method: 'PUT',
    url: `https://dash.readme.com/api/v1/api-specification/${id}`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    auth: { username },
    data: { spec },
  };

  axios
    .request(options)
    .then(function (response) {
      // eslint-disable-next-line no-console
      console.log(`Successfully synced ${response.data.title}`);
    })
    .catch(function (error) {
      // eslint-disable-next-line no-console
      if (error?.response?.data) console.error(error.response.data);
      // eslint-disable-next-line no-console
      else console.error(error);
    });
}

run();
