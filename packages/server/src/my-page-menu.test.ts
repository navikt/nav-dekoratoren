import { expect, test } from 'bun:test';
import menu from './menu-test-data.json';
import getMyPageMenu from './my-page-menu';

test('myPageMenu returns norwegian menu', () => {
  expect(getMyPageMenu(menu, 'nb')?.at(0)?.displayName).toBe('Din oversikt');
});

test('myPageMenu returns english menu', () => {
  expect(getMyPageMenu(menu, 'en')?.at(0)?.displayName).toBe('Your overview');
});
