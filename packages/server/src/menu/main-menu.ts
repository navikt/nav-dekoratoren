import { Context, Language } from "decorator-shared/params";
import { ResponseCache } from "decorator-shared/response-cache";
import { Link, LinkGroup, MainMenuContextLink } from "decorator-shared/types";
import { z } from "zod";
import { clientEnv, env } from "../env/server";
import { isNorwegian } from "../i18n";
import { fetchAndValidateJson } from "../lib/fetch-and-validate";
import fallbackData from "./main-menu-mock.json";
import { logger } from "../lib/logger";

type MenuNode = z.infer<typeof baseMainMenuNode> & { children: MenuNode[] };
type MainMenu = z.infer<typeof mainmenuSchema>;

const MENU_SERVICE_URL = `${env.ENONICXP_SERVICES}/no.nav.navno/menu`;

const ONE_MINUTE_MS = 60 * 1000;

const menuCache = new ResponseCache<MainMenu>({
    ttl: ONE_MINUTE_MS,
});

const baseMainMenuNode = z.object({
    id: z.string(),
    displayName: z.string(),
    frontendEventID: z.string().optional(),
    path: z.string().optional(),
    flatten: z.boolean().optional(),
    isMyPageMenu: z.boolean().optional(),
});

const mainMenuNode: z.ZodType<MenuNode> = baseMainMenuNode.extend({
    children: z.lazy(() => mainMenuNode.array()),
});

const mainmenuSchema = z.array(mainMenuNode);

const fetchMenu = async (): Promise<MainMenu> => {
    const menuFromService = await menuCache.get("menu", () =>
        fetchAndValidateJson(MENU_SERVICE_URL, undefined, mainmenuSchema).then(
            (res) => {
                if (!res.ok) {
                    logger.error(
                        `Error fetching menu from Enonic - ${res.error}`,
                    );
                    return null;
                }

                return res.data;
            },
        ),
    );

    // The fallback/mock data should "never" be returned, unless the call to the menu service
    // fails on a fresh pod with no menu response cached. It's not a perfect solution to use
    // possibly stale "mock" data here, but it is a very rare edge case...
    return menuFromService ?? fallbackData;
};

export const mainMenuContextLinks = ({
    context,
    language,
    bedrift,
}: {
    context: Context;
    language: Language;
    bedrift?: string;
}): MainMenuContextLink[] => {
    if (!isNorwegian(language)) {
        return [];
    }
    switch (context) {
        case "privatperson":
            return [
                {
                    content: "Min side",
                    url: clientEnv.MIN_SIDE_URL ?? "#",
                },
                {
                    content: "Arbeidsgiver",
                    url: `${env.XP_BASE_URL}/arbeidsgiver`,
                },
                {
                    content: "Samarbeidspartner",
                    url: `${env.XP_BASE_URL}/samarbeidspartner`,
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
                    url: `${env.XP_BASE_URL}/samarbeidspartner`,
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
                    url: `${env.XP_BASE_URL}/arbeidsgiver`,
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
    const menu = await fetchMenu();

    return (
        get(
            menu,
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
    const menu = await fetchMenu();

    return (
        get(menu, `${getLangKey(language)}.Footer.Personvern`)?.map(
            nodeToLink,
        ) ?? []
    );
};

export const getComplexFooterLinks = async ({
    language,
    context,
}: {
    language: Language;
    context: Context;
}): Promise<LinkGroup[]> => {
    const menu = await fetchMenu();

    return [
        ...(get(
            menu,
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

const getUrl = (path: string | undefined) => {
    return path?.startsWith("http") ? path : `${env.XP_BASE_URL}${path ?? ""}`;
};

const nodeToLink: (node: MenuNode) => Link = ({
    displayName,
    path,
    frontendEventID,
}) => {
    const hasEventId = !!frontendEventID;

    return {
        content: displayName,
        url: hasEventId ? "#" : getUrl(path),
        attributes:
            frontendEventID?.toUpperCase() === "ENDRE_COOKIE_SAMTYKKE"
                ? { "data-consent-banner-trigger": "true" }
                : undefined,
    };
};

const getContextKey = (context: Context) => {
    return context.charAt(0).toUpperCase() + context.slice(1);
};

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

const get = (menu: MenuNode[], path: string): MenuNode[] | undefined => {
    return getRecursive(
        {
            children: menu,
            displayName: "",
            id: "",
        },
        path,
    )?.children;
};
