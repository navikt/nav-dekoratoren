import { expect, test } from 'bun:test';
import menu from './content-test-data.json';
import renderIndex from './render-index';
import ContentService from './content-service';

const contentService = new ContentService(() => Promise.resolve(menu));

test('renders norwegian index', async () => {
  expect(
    await renderIndex({
      contentService,
      data: {
        context: 'privatperson',
        simple: false,
        simpleHeader: false,
        simpleFooter: false,
        enforceLogin: false,
        redirectToApp: false,
        level: 'Level3',
        language: 'nb',
        availableLanguages: [],
        breadcrumbs: [],
        utilsBackground: 'transparent',
        feedback: false,
        chatbot: true,
        chatbotVisible: false,
        urlLookupTable: false,
        shareScreen: false,
        logoutUrl: '/logout',
        maskHotjar: false,
      },
      url: 'localhost:8089/',
      query: {},
    }),
  ).toMatchSnapshot();
});

test('renders english index', async () => {
  expect(
    await renderIndex({
      contentService,
      data: {
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
        maskHotjar: false,
      },
      url: 'localhost:8089/',
      query: {},
    }),
  ).toMatchSnapshot();
});
