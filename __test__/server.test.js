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
        headers: { Accept: 'application/json' },
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

      expect(response.body).toBe(
        JSON.stringify({
          address: '2506 Central Ave NE, Minneapolis, MN 55418',
          gmaps: 'https://www.google.com/maps/search/?api=1&query=2506+Central+Ave+NE%2C+Minneapolis%2C+MN+55418',
          precinct: {
            Precinct: 'Minneapolis W-1 P-9',
            PrecinctID: '270531400',
            County: 'Hennepin',
            CountyID: '27',
            CongDist: '5',
            MNSenDist: '60',
            MNLegDist: '60A',
            CtyComDist: '2',
            Hospital: 'no data',
            Judicial: '04',
            MCDCode: '135',
            MCDName: 'Minneapolis',
            Park: '1',
            PrecinctCode: '1400',
            SoilAndWater: 'no data',
            Ward: 'W-01',
          },
          mplsPollingPlace21: {
            address: '2030 Monroe St NE',
            building: 'Edison High School (Gym lobby)',
            directions: '',
            gmapsUrl:
              'https://www.google.com/maps/search/?api=1&query=Edison+High+School+%28Gym+lobby%29+2030+Monroe+St+NE&query_place_id=ChIJx58zzJIts1IRDTGIN8Fm7tk',
          },
        })
      );
      expect(response.statusCode).toBe(200);
    });
  });
});
