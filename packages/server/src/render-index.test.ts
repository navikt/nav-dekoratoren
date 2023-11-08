import { expect, test } from 'bun:test';
import menu from './content-test-data.json';
import renderIndex from './render-index';
import ContentService from './content-service';
import UnleashService from './unleash-service';

const contentService = new ContentService(
  () => Promise.resolve(menu),
  () => Promise.resolve([]),
);
const unleashService = new UnleashService({ mock: true });

test('It masks the document from hotjar', async () => {
  expect(
    await renderIndex({
      contentService,
      unleashService,
      data: {
        redirectToLogout: 'https://www.nav.no',
        context: 'privatperson',
        simple: false,
        simpleHeader: false,
        simpleFooter: false,
        enforceLogin: false,
        redirectToApp: false,
        level: 'Level3',
        language: 'en',
        availableLanguages: [],
        breadcrumbs: [],
        utilsBackground: 'transparent',
        feedback: false,
        chatbot: true,
        chatbotVisible: false,
        urlLookupTable: false,
        shareScreen: false,
        logoutUrl: '/logout',
        maskHotjar: true,
        logoutWarning: false,
        redirectToUrl: 'https://www.nav.no',
        ssr: true,
      },
      url: 'localhost:8089/',
      query: {},
    }),
  ).toContain('data-hj-supress');
});
