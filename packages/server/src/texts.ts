import { Language, Context } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";

export const nb = {
    skip_link: "Hopp til hovedinnhold",
    share_screen: "Del skjerm med veileder",
    to_top: "Til toppen",
    menu: "Meny",
    close: "Lukk",
    did_you_find: "Fant du det du lette etter?",
    search: "Søk",
    search_nav_no: "Søk på nav.no",
    consent_banner_title: "Får vi bruke valgfrie informasjon&shy;skapsler?",
    consent_banner_text:
        "Hvis du svarer ja, bruker vi informasjons­­kapsler og lignende teknologi til statistikk, analyse, spørreundersøkelser og bruker­tester. Målet er å forstå hvordan du og andre bruker nav.no, slik at vi kan forbedre nettsidene og tjenestene våre.",
    consent_banner_consent_all: "Ja",
    consent_banner_refuse_optional: "Nei",
    consent_banner_about_cookies: "Om informasjonskapsler",
    consent_banner_change_consent:
        "Du kan når som helst endre samtykket ditt via lenken i bunnmenyen.",
    consent_banner_additional_cookies_info:
        "Vi har også nødvendige informasjonskapsler, som ikke kan velges bort.",
    consent_banner_additional_cookies_link: "Om informasjonskapslene våre.",
    consent_banner_minimized:
        "Velg hvilke informasjons&shy;kapsler Nav kan bruke.",
    clear: "Tøm",
    login: "Logg inn",
    logout: "Logg ut",
    logged_in: "Logget inn",
    breadcrumbs: "Du er her",
    language_selector: "Velg språk",
    notifications: "Varsler",
    notifications_empty_list: "Du har ingen nye varsler",
    notifications_empty_list_description: "Vi varsler deg når noe skjer.",
    notifications_show_all: "Se tidligere varsler",
    notifications_messages_title: "Beskjeder",
    notified_EPOST: "Varslet på e-post",
    notified_SMS: "Varslet på SMS",
    notified_SMS_and_EPOST: "Varslet på e-post og SMS",
    earlier_notifications: "Tidligere varsler",
    message: "Beskjed",
    task: "Oppgave",
    inbox: "Beskjed",
    masked_message_text:
        "Du har fått en melding, logg inn med høyere sikkerhetsnivå for å se meldingen.",
    masked_task_text:
        "Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.",
    archive: "Merk som lest",
    notifications_tasks_title: "Oppgaver",
    token_warning_title: "Du blir snart logget ut automatisk",
    token_warning_body: "Vil du fortsatt være innlogget?",
    session_warning_title:
        'Du blir logget ut automatisk om ca. <span class="session-time-remaining">$1</span> minutter',
    session_warning_body: "Avslutt det du jobber med og logg inn igjen.",
    yes: "Ja",
    no: "Nei",
    ok: "OK",
    feedback: "Tilbakemelding",
    hensikt_med_tilbakemelding:
        "Du får dessverre ikke svar på tilbakemeldingen din. Har du spørsmål eller trenger du hjelp?",
    hensikt_med_tilbakemelding_lenke: "Ring, chat eller skriv til oss",
    send_undersokelse_takk: "Takk for tilbakemeldingen!",
    privatperson: "Privat",
    arbeidsgiver: "Arbeidsgiver",
    samarbeidspartner: "Samarbeidspartner",
    meny_bunnlenke_minside_stikkord:
        "Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester",
    meny_bunnlenke_arbeidsgiver_stikkord:
        "Dine sykmeldte, rekruttering, digitale skjemaer",
    meny_bunnlenke_samarbeidspartner_stikkord:
        "Helsepersonell, tiltaksarrangører, fylker og kommuner",
    loading_notifications: "Laster varslinger",
    notifications_error: "Feil ved lasting av varsler.",
    search_error: "Feil ved lasting av søkeresultater.",
    how_can_we_help: "Hva kan vi hjelpe deg med?",
    showing: "Viser",
    of: "av",
    results: "resultater",
    search_hits_heading: ({
        total,
        query,
        context,
    }: {
        total: number;
        query: string;
        context: Context;
    }) => `${total} treff for «${query}» for ${context}`,
    more_hits: "Flere treff",
    change_search_filter: "Endre søkefilter for å se andre treff",
    loading_preview: "Laster forhåndsvisning",
    to_front_page: "Til forsiden",
    important_info: "Viktig informasjon: ",
    footer_del_skjerm: "Del skjerm med veileder",
    delskjerm_modal_beskrivelse:
        "Gi veilederen du snakker med på telefon tilgang til å se det du ser på nav.no.",
    delskjerm_modal_start: "Start skjermdeling",
    delskjerm_modal_label: "Skriv inn koden du får fra veilederen",
    delskjerm_modal_avbryt: "Avbryt",
    delskjerm_modal_feilmelding: "Må bestå av 5 siffer",
    delskjerm_modal_hjelpetekst_overskrift: "Hva er skjermdeling?",
    delskjerm_modal_hjelpetekst_0:
        "Når du deler skjerm med Nav kontaktsenter kan veilederen hjelpe deg med å finne fram på nav.no.",
    delskjerm_modal_hjelpetekst_1:
        "Veilederen ser kun det du ser på nav.no og kan ikke fylle inn opplysninger eller sende inn noe på dine vegne.",
    delskjerm_modal_hjelpetekst_2:
        "Det er du som godkjenner skjermdeling. Ingenting blir lagret.",
    delskjerm_modal_stengt:
        "Skjermdeling er for øyeblikket stengt, prøv igjen senere.",
    security_level_info:
        "Du har logget inn med MinID. Hvis du logger inn med et høyere sikkerhetsnivå, får du se mer innhold og flere tjenester.",
    security_level_link: "Logg inn med BankID, Buypass, eller Commfides.",
    go_to_my_page: "Gå til Min side",
    my_page: "Min side",
    my_page_employer: "Min side - Arbeidsgiver",
    loading: "Laster",
    personopplysninger: "Personopplysninger",
    open_chat: "Åpne chat",
    info: "Informasjon",
    error: "Feil",
} as const;

const en: Texts = {
    skip_link: "Go to main content",
    share_screen: "Share screen with your counsellor",
    to_top: "To the top",
    menu: "Menu",
    consent_banner_title: "Can we use optional cookies?",
    consent_banner_text:
        "If you answer yes, we will use cookies and similar technologies for statistics, analysis, surveys, and user tests. The goal is to understand how people use nav.no, so we can improve our website and services.",
    consent_banner_consent_all: "Yes",
    consent_banner_refuse_optional: "No",
    consent_banner_change_consent:
        "You can  change your consent at any time through the link in the footer menu.",
    consent_banner_additional_cookies_info:
        "We also use essential cookies that you cannot opt out of.",
    consent_banner_additional_cookies_link: "About our cookies.",
    consent_banner_about_cookies: "About cookies",
    consent_banner_minimized: "Choose which cookies Nav can use.",
    close: "Close",
    did_you_find: "Did you find what you were looking for?",
    search: "Search",
    search_nav_no: "Search nav.no",
    clear: "Clear",
    login: "Log in",
    logout: "Log out",
    logged_in: "Logged in",
    breadcrumbs: "You are here",
    language_selector: "Choose language",
    notifications: "Notifications",
    notifications_empty_list: "You have no new notifications",
    notifications_empty_list_description:
        "We will notify you when something happens.",
    notifications_show_all: "Previous notifications",
    notifications_messages_title: "Beskjeder",
    notified_EPOST: "Notified by e-mail",
    notified_SMS: "Notified by SMS",
    notified_SMS_and_EPOST: "Notified by e-mail and SMS",
    earlier_notifications: "Earlier notifications",
    message: "Message",
    task: "Task",
    inbox: "Message",
    masked_message_text:
        "You have a message, please log in with a higher security level to read the message.",
    masked_task_text:
        "You have a task, please log in with a higher security level to see the task.",
    archive: "Mark as read",
    notifications_tasks_title: "Tasks",
    token_warning_title: "You will soon be logged out automatically",
    token_warning_body: "Would you like to stay logged in?",
    session_warning_title:
        'You will be logged out automatically in about <span class="session-time-remaining">$1</span> minutes',
    session_warning_body: "Avslutt det du jobber med og logg inn igjen.",
    yes: "Yes",
    no: "No",
    ok: "OK",
    feedback: "Feedback",
    hensikt_med_tilbakemelding:
        "Unfortunately you will not get a reply to your feedback. Do you have questions or need help?",
    hensikt_med_tilbakemelding_lenke: "Call, chat or write to us",
    send_undersokelse_takk: "Thank you for your feedback!",
    privatperson: "Private",
    arbeidsgiver: "Employer",
    samarbeidspartner: "Collaborator",
    meny_bunnlenke_minside_stikkord:
        "Your cases, payments, messages, report cards, activity plan, personal information and more services",
    meny_bunnlenke_arbeidsgiver_stikkord:
        "Your sick leave, recruitment, digital forms",
    meny_bunnlenke_samarbeidspartner_stikkord:
        "Health personnel, intervention organizers, counties and municipalities",
    loading_notifications: "Loading notifications",
    notifications_error: "Error loading notifications.",
    search_error: "Error loading search results.",
    how_can_we_help: "How can we help you?",
    showing: "Showing",
    of: "of",
    results: "results",
    search_hits_heading: ({ total, query }) =>
        `${total} hits for "${query}" for individuals`,
    more_hits: "More hits",
    change_search_filter: "Change search filter to see other hits",
    loading_preview: "Loading preview",
    to_front_page: "To the front page",
    important_info: "Imporant information: ",
    footer_del_skjerm: "Share screen with your counsellor",
    delskjerm_modal_beskrivelse:
        "Give the counsellor access to see the same content as you on nav.no.",
    delskjerm_modal_start: "Start screen sharing",
    delskjerm_modal_label: "Enter the code you received from the counsellor",
    delskjerm_modal_avbryt: "Cancel",
    delskjerm_modal_feilmelding: "Must be 5 digits",
    delskjerm_modal_hjelpetekst_overskrift: "What is screen sharing?",
    delskjerm_modal_hjelpetekst_0:
        "When you share your screen, the counsellor can help you navigate nav.no.",
    delskjerm_modal_hjelpetekst_1:
        "The counsellor can only see what you see on nav.no and can't fill in any information or send anything on your behalf.",
    delskjerm_modal_hjelpetekst_2:
        "Screen sharing must be approved by you. Nothing is stored.",
    delskjerm_modal_stengt:
        "Screen sharing is currently closed, please try again later.",
    security_level_info:
        "You are logged in with MinID. If you log in with a higher security level, you will see more content and additional services.",
    security_level_link: "Log in with BankID, Buypass, or Commfides.",
    go_to_my_page: "Go to my page",
    my_page: "My page",
    my_page_employer: "My page - Employer",
    loading: "Loading",
    personopplysninger: "Personal information",
    open_chat: "Open chat",
    info: "Information",
    error: "Error",
} as const satisfies Texts;

export const texts: Record<Language, Texts> = {
    nb,
    en,
    se: {
        ...nb,
        search: "Oza",
        login: "Sisačáliheapmi",
        logout: "Olggosčáliheapmi",
    },
    nn: nb,
    pl: en,
    uk: en,
    ru: en,
} as const;
