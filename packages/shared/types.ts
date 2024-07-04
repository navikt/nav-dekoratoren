import { Context, Environment, Params } from "./params";

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
    "token_warning_title",
    "token_warning_body",
    "send_undersokelse_takk",
    "hensikt_med_tilbakemelding",
    "hensikt_med_tilbakemelding_lenke",
    "session_warning_title",
    "session_warning_body",
    "ok",
    "yes",
    "logout",
    "login",
    "important_info",
    "loading_preview",
    "loading",
    "open_chat",
] as const;

export type ClientTexts = {
    [K in (typeof clientTextsKeys)[number]]: string;
};

export type Texts = ClientTexts & {
    skip_link: string;
    share_screen: string;
    to_top: string;
    menu: string;
    close: string;
    did_you_find: string;
    search: string;
    clear: string;
    login: string;
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
    rolle_privatperson: string;
    rolle_arbeidsgiver: string;
    rolle_samarbeidspartner: string;
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
};

export type OpsMessage = {
    heading: string;
    url: string;
    type: "prodstatus" | "info";
    urlscope: string[];
};

export type TextKey = keyof Texts;
export type WithTexts<T = object> = T & {
    texts: Texts;
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
    params: Params;
    env: Environment;
    features: Features;
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
    cssUrl: string;
};

export type HtmlElementProps = {
    tag: string;
    attribs: Record<string, string>;
    body?: string;
};
