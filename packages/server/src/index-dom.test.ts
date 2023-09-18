/// <reference lib="dom" />

import { test, expect } from 'bun:test';
import menu from './content-test-data.json';
import renderIndex from './render-index';
import ContentService from './content-service';

const contentService = new ContentService(() => Promise.resolve(menu));

test('index contains scripts', async () => {
  document.body.innerHTML = await renderIndex({
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
  });
  const scripts = document.querySelector('#scripts');
  expect(scripts?.children.length).toEqual(2);
});
