import { describe, expect, test } from 'bun:test';
import content from './content-test-data.json';
import requestHandler from './request-handler';
import ContentService from './content-service';
import SearchService from './search-service';

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
    new Request('http://localhost/api/sok?ord=test'),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect((await response.json()).hits.length).toBe(0);
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

describe('varsler', () => {
  test('inaktiver varsel on POST', async () => {
    const response = await fetch(
      new Request({
        url: 'http://localhost/api/varsler/beskjed/inaktiver',
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

  test('inaktiver varsel gives 404 on GET', async () => {
    const response = await fetch(
      new Request('http://localhost/api/varsler/beskjed/inaktiver'),
    );
    expect(response.status).toBe(404);
  });
});

describe('files', () => {
  test('hit', async () => {
    const response = await fetch(
      new Request('http://localhost/public/ikoner/circle.svg'),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
  });

  test('miss', async () => {
    const response = await fetch(
      new Request('http://localhost/public/nope.jpg'),
    );
    expect(response.status).toBe(404);
  });
});
