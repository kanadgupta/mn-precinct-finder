const app = require('../server');

describe('fastify server tests', () => {
  describe('GET /', () => {
    it('should return 200 with standard template', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(200);
    });

    it('should return 200 when requesting JSON via Accept header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
        headers: { Accept: 'application/json' },
      });

      expect(response.body).toBe('{}');
      expect(response.statusCode).toBe(200);
    });

    it('should return 200 when requesting JSON via query param', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/?format=json',
        headers: { Accept: 'application/json' },
      });

      expect(response.body).toBe('{}');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /?example=go', () => {
    it('should return 200 with standard template', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/?example=go',
      });

      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(200);
    });

    it('should return 200 when requesting JSON', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/?example=go',
        headers: { Accept: 'application/json' },
      });

      expect(JSON.parse(response.body)).toStrictEqual({
        address: '2506 Central Ave NE, Minneapolis, MN 55418',
        gmaps: 'https://www.google.com/maps/search/?api=1&query=2506+Central+Ave+NE%2C+Minneapolis%2C+MN+55418',
        mplsPollingPlace21: {
          address: '1320 29th Ave NE',
          building: 'Audubon Park Recreation Center',
          directions: '',
          gmapsUrl:
            'https://www.google.com/maps/search/?api=1&query=Audubon+Park+Recreation+Center+1320+29th+Ave+NE&query_place_id=ChIJMzNMT9sts1IRYwD7TCQu1p4',
        },
        precinct: {
          CongDist: '5',
          County: 'Hennepin',
          CountyID: '27',
          CtyComDist: '02',
          Judicial: '04',
          MCDCode: '135',
          MCDName: 'Minneapolis',
          MNLegDist: '60A',
          MNSenDist: '60',
          Park: '1',
          Precinct: 'Minneapolis W-01 P-04',
          PrecinctCode: '1375',
          PrecinctID: '270531375',
          Ward: 'W-01',
        },
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
