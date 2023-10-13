import { expect, test } from 'bun:test';
import menu from './content-test-data.json';
import renderIndex from './render-index';
import ContentService from './content-service';
import UnleashService from './unleash-service';
import { Params } from 'decorator-shared/params';

const contentService = new ContentService(
  () => Promise.resolve(menu),
  () => Promise.resolve([]),
);
const unleashService = new UnleashService({ mock: true });

const base = {
      contentService,
      unleashService,
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
        logoutWarning: false,
        redirectToUrl: 'https://www.nav.no',
      },
      url: 'localhost:8089/',
      query: {},
    }

type BaseParams = typeof base.data

function makeParamsConfig(override: Partial<Params>) {
    return {
        ...base,
        data: {
            ...base.data,
            ...override,
        }
    } as typeof base & { data: Params }
}



test('renders norwegian index', async () => {
  const index = await renderIndex(makeParamsConfig({ language: 'nb' }))
  expect(index).toMatchSnapshot();
  expect(index).toContain('lang="nb"')
});

test('renders english index', async () => {
  const index = await renderIndex(makeParamsConfig({ language: 'en' }))

  expect(index).toMatchSnapshot();
  expect(index).toContain('lang="en"')
});

test('It masks the document from hotjar', async () => {
  expect(
    await renderIndex({
      contentService,
      unleashService,
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
        maskHotjar: true,
        logoutWarning: false,
        redirectToUrl: 'https://www.nav.no',
      },
      url: 'localhost:8089/',
      query: {},
    }),
  ).toContain('data-hj-supress');
})
