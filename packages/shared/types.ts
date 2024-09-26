import { Context, Environment, ClientParams } from "./params";

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

export type Texts = {
    breadcrumbs: string;
    important_info: string;
    loading_preview: string;
    loading: string;
    open_chat: string;
    token_warning_title: string;
    token_warning_body: string;
    feedback: string;
    send_undersokelse_takk: string;
    hensikt_med_tilbakemelding: string;
    hensikt_med_tilbakemelding_lenke: string;
    session_warning_title: string;
    session_warning_body: string;
    ok: string;
    yes: string;
    logout: string;
    login: string;
    skip_link: string;
    share_screen: string;
    to_top: string;
    menu: string;
    close: string;
    did_you_find: string;
    search: string;
    clear: string;
    logged_in: string;
    language_selector: string;
    notifications: string;
    notifications_empty_list: string;
    notifications_empty_list_description: string;
    notifications_show_all: string;
    notifications_messages_title: string;
    notified_EPOST: string;
    notified_SMS: string;
    notified_SMS_and_EPOST: string;
    earlier_notifications: string;
    message: string;
    task: string;
    inbox: string;
    masked_message_text: string;
    masked_task_text: string;
    archive: string;
    notifications_tasks_title: string;
    no: string;
    search_nav_no: string;
    privatperson: string;
    arbeidsgiver: string;
    samarbeidspartner: string;
    meny_bunnlenke_minside_stikkord: string;
    meny_bunnlenke_arbeidsgiver_stikkord: string;
    meny_bunnlenke_samarbeidspartner_stikkord: string;
    loading_notifications: string;
    notifications_error: string;
    search_error: string;
    how_can_we_help: string;
    showing: string;
    of: string;
    results: string;
    search_hits_heading: (args: {
        total: number;
        query: string;
        context: Context;
    }) => string;
    more_hits: string;
    to_front_page: string;
    change_search_filter: string;
    footer_del_skjerm: string;
    delskjerm_modal_beskrivelse: string;
    delskjerm_modal_start: string;
    delskjerm_modal_label: string;
    delskjerm_modal_avbryt: string;
    delskjerm_modal_feilmelding: string;
    delskjerm_modal_hjelpetekst_overskrift: string;
    delskjerm_modal_hjelpetekst_0: string;
    delskjerm_modal_hjelpetekst_1: string;
    delskjerm_modal_hjelpetekst_2: string;
    delskjerm_modal_stengt: string;
    security_level_info: string;
    security_level_link: string;
    go_to_my_page: string;
    my_page: string;
    personopplysninger: string;
    my_page_employer: string;
    info: string;
    error: string;
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
