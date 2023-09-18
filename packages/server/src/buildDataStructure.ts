import { Context, Language, Params } from 'decorator-shared/params';
import { texts } from 'decorator-shared/texts';
import { Node } from 'decorator-shared/types';

export function getContextKey(context: Context) {
  return capitalizeFirstLetter(context);
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export type ContentLangKey = 'no' | 'en' | 'se';

export const getLangKey = (lang: Language): ContentLangKey => {
  switch (lang) {
    case 'en':
      return 'en';
    case 'se':
      return 'se';
    default:
      return 'no';
  }
};

export const get = (node: Node, path: string): Node | undefined => {
  if (path.includes('.')) {
    return path.split('.').reduce<Node>((prev, curr) => get(prev, curr)!, node);
  }
  return node.children.find(({ displayName }) => displayName === path);
};

export default async (params: Params) => {
  const menu = {
    children: await fetch(
      `${process.env.ENONICXP_SERVICES}/no.nav.navno/menu`,
    ).then((response) => response.json()),
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

export const getHeaderMenuLinks = async ({ language, context }) => {
  const menu = {
    children: await fetch(
      `${process.env.ENONICXP_SERVICES}/no.nav.navno/menu`,
    ).then((response) => response.json()),
    displayName: '',
    // TS complains, can be fixed by adding a type to the node
    flatten: false,
    id: '',
  };

  const contextKey = getContextKey(context);

  const menuLinksKey: Record<ContentLangKey, string> = {
    en: 'en.Header.Main menu',
    se: 'se.Header.Main menu',
    no: `no.Header.Main menu.${contextKey}`,
    // '': 'no.Header.Main menu',
  };

  return get(menu, menuLinksKey[getLangKey(language)])?.children;
};
