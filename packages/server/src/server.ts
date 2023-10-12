import { fetchDriftsmeldinger, fetchMenu, fetchSearch } from './enonic';
import { readdirSync, statSync } from 'node:fs';
import { env } from './env/server';
import ContentService from './content-service';
import requestHandler from './request-handler';
import SearchService from './search-service';
import menu from './content-test-data.json';
import notificationsService from './notifications-service';
import UnleashService from './unleash-service';

const getFilePaths = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const file = dir + '/' + name;
    return statSync(file).isDirectory() ? getFilePaths(file) : file;
  });

const server = Bun.serve({
  port: env.PORT || 8089,
  development: process.env.NODE_ENV === 'development',
  fetch: await requestHandler(
    new ContentService(
      process.env.NODE_ENV === 'production'
        ? fetchMenu
        : () => Promise.resolve(menu),
      fetchDriftsmeldinger,
    ),
    new SearchService(fetchSearch),
    {
      getFilePaths,
      getFile: Bun.file,
    },
    notificationsService(),
    new UnleashService({}),
  ),
});

console.log(
  `decorator-next is running at http://${server.hostname}:${server.port}`,
);
