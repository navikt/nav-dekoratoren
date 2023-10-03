import { Driftsmelding, Link, LinkGroup, Node } from 'decorator-shared/types';
import { Context, Language, Params } from 'decorator-shared/params';
import { texts } from './texts';
import html from 'decorator-shared/html';

import { ShareScreenIcon } from 'decorator-shared/views/icons';

type LanguageParam = {
  language: Language;
};

type ContextParam = {
  context: Context;
};

type ExtractHeaderMenuLinkOptions = LanguageParam & ContextParam;
type ExtractMyPageMenuOptions = LanguageParam;
type ExtractMainMenuOptions = ContextParam;
type ExtractSimpleFooter = LanguageParam;
type ExtractComplexFooterLinks = LanguageParam & ContextParam;

const extractor = {
  headerMenuLinks(root: Node[], options: ExtractHeaderMenuLinkOptions) {
    return get(
      root,
      ((language) => {
        switch (language) {
          case 'en':
          case 'se':
            return `${language}.Header.Main menu`;
          default:
            return `no.Header.Main menu.${getContextKey(options.context)}`;
        }
      })(options.language),
    );
  },
  myPageMenu(root: Node[], options: ExtractMyPageMenuOptions) {
    return get(root, `${getLangKey(options.language)}.Header.My page menu`);
  },
  mainMenu(root: Node[], options: ExtractMainMenuOptions) {
    return get(root, 'no.Header.Main menu')?.map((link) => ({
      ...link,
      isActive: link.displayName.toLowerCase() === options.context,
    }));
  },
  simpleFooter(root: Node[], options: ExtractSimpleFooter) {
    return [
      ...(get(root, `${getLangKey(options.language)}.Footer.Personvern`)?.map(
        nodeToLink,
      ) ?? []),
      {
        content: html`${texts[options.language]
          .share_screen}${ShareScreenIcon()}`,
        url: '#',
      },
    ];
  },
  complexFooterLinks(
    root: Node[],
    { language, context }: ExtractComplexFooterLinks,
  ) {
    return [
      ...(get(
        root,
        ((language) => {
          switch (language) {
            case 'en':
            case 'se':
              return `${language}.Footer.Columns`;
            default:
              return `no.Footer.Columns.${getContextKey(context)}`;
          }
        })(language),
      )?.map(({ displayName, children }) => ({
        heading: displayName,
        children: children.map(nodeToLink),
      })) ?? []),
      {
        children: extractor.simpleFooter(root, { language }),
      },
    ];
  },
};

export default class ContentService {
  constructor(
    private fetchMenu: () => Promise<Node[]>,
    private fetchDriftsmeldinger: () => Promise<Driftsmelding[]>,
  ) {}

  async getDriftsmeldinger() {
    return this.fetchDriftsmeldinger();
  }

  async getHeaderMenuLinks(options: ExtractHeaderMenuLinkOptions) {
    return extractor.headerMenuLinks(await this.fetchMenu(), options);
  }

  async getMyPageMenu({ language }: { language: Language }) {
    return extractor.myPageMenu(await this.fetchMenu(), { language });
  }

  async getMainMenu({ context }: { context: Context }) {
    return extractor.mainMenu(await this.fetchMenu(), { context });
  }

  async getSimpleFooterLinks({ language }: { language: Language }) {
    return extractor.simpleFooter(await this.fetchMenu(), { language });
  }

  async getComplexFooterLinks({
    language,
    context,
  }: {
    language: Language;
    context: Context;
  }): Promise<LinkGroup[]> {
    return extractor.complexFooterLinks(await this.fetchMenu(), {
      language,
      context,
    });
  }

  async getFirstLoad(
    options: Pick<Params, 'context' | 'language' | 'simple' | 'simpleFooter'>,
  ) {
    const root = await this.fetchMenu();

    const base = {
      mainMenu: extractor.mainMenu(root, options),
      headerMenuLinks: extractor.headerMenuLinks(root, options),
      myPageMenu: extractor.myPageMenu(root, options),
    };

    if (options.simple) {
      return {
        ...base,
        footerLinks: extractor.simpleFooter(root, options),
      };
    }

    return {
      ...base,
      footerLinks: extractor.complexFooterLinks(root, options),
    };
  }
}

const nodeToLink: (node: Node) => Link = ({ displayName, path }) => ({
  content: displayName,
  url: path ?? '#',
});

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
