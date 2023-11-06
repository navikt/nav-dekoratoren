import { fetchOpsMessages, fetchMenu, fetchSearch } from './enonic';
import { readdirSync, statSync } from 'node:fs';
import { env } from './env/server';
import ContentService from './content-service';
import requestHandler from './request-handler';
import SearchService from './search-service';
import menu from './content-test-data.json';
import notificationsService from './notifications-service';
import UnleashService from './unleash-service';
import TaConfigService from './task-analytics-service';
// import { corsSchema } from './cors';

// corsSchema.parse('https://www.google.com')

const getFilePaths = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const file = dir + '/' + name;
    return statSync(file).isDirectory() ? getFilePaths(file) : file;
  });

console.log('Starting decorator-next server');

const server = Bun.serve({
  port: env.PORT || 8089,
  development: process.env.NODE_ENV === 'development',
  fetch: await requestHandler(
    new ContentService(
      process.env.NODE_ENV === 'production'
        ? fetchMenu
        : () => Promise.resolve(menu),
      process.env.NODE_ENV === 'production'
        ? fetchOpsMessages
        : () =>
            Promise.resolve([
              {
                heading: 'Ustabile tjenester søndag 15. januar',
                url: 'https://www.nav.no/no/driftsmeldinger/ustabile-tjenester-sondag-15.januar',
                type: 'prodstatus',
              },
              {
                heading: 'Svindelforsøk via SMS - vær oppmerksom',
                url: 'https://www.nav.no/no/driftsmeldinger/svindelforsok-via-sms-vaer-oppmerksom20231016',
                type: 'info',
              },
            ]),
    ),
    new SearchService(fetchSearch),
    {
      getFilePaths,
      getFile: Bun.file,
    },
    notificationsService(),
    new UnleashService({}),
    new TaConfigService(),
  ),
});

console.log(
  `decorator-next is running at http://${server.hostname}:${server.port}`,
);
