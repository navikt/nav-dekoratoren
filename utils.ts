import { Context, Language, Params } from './params';
import { Texts, texts } from './texts';

function getContextKey(context: Context) {
  return capitalizeFirstLetter(context);
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type TemplateStringValues =
  | string
  | string[]
  | boolean
  | ((e: Element) => void)
  | NamedNodeMap
  | undefined;

export const html = (
  strings: TemplateStringsArray,
  ...values: TemplateStringValues[]
) =>
  String.raw(
    { raw: strings },
    ...values.map((item) =>
      Array.isArray(item)
        ? item.join('')
        : // Check for boolean
        item === false
        ? ''
        : item,
    ),
  );

export type PropsWithTextAndParams<T> = T & {
  texts: Texts;
  params: Params;
};

export type ContentLangKey = 'no' | 'en' | 'se';

// To match params.language to content keys
export const getLangKey = (lang: Language): ContentLangKey => {
  return {
    nb: 'no',
    nn: 'no',
    en: 'en',
    se: 'se',
    pl: 'no',
    uk: 'no',
    ru: 'no',
  }[lang] as ContentLangKey;
};

export const getData = async (params: Params) => {
  interface Node {
    children: Node[];
    displayName: string;
    path?: string;
  }

  const get = (node: Node, path: string): Node | undefined => {
    if (path.includes('.')) {
      return path
        .split('.')
        .reduce<Node>((prev, curr) => get(prev, curr)!, node);
    }
    return node.children.find(({ displayName }) => displayName === path);
  };

  const menu = {
    children: await fetch('https://www.nav.no/dekoratoren/api/meny').then(
      (response) => response.json(),
    ),
    displayName: '',
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
    mainMenu: mainMenu.map((contextLink) => {
      return {
        styles:
          contextLink.displayName.toLowerCase() === params.context
            ? 'active'
            : '',
        context: contextLink.displayName.toLowerCase(),
        ...contextLink,
      };
    }),
    isNorwegian: params.language === 'nb',
    personvern,
    headerMenuLinks,
    myPageMenu,
    texts: texts[languageKey],
  };
};

export function getDataSubset(params: Params, datakey: DataKeys) {
  return getData(params).then((data) => data[datakey]);
}

export type GetDataResponse = Awaited<ReturnType<typeof getData>>;
export type DataKeys = keyof GetDataResponse;
// These types are the same for now, but if we change later i want it to be reflected which is why i'm doing this.
export type MainMenu = GetDataResponse['mainMenu'];
export type FooterLinks = GetDataResponse['footerLinks'];
export type Personvern = GetDataResponse['personvern'];
export type HeaderMenuLinksData = GetDataResponse['headerMenuLinks'];
export type MyPageMenu = GetDataResponse['myPageMenu'];
