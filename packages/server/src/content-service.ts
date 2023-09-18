import { Node } from 'decorator-shared/types';
import { Context, Language } from 'decorator-shared/params';

export default class ContentService {
  constructor(private fetchMenu: () => Promise<Node[]>) {}

  async getHeaderMenuLinks({
    language,
    context,
  }: {
    language: Language;
    context: Context;
  }) {
    return get(
      await this.fetchMenu(),
      ((language) => {
        switch (language) {
          case 'en':
          case 'se':
            return `${language}.Header.Main menu`;
          default:
            return `no.Header.Main menu.${getContextKey(context)}`;
        }
      })(language),
    );
  }

  async getMyPageMenu({ language }: { language: Language }) {
    return get(
      await this.fetchMenu(),
      `${getLangKey(language)}.Header.My page menu`,
    );
  }

  async getMainMenu({ context }: { context: Context }) {
    return get(await this.fetchMenu(), 'no.Header.Main menu')?.map((link) => ({
      ...link,
      isActive: link.displayName.toLowerCase() === context,
    }));
  }

  async getPersonvern() {
    return get(await this.fetchMenu(), 'no.Footer.Personvern');
  }

  async getFooterLinks({
    language,
    context,
  }: {
    language: Language;
    context: Context;
  }) {
    return get(
      await this.fetchMenu(),
      ((language) => {
        switch (language) {
          case 'en':
          case 'se':
            return `${language}.Footer.Columns`;
          default:
            return `no.Footer.Columns.${getContextKey(context)}`;
        }
      })(language),
    );
  }
}

function getContextKey(context: Context) {
  return context.charAt(0).toUpperCase() + context.slice(1);
}

type ContentLangKey = 'no' | 'en' | 'se';
const getLangKey = (lang: Language): ContentLangKey => {
  switch (lang) {
    case 'en':
      return 'en';
    case 'se':
      return 'se';
    default:
      return 'no';
  }
};

const get = (menu: Node[], path: string): Node[] | undefined => {
  const getRecursive = (node: Node, path: string): Node | undefined => {
    if (path.includes('.')) {
      return path
        .split('.')
        .reduce<Node>((prev, curr) => getRecursive(prev, curr)!, node);
    }
    return node.children.find(({ displayName }) => displayName === path);
  };

  return getRecursive(
    {
      children: menu,
      displayName: '',
      id: '',
    },
    path,
  )?.children;
};
