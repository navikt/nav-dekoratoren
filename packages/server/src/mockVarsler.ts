import { Elysia, t } from 'elysia';
import varslerMock from './varsler-mock.json';

const mockVarslerHandler = new Elysia()
  .get('/api/varsler', () => {
    const trimmed = {
      beskjeder: varslerMock.beskjeder.slice(0, 6),
      oppgaver: varslerMock.oppgaver.slice(0, 3),
    };
    return trimmed;
  })
  .post('/api/varsler/beskjed/inaktiver', ({ body }) => body, {
    body: t.Object({
      eventId: t.String(),
    }),
    afterHandle: () => {
      console.log('After handle');
    },
  });
export default mockVarslerHandler;
