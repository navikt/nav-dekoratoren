import { describe, expect, test } from 'bun:test';
import content from './content-test-data.json';
import requestHandler from './request-handler';
import ContentService from './content-service';
import SearchService from './search-service';
import UnleashService from './unleash-service';
import notificationsService from './notifications-service';
import TaConfigService from './task-analytics-service';

const fetch = await requestHandler(
  new ContentService(
    () => Promise.resolve(content),
    () =>
      Promise.resolve([
        {
          heading: 'wat',
          url: 'example.com',
          urlscope: ['privatperson'],
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
  const response = await fetch(new Request('http://localhost/api/isAlive'));
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('OK');
});

test('index', async () => {
  const response = await fetch(new Request('http://localhost/'));
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
  expect(await response.text()).toContain('<!doctype html>');
});

test('search', async () => {
  const response = await fetch(
    new Request('http://localhost/api/search?q=test'),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
});

test('driftsmeldinger', async () => {
  const response = await fetch(
    new Request('http://localhost/api/driftsmeldinger'),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(await response.json()).toEqual([
    {
      heading: 'wat',
      url: 'example.com',
      urlscope: ['privatperson'],
    },
  ]);
});

describe('notifications', () => {
  test('archive notification on POST', async () => {
    const response = await fetch(
      new Request('http://localhost/api/notifications/message/archive', {
        method: 'POST',
        body: JSON.stringify('eventId'),
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(await response.json()).toEqual('eventId');
  });

  test('archive notification gives 404 on GET', async () => {
    const response = await fetch(
      new Request('http://localhost/api/notifications/message/archive'),
    );
    expect(response.status).toBe(404);
  });
});

describe('files', () => {
  test('hit', async () => {
    const response = await fetch(
      new Request('http://localhost/public/yep.svg'),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
  });

  test('miss', async () => {
    const response = await fetch(
      new Request('http://localhost/public/nope.svg'),
    );
    expect(response.status).toBe(404);
  });
});
