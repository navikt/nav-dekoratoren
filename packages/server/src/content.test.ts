import { expect, test, describe } from 'bun:test';
import content from './content-test-data.json';
import { getHeaderMenuLinks, getMyPageMenu } from './content';

describe('getHeaderMenuLinks', () => {
  test('returns norwegian privatperson menu', () => {
    const headerMenuLinks = getHeaderMenuLinks({
      menu: content,
      language: 'nb',
      context: 'privatperson',
    });

    expect(headerMenuLinks?.length).toBe(2);
    expect(headerMenuLinks?.at(0)?.displayName).toBe('Områder');
  });

  test('returns norwegian arbeidsgiver menu', () => {
    const headerMenuLinks = getHeaderMenuLinks({
      menu: content,
      language: 'nb',
      context: 'arbeidsgiver',
    });

    expect(headerMenuLinks?.length).toBe(4);
    expect(headerMenuLinks?.at(0)?.displayName).toBe('Sykdom, skade og fravær');
  });

  test('returns english menu', () => {
    const headerMenuLinks = getHeaderMenuLinks({
      menu: content,
      language: 'en',
      context: 'privatperson',
    });

    expect(headerMenuLinks?.length).toBe(5);
    expect(headerMenuLinks?.at(0)?.displayName).toBe('Work and stay in Norway');
  });
});

describe('myPageMenu', () => {
  test('returns norwegian menu', () => {
    expect(getMyPageMenu(content, 'nb')?.at(0)?.displayName).toBe(
      'Din oversikt',
    );
  });

  test('returns english menu', () => {
    expect(getMyPageMenu(content, 'en')?.at(0)?.displayName).toBe(
      'Your overview',
    );
  });
});
