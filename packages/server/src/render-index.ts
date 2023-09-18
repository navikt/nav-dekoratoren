import { Header } from 'decorator-shared/views/header';
import { Index } from './views';
import { Footer } from './views/footer';
import { DecoratorEnv } from './views/decorator-env';
import { DecoratorLens } from './views/decorator-lens';

import clientManifest from 'decorator-client/dist/manifest.json';
import {
  ContentLangKey,
  get,
  getContextKey,
  getLangKey,
} from './buildDataStructure';
import { Params } from 'decorator-shared/params';
import { Node } from 'decorator-shared/types';
import { texts } from 'decorator-shared/texts';

const getResources = (port) => {
  const entryPointPath = 'src/main.ts';
  const script = (src: string) =>
    `<script type="module" src="${src}"></script>`;

  if (process.env.NODE_ENV === 'development') {
    return {
      scripts: [
        'http://localhost:5173/@vite/client',
        `http://localhost:5173/${entryPointPath}`,
      ]
        .map(script)
        .join(''),
      styles: '',
    };
  }

  const host = process.env.HOST ?? `http://localhost:${port}`;
  const { file, css } = clientManifest[entryPointPath];

  return {
    scripts: script(`${host}/public/${file}`),
    styles: [
      ...css.map(
        (href: string) =>
          `<link type="text/css" rel="stylesheet" href="${host}/public/${href}"></link>`,
      ),
    ].join(''),
  };
};

const buildDataStructure = (children: Node[], params: Params) => {
  const menu = {
    children,
    displayName: '',
    // TS complains, can be fixed by adding a type to the node
    flatten: false,
    id: '',
  };

  const contextKey = getContextKey(params.context);
  const languageKey = getLangKey(params.language);

  const key: Record<ContentLangKey, string> = {
    en: 'en.Footer.Columns',
    se: 'se.Footer.Columns',
    no: `no.Footer.Columns.${contextKey}`,
    // Denne treffes vell aldri?
    // '': 'no.Footer.Columns.Privatperson',
  };

  const menuLinksKey: Record<ContentLangKey, string> = {
    en: 'en.Header.Main menu',
    se: 'se.Header.Main menu',
    no: `no.Header.Main menu.${contextKey}`,
    // '': 'no.Header.Main menu',
  };

  const footerLinks = get(menu, key[languageKey])?.children;
  const mainMenu = get(menu, 'no.Header.Main menu')?.children;
  const personvern = get(menu, 'no.Footer.Personvern')?.children;
  const headerMenuLinks = get(menu, menuLinksKey[languageKey])?.children;
  const myPageMenu = get(menu, `${languageKey}.Header.My page menu`)?.children;

  if (
    !mainMenu ||
    !footerLinks ||
    !personvern ||
    !headerMenuLinks ||
    !myPageMenu
  ) {
    throw new Error('Main menu or footer links not found');
  }

  return {
    footerLinks,
    mainMenu: mainMenu.map<Node>((contextLink) => {
      return {
        isActive: contextLink.displayName.toLowerCase() === params.context,
        ...contextLink,
      };
    }),
    personvern,
    headerMenuLinks,
    myPageMenu,
    texts: texts[languageKey],
  };
};

export default ({ menu, data, url, query, port }) => {
  const dataStructure = buildDataStructure(menu, data);
  const resources = getResources(port);

  return Index({
    scripts: resources.scripts,
    links: resources.styles,
    language: data.language,
    header: Header({
      texts: dataStructure.texts,
      mainMenu: dataStructure.mainMenu,
      headerMenuLinks: dataStructure.headerMenuLinks,
      innlogget: false,
      isNorwegian: true,
      breadcrumbs: data.breadcrumbs,
      utilsBackground: data.utilsBackground,
      availableLanguages: data.availableLanguages,
      myPageMenu: dataStructure.myPageMenu,
      simple: data.simple,
    }),
    footer: Footer({
      texts: dataStructure.texts,
      personvern: dataStructure.personvern,
      footerLinks: dataStructure.footerLinks,
      simple: data.simple,
      feedback: data.feedback,
    }),
    env: DecoratorEnv({
      origin: url,
      env: data,
    }),
    lens: DecoratorLens({
      origin: url,
      env: data,
      query,
    }),
  });
};
