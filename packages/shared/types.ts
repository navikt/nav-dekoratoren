import { Context, Environment, ClientParams, Params } from "./params";
import { nb } from "decorator-server/src/texts";

export type Link = {
    content: string;
    url: string;
    path?: string;
};

export type LinkGroup = {
    heading?: string;
    children: Link[];
};

export const clientTextsKeys = [
    "breadcrumbs",
    "important_info",
    "loading_preview",
    "loading",
    "open_chat",
] as const satisfies Array<keyof Texts>;

export type ClientTexts = Pick<Texts, (typeof clientTextsKeys)[number]>;

type NBTexts = typeof nb;
type NBTextKeys = keyof NBTexts;
export type Texts = {
    [key in NBTextKeys]: NBTexts[key] extends string ? string : NBTexts[key];
};

export type OpsMessage = {
    heading: string;
    url: string;
    type: "prodstatus" | "info";
    urlscope: string[];
};

export type Features = {
    "dekoratoren.skjermdeling": boolean;
    "dekoratoren.chatbotscript": boolean;
};

/**
 * Computed values based on params and environment
 */
export type AppState = {
    texts: ClientTexts;
    params: ClientParams;
    // These are parameters explicitly set in the request from the consuming application
    // Does not include default fallback values for required params, and only includes a few select
    // params for which this data is needed in the client
    rawParams?: Partial<ClientParams>;
    env: Environment;
    features: Features;
    // Head assets are included here only for legacy implementations, where they are injected on the client-side.
    // In the new implemention, head elements are included in the payload from the /ssr endpoint instead
    // and should be included in the server-HTML of consuming applications
    headAssets?: HtmlElementProps[];
    allowedStorage: PublicStorage[];
};

export type MainMenuContextLink = {
    content: string;
    description?: string;
    url: string;
};

export type CsrPayload = {
    header: string;
    footer: string;
    data: AppState;
    scripts: HtmlElementProps[];
};

export type HtmlElementProps = {
    tag: string;
    attribs: Record<string, string>;
    body?: string;
};

type StorageType = "cookie" | "localstorage" | "sessionstorage";

export type StorageConfig = {
    name: string;
    type: StorageType[];
    service: string;
    description: string;
    optional: boolean;
};

export type DecoratorDataProps = {
    features: Features;
    params: Params;
    rawParams: Record<string, string>;
    headAssets?: HtmlElementProps[];
};

export type PublicStorage = Pick<
    StorageConfig,
    "name" | "optional" | "type"
> & {
    type: StorageType;
};
