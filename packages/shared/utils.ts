import { Context, Language, Params } from '../../../params';
import { Texts, texts } from './texts';

function getContextKey(context: Context) {
  return capitalizeFirstLetter(context);
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// type AttributeKey = keyof HTMLElement['attributes'];

type Props = Record<string, string | boolean | number | null | undefined>;

// Conditionally add props to an element
export function spreadProps(props: Props) {
  const result = [];

  for (const [key, value] of Object.entries(props)) {
    if (value) {
      result.push(`${key}="${value}"`);
    }
  }

  return result;
}

// For when you know it is defined to avoid annoying null checks
export function asDefined<T>(value: T | undefined): NonNullable<T> {
  if (!value) {
    throw new Error('Value is undefined');
  }

  return value as NonNullable<T>;
}

type TemplateStringValues =
  | string
  | string[]
  | boolean
  | ((e: Element) => void)
  | NamedNodeMap
  | undefined
  | null;

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
        [false, undefined, null].some((value) => item === value)
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

type Node = {
  children: Node[];
  displayName: string;
  path?: string;
  flatten: boolean;
  id: string;
};

export const buildDataStructure = async (params: Params) => {
  const get = (node: Node, path: string): Node | undefined => {
    if (path.includes('.')) {
      return path
        .split('.')
        .reduce<Node>((prev, curr) => get(prev, curr)!, node);
    }
    return node.children.find(({ displayName }) => displayName === path);
  };

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
    mainMenu: mainMenu.map((contextLink) => {
      return {
        isActive: contextLink.displayName.toLowerCase() === params.context,
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
  return buildDataStructure(params).then((data) => data[datakey]);
}

export type GetDataResponse = Awaited<ReturnType<typeof buildDataStructure>>;
export type DataKeys = keyof GetDataResponse;
export type MainMenu = GetDataResponse['mainMenu'];
export type FooterLinks = GetDataResponse['footerLinks'];
export type Personvern = GetDataResponse['personvern'];
export type HeaderMenuLinksData = GetDataResponse['headerMenuLinks'];
export type MyPageMenu = GetDataResponse['myPageMenu'];
