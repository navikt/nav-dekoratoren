import { Link, LinkGroup, Node } from 'decorator-shared/types';
import { Context, Language } from 'decorator-shared/params';
import { texts } from 'decorator-shared/texts';
import html from 'decorator-shared/html';

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

  async getSimpleFooterLinks({ language }: { language: Language }) {
    return [
      ...(get(
        await this.fetchMenu(),
        `${getLangKey(language)}.Footer.Personvern`,
      )?.map(nodeToLink) ?? []),
      {
        content: html`${texts[language].share_screen}<svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.25 4.5c0-.69.56-1.25 1.25-1.25h17c.69 0 1.25.56 1.25 1.25v11c0 .69-.56 1.25-1.25 1.25h-7.75v2.5H19a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5h5.25v-2.5H3.5c-.69 0-1.25-.56-1.25-1.25v-11Zm1.5.25v10.5h16.5V4.75H3.75Z"
              fill="currentColor"
            ></path>
          </svg>`,
        url: '#',
      },
    ];
  }

  async getComplexFooterLinks({
    language,
    context,
  }: {
    language: Language;
    context: Context;
  }): Promise<LinkGroup[]> {
    return [
      ...(get(
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
      )?.map(({ displayName, children }) => ({
        heading: displayName,
        children: children.map(nodeToLink),
      })) ?? []),
      {
        children: await this.getSimpleFooterLinks({ language }),
      },
    ];
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
