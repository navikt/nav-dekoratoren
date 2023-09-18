import { expect, test } from 'bun:test';
import menu from './content-test-data.json';
import renderIndex from './render-index';

test('renders norwegian index', () => {
  expect(
    renderIndex({
      menu,
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

test('renders english index', () => {
  expect(
    renderIndex({
      menu,
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
