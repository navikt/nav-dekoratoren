import {
  Driftsmelding,
  Link,
  LinkGroup,
  MainMenuContextLink,
  Node,
} from 'decorator-shared/types';
import { Context, Language, Params } from 'decorator-shared/params';

type LanguageParam = {
  language: Language;
};

type ContextParam = {
  context: Context;
};

type MainMenuLinkOptions = LanguageParam & ContextParam;
type ExtractHeaderMenuLinkOptions = LanguageParam & ContextParam;
type ExtractMyPageMenuOptions = LanguageParam;
type ExtractSimpleFooter = LanguageParam;
type ExtractComplexFooterLinks = LanguageParam & ContextParam;

const extractor = {
  mainMenuLinks(root: Node[], options: MainMenuLinkOptions) {
    return (
      get(
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
      )?.map(nodeToLinkGroup) ?? []
    );
  },
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
  simpleFooter(root: Node[], options: ExtractSimpleFooter) {
    return [
      ...(get(root, `${getLangKey(options.language)}.Footer.Personvern`)?.map(
        nodeToLink,
      ) ?? []),
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

  async mainMenuContextLinks({
    context,
    bedrift,
  }: {
    context: Context;
    bedrift?: string;
  }): Promise<MainMenuContextLink[]> {
    switch (context) {
      case 'privatperson':
        return [
          {
            content: 'Min side',
            url: process.env.MIN_SIDE_URL ?? '#',
          },
          {
            content: 'Arbeidsgiver',
            url: `${process.env.XP_BASE_URL}/no/bedrift`,
          },
          {
            content: 'Samarbeidspartner',
            url: `${process.env.XP_BASE_URL}/no/samarbeidspartner`,
          },
        ];
      case 'arbeidsgiver':
        return [
          {
            content: 'Min side - arbeidsgiver',
            description: 'Dine sykmeldte, rekruttering, digitale skjemaer',
            url: `${process.env.MINSIDE_ARBEIDSGIVER_URL}${
              bedrift ? `?bedrift=${bedrift}` : ''
            }`,
          },
          {
            content: 'Privat',
            description:
              'Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester',
            url: `${process.env.XP_BASE_URL}/`,
          },
          {
            content: 'Samarbeidspartner',
            description:
              'Helsepersonell, tiltaksarrangører, fylker og kommuner',
            url: `${process.env.XP_BASE_URL}/no/samarbeidspartner`,
          },
        ];
      case 'samarbeidspartner':
        return [
          {
            content: 'Privat',
            url: `${process.env.XP_BASE_URL}/`,
          },
          {
            content: 'Arbeidsgiver',
            url: `${process.env.XP_BASE_URL}/no/bedrift`,
          },
        ];
    }
  }

  async getMainMenuLinks({
    language,
    context,
  }: {
    language: Language;
    context: Context;
  }) {
    return extractor.mainMenuLinks(await this.fetchMenu(), {
      language,
      context,
    });
  }

  async getDriftsmeldinger() {
    return this.fetchDriftsmeldinger();
  }

  async getHeaderMenuLinks(options: ExtractHeaderMenuLinkOptions) {
    return extractor.headerMenuLinks(await this.fetchMenu(), options);
  }

  async getMyPageMenu({ language }: { language: Language }) {
    return extractor.myPageMenu(await this.fetchMenu(), { language });
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
      headerMenuLinks: extractor.headerMenuLinks(root, options),
      myPageMenu: extractor.myPageMenu(root, options),
      mainMenuLinks: extractor.mainMenuLinks(root, options),
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

const nodeToLinkGroup: (node: Node) => LinkGroup = ({
  displayName,
  children,
}) => ({
  heading: displayName,
  children: children.map(nodeToLink),
});

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
  const getRecursive = (
    node: Node | undefined,
    path: string,
  ): Node | undefined => {
    if (path.includes('.')) {
      return path
        .split('.')
        .reduce((prev, curr) => getRecursive(prev, curr)!, node);
    }
    return node?.children?.find(({ displayName }) => displayName === path);
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
