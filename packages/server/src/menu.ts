import { ResponseCache } from "decorator-shared/cache";
import { Context, Language } from "decorator-shared/params";
import {
    Link,
    LinkGroup,
    MainMenuContextLink,
    MenuNode,
} from "decorator-shared/types";
import { clientEnv, env } from "./env/server";

const TEN_SECONDS_MS = 10 * 1000;

const menuCache = new ResponseCache<MenuNode[]>({ ttl: TEN_SECONDS_MS });

export const fetchMenu = async (): Promise<MenuNode[]> => {
    const menu = await menuCache.get("menu", () =>
        fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`).then(
            (response) => response.json() as Promise<MenuNode[]>,
        ),
    );

    return menu || [];
};

export const mainMenuContextLinks = async ({
    context,
    bedrift,
}: {
    context: Context;
    bedrift?: string;
}): Promise<MainMenuContextLink[]> => {
    switch (context) {
        case "privatperson":
            return [
                {
                    content: "Min side",
                    url: clientEnv.MIN_SIDE_URL ?? "#",
                },
                {
                    content: "Arbeidsgiver",
                    url: `${env.XP_BASE_URL}/no/bedrift`,
                },
                {
                    content: "Samarbeidspartner",
                    url: `${env.XP_BASE_URL}/no/samarbeidspartner`,
                },
            ];
        case "arbeidsgiver":
            return [
                {
                    content: "Min side - arbeidsgiver",
                    description:
                        "Dine sykmeldte, rekruttering, digitale skjemaer",
                    url: `${clientEnv.MIN_SIDE_ARBEIDSGIVER_URL}${bedrift ? `?bedrift=${bedrift}` : ""}`,
                },
                {
                    content: "Privat",
                    description:
                        "Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester",
                    url: `${env.XP_BASE_URL}/`,
                },
                {
                    content: "Samarbeidspartner",
                    description:
                        "Helsepersonell, tiltaksarrangører, fylker og kommuner",
                    url: `${env.XP_BASE_URL}/no/samarbeidspartner`,
                },
            ];
        case "samarbeidspartner":
            return [
                {
                    content: "Privat",
                    url: `${env.XP_BASE_URL}/`,
                },
                {
                    content: "Arbeidsgiver",
                    url: `${env.XP_BASE_URL}/no/bedrift`,
                },
            ];
    }
};

export const getMainMenuLinks = async ({
    language,
    context,
}: {
    language: Language;
    context: Context;
}) => {
    return (
        get(
            await fetchMenu(),
            ((language) => {
                switch (language) {
                    case "en":
                    case "se":
                        return `${language}.Header.Main menu`;
                    default:
                        return `no.Header.Main menu.${getContextKey(context)}`;
                }
            })(language),
        )?.map(nodeToLinkGroup) ?? []
    );
};

export const getSimpleFooterLinks = async ({
    language,
}: {
    language: Language;
}) => {
    return [
        ...(get(
            await fetchMenu(),
            `${getLangKey(language)}.Footer.Personvern`,
        )?.map(nodeToLink) ?? []),
    ];
};

export const getComplexFooterLinks = async ({
    language,
    context,
}: {
    language: Language;
    context: Context;
}): Promise<LinkGroup[]> => {
    const root = await fetchMenu();

    return [
        ...(get(
            root,
            ((language) => {
                switch (language) {
                    case "en":
                    case "se":
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
            children: await getSimpleFooterLinks({ language }),
        },
    ];
};

const nodeToLinkGroup: (node: MenuNode) => LinkGroup = ({
    displayName,
    children,
}) => ({
    heading: displayName,
    children: children.map(nodeToLink),
});

const nodeToLink: (node: MenuNode) => Link = ({ displayName, path }) => ({
    content: displayName,
    url: path ?? "#",
});

function getContextKey(context: Context) {
    return context.charAt(0).toUpperCase() + context.slice(1);
}

type ContentLangKey = "no" | "en" | "se";

const getLangKey = (lang: Language): ContentLangKey => {
    switch (lang) {
        case "en":
            return "en";
        case "se":
            return "se";
        default:
            return "no";
    }
};

const get = (menu: MenuNode[], path: string): MenuNode[] | undefined => {
    const getRecursive = (
        node: MenuNode | undefined,
        path: string,
    ): MenuNode | undefined => {
        if (path.includes(".")) {
            return path
                .split(".")
                .reduce((prev, curr) => getRecursive(prev, curr)!, node);
        }
        return node?.children?.find(({ displayName }) => displayName === path);
    };

    return getRecursive(
        {
            children: menu,
            displayName: "",
            id: "",
        },
        path,
    )?.children;
};
