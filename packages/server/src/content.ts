import { Node } from 'decorator-shared/types';
import { Context, Language } from 'decorator-shared/params';

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

export const getHeaderMenuLinks = ({
  menu,
  language,
  context,
}: {
  menu: Node[];
  language: Language;
  context: Context;
}) =>
  get(
    menu,
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

export const getMyPageMenu = (menu: Node[], language: Language) =>
  get(menu, `${getLangKey(language)}.Header.My page menu`);

export const getMainMenu = (menu: Node[], context: Context) =>
  get(menu, 'no.Header.Main menu')?.map((link) => ({
    ...link,
    isActive: link.displayName.toLowerCase() === context,
  }));

export const getPersonvern = (menu: Node[]) =>
  get(menu, 'no.Footer.Personvern');

export const getFooterLinks = (
  menu: Node[],
  language: Language,
  context: Context,
) =>
  get(
    menu,
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
