import { expect, test, describe } from 'bun:test';
import testData from './content-test-data.json';
import ContentService from './content-service';

const contentService = new ContentService(() => Promise.resolve(testData));

describe('getHeaderMenuLinks', () => {
  test('returns norwegian privatperson menu', async () => {
    const headerMenuLinks = await contentService.getHeaderMenuLinks({
      language: 'nb',
      context: 'privatperson',
    });

    expect(headerMenuLinks?.length).toBe(2);
    expect(headerMenuLinks?.at(0)?.displayName).toBe('Områder');
  });

  test('returns norwegian arbeidsgiver menu', async () => {
    const headerMenuLinks = await contentService.getHeaderMenuLinks({
      language: 'nb',
      context: 'arbeidsgiver',
    });

    expect(headerMenuLinks?.length).toBe(4);
    expect(headerMenuLinks?.at(0)?.displayName).toBe('Sykdom, skade og fravær');
  });

  test('returns english menu', async () => {
    const headerMenuLinks = await contentService.getHeaderMenuLinks({
      language: 'en',
      context: 'privatperson',
    });

    expect(headerMenuLinks?.length).toBe(5);
    expect(headerMenuLinks?.at(0)?.displayName).toBe('Work and stay in Norway');
  });
});

describe('myPageMenu', () => {
  test('returns norwegian menu', async () => {
    expect(
      (
        await contentService.getMyPageMenu({
          language: 'nb',
        })
      )?.at(0)?.displayName,
    ).toBe('Din oversikt');
  });

  test('returns english menu', async () => {
    expect(
      (
        await contentService.getMyPageMenu({
          language: 'en',
        })
      )?.at(0)?.displayName,
    ).toBe('Your overview');
  });
});

describe('getSimpleFooterLinks', () => {
  test('has share screen link', async () => {
    expect(
      (await contentService.getSimpleFooterLinks({ language: 'nb' }))
        ?.at(2)
        ?.content.startsWith('Del skjerm med veileder'),
    ).toBeTrue();
  });

  test('returns norwegian', async () => {
    expect(
      (await contentService.getSimpleFooterLinks({ language: 'nb' }))?.at(0)
        ?.content,
    ).toBe('Personvern og informasjonskapsler');
  });

  test('returns english', async () => {
    expect(
      (await contentService.getSimpleFooterLinks({ language: 'en' }))?.at(0)
        ?.content,
    ).toBe('Privacy and cookies');
  });
});
