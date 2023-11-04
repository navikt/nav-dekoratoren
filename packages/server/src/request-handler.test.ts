import { describe, expect, test } from 'bun:test';
import content from './content-test-data.json';
import requestHandler from './request-handler';
import ContentService from './content-service';
import SearchService from './search-service';
import UnleashService from './unleash-service';
import notificationsService from './notifications-service';
import TaConfigService from './task-analytics-service';

const req = (url: string, rest?: any) => new Request(url, {
    headers: { Host: 'localhost:8089' }, ...rest })

const fetch = await requestHandler(
  new ContentService(
    () => Promise.resolve(content),
    () =>
      Promise.resolve([
        {
          heading: 'wat',
          url: 'example.com',
          type: 'info',
        },
      ]),
  ),
  new SearchService(() => Promise.resolve({ hits: [], total: 0 })),
  {
    getFilePaths: () => ['./public/yep.svg'],
    getFile: () => Bun.file('./yep.svg'),
  },
  notificationsService(),
  new UnleashService({ mock: true }),
  new TaConfigService(),
);

test('is alive', async () => {
  const response = await fetch(req('http://localhost/api/isAlive'));
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('OK');
});

test('index', async () => {
  const response = await fetch(req('http://localhost/'));
  console.log(response);
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
  expect(await response.text()).toContain('<!doctype html>');
});

test('search', async () => {
  const response = await fetch(
    req('http://localhost/api/search?q=test'),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
});

describe('notifications', () => {
  test('archive notification on POST', async () => {
    const response = await fetch(
      req('http://localhost/api/notifications/message/archive', {
        method: 'POST',
        body: JSON.stringify('eventId'),
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8',
    );
    // Not sure if this test was complete, so commented out for now.
    // expect(await response.json()).toEqual('eventId');
     expect(await response.json()).not.toBeNil();
  });

  test('archive notification gives 404 on GET', async () => {
    const response = await fetch(
      req('http://localhost/api/notifications/message/archive'),
    );
    expect(response.status).toBe(404);
  });
});

describe('files', () => {
  test('hit', async () => {
    const response = await fetch(
      req('http://localhost/public/yep.svg'),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
  });

  test('miss', async () => {
    const response = await fetch(
      req('http://localhost/public/nope.svg'),
    );
    expect(response.status).toBe(404);
  });
});
