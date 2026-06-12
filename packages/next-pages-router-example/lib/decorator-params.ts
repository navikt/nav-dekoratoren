import type {
    DecoratorLocale,
    DecoratorParams,
} from "@navikt/nav-dekoratoren-moduler/ssr";

const validLanguages = ["nb", "nn", "en", "se", "pl", "uk", "ru"] as const;
const validContexts = [
    "privatperson",
    "arbeidsgiver",
    "samarbeidspartner",
] as const;

const isValidLanguage = (value: string | null): value is DecoratorLocale =>
    validLanguages.includes(value as DecoratorLocale);

const isValidContext = (
    value: string | null,
): value is NonNullable<DecoratorParams["context"]> =>
    validContexts.includes(value as NonNullable<DecoratorParams["context"]>);

const routeTitle = (pathname: string) => {
    if (pathname.startsWith("/arbeidsgiver")) {
        return "Arbeidsgiver";
    }

    if (pathname.startsWith("/sak/")) {
        return `Sak ${pathname.split("/").at(-1)}`;
    }

    if (pathname.startsWith("/person")) {
        return "Person";
    }

    return "Forside";
};

const chatbotVisibleParam = (
    url: URL,
): Pick<DecoratorParams, "chatbotVisible"> =>
    url.searchParams.has("chatbotVisible")
        ? { chatbotVisible: url.searchParams.get("chatbotVisible") === "true" }
        : {};

export const buildDecoratorParams = (asPath = "/"): DecoratorParams => {
    const url = new URL(asPath, "http://localhost:3000");
    const queryLanguage = url.searchParams.get("language");
    const queryContext = url.searchParams.get("context");
    const pathname = url.pathname;
    const title = routeTitle(pathname);

    const language = isValidLanguage(queryLanguage) ? queryLanguage : "nb";
    const context = isValidContext(queryContext)
        ? queryContext
        : pathname.startsWith("/arbeidsgiver")
          ? "arbeidsgiver"
          : "privatperson";

    return {
        context,
        language,
        availableLanguages: [
            { locale: "nb", handleInApp: true },
            { locale: "en", handleInApp: true },
        ],
        breadcrumbs:
            pathname === "/" || pathname.startsWith("/arbeidsgiver")
                ? []
                : [
                      {
                          title: "Forside",
                          url: "https://www.nav.no",
                      },
                      {
                          title,
                          url: pathname,
                          handleInApp: true,
                      },
                  ],
        chatbot: true,
        pageType: title.toLowerCase().replaceAll(" ", "-"),
        simple: url.searchParams.get("simple") === "true",
        ...chatbotVisibleParam(url),
    };
};
