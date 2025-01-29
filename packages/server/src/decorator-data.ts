import {
    AppState,
    ClientTexts,
    clientTextsKeys,
    DecoratorDataProps,
    PublicStorageItem,
    AllowedStorageItem,
} from "decorator-shared/types";
import {
    clientParamKeys,
    ClientParams,
    validateRawParams,
} from "decorator-shared/params";

import { clientEnv } from "./env/server";
import { texts } from "./texts";

const storageDictionary: Set<AllowedStorageItem> = new Set([
    {
        name: "BIGipServerpool_pr_gcp_navno_lb_https",
        type: ["cookie"],
        service: "BigIP",
        description:
            "Brukes for effektiv kommunikasjon mellom nettleseren og nav.no.",
        optional: false,
    },
    {
        name: "com.grafana.faro*",
        type: ["sessionstorage"],
        service: "Grafana",
        description:
            "Overvåker teknisk status på nav.no og relaterte tjenester.",
        optional: false,
    },
    {
        name: "decorator-",
        type: ["cookie"],
        service: "Dekoratøren",
        description: "Husker brukerens kontekst og valgt språk.",
        optional: false,
    },
    {
        name: "nav-chatbot",
        type: ["cookie"],
        service: "Nav chatbot",
        description:
            "Husker brukerens chatbot-samtale for å fortsette på tvers av sider.",
        optional: false,
    },
    {
        name: "__next_scroll",
        type: ["sessionstorage"],
        service: "Nav.no (Next)",
        description: "Husker rulleposisjon mellom sider.",
        optional: false,
    },
    {
        name: "psCurrentState",
        type: ["cookie"],
        service: "Vergic",
        description: "Deling av skjerm med veileder.",
        optional: false,
    },
    {
        name: "selvbetjening-idtoken",
        type: ["cookie"],
        service: "Innlogging",
        description: "Husker innlogging på nav.no.",
        optional: false,
    },
    {
        name: "sso-nav.no",
        type: ["cookie"],
        service: "Innlogging",
        description: "Husker innlogging på nav.no.",
        optional: false,
    },
    {
        name: "vngage.",
        type: ["cookie", "sessionstorage", "localstorage"],
        service: "Vergic",
        description:
            "Deling av skjerm med veileder, kun for autoriserte personer.",
        optional: false,
    },
    {
        name: "navno-consent-*",
        type: ["cookie", "sessionstorage", "localstorage"],
        service: "Dekoratøren",
        description: "Husker brukerens samtykke for cookies.",
        optional: false,
    },
    {
        name: "_hjSession*",
        type: ["cookie"],
        service: "HotJar",
        description: "Husker invitasjoner til brukerundersøkelser.",
        optional: true,
    },
    {
        name: "_taj*",
        type: ["sessionstorage", "localstorage"],
        service: "Task Analytics",
        description: "Husker hvilke undersøkelser brukeren har takket ja til.",
        optional: true,
    },
    {
        name: "_tau",
        type: ["sessionstorage", "localstorage"],
        service: "Task Analytics",
        description: "Husker hvilke undersøkelser brukeren har takket ja til.",
        optional: true,
    },
    {
        name: "AMP_*",
        type: ["localstorage"],
        service: "Amplitude",
        description: "Brukes til anonym statistikk og analyse av nav.no.",
        optional: true,
    },
    {
        name: "AMP_*",
        type: ["cookie"],
        service: "Amplitude",
        description: "Brukes til anonym statistikk og analyse av nav.no.",
        optional: true,
    },
    {
        name: "ta-dekoratoren-*",
        type: ["cookie"],
        service: "Task Analytics",
        description:
            "Husker om en bruker har sett en invitasjon til undersøkelse.",
        optional: true,
    },
    {
        name: "usertest-*",
        type: ["cookie"],
        service: "Nav.no (Next)",
        description:
            "Husker hvilken variasjon av brukerundersøkelse som vises til brukeren.",
        optional: true,
    },
    {
        name: "language",
        type: ["sessionstorage"],
        service: "Minside",
        description:
            "Brukes for å kommunisere språk på tvers av innhold på Min side. Dataene angir hvilket språk brukeren har valgt på Min side.",
        optional: false,
    },
    {
        name: "innlogget-part",
        type: ["cookie"],
        service: "Tiltaksgjennomføring",
        description:
            "Hvilken avtalepart bruker er logget inn som (feks ‘deltaker’ eller 'arbeidsgiver') i Tiltaksgjennomføring (avtaleløsningen).",
        optional: false,
    },
    {
        name: "virksomhetsvelger_bedrift",
        type: ["sessionstorage"],
        service: "Tiltaksgjennomføring",
        description:
            "Lagre hvilken virksomhet en arbeidsgiver har valgt i bedriftsvalgmenyen",
        optional: false,
    },
    {
        name: "klang-*",
        type: ["sessionstorage"],
        service: "Klage og anke",
        description:
            "Mellomlagring av uferdige saker for ikke-innloggede brukere av innsendingsløsningen for klager, anker og ettersendelser.",
        optional: false,
    },
    {
        name: "no.sosialhjelp.wonderwall.session",
        type: ["cookie"],
        service: "Digisos",
        description:
            "Brukes for å huske hvem som eventuelt er logget inn på nav.no i nettleseren. Dette er en nøkkel som gjør at brukeren kan kommunisere med nav.no, sende informasjon og oppdatere Nav om situasjonen sin på en sikker måte. Den slettes når brukeren logger ut eller at tiden for innlogging har gått ut.",
        optional: false,
    },
    {
        name: "sist_lest",
        type: ["localstorage"],
        service: "Min side arbeidsgiver",
        description: "Tidspunkt for når bjella ble sist klikket  på - widget",
        optional: false,
    },
    {
        name: "virksomhetsvelger_bedrift",
        type: ["localstorage"],
        service: "Min side arbeidsgiver",
        description:
            "Husker hvilket organisasjonsnummer som er valgt slik at bruker slipper å velge på nytt ved hver sidelasting.",
        optional: false,
    },
    {
        name: "msa-info-boks-*",
        type: ["localstorage"],
        service: "Min side arbeidsgiver",
        description:
            "Husker om brukeren har valgt å lukke infoboks, slik at denne ikke vises igjen ved hver sidelasting.",
        optional: false,
    },
    {
        name: "skyra.state",
        type: ["cookie"],
        service: "ResearchOps",
        description:
            "Ved hjelp av denne kan Skyra huske brukeren og hvorvidt undersøkelser er åpne/lukket/fullført",
        optional: true,
    },
    {
        name: "skyra*",
        type: ["cookie"],
        service: "ResearchOps",
        description:
            "Denne informasjonskapselen lagrer svarene brukeren har gitt mens svarene gis. Avhengig av oppsett på undersøkelsen er dette enten en sesjonskapsel ell",
        optional: true,
    },
    {
        name: "FORSTEGANGSSOKNAD_SESSION",
        type: ["cookie"],
        service: "Pensjon",
        description:
            "Brukes for å kalle alderspensjonssøknadens backend for å sjekke om en borger har en alderspensjon / pågående søknad. Sikkerhetskoden i backend for før",
        optional: false,
    },
    {
        name: "nav-obo",
        type: ["cookie"],
        service: "Pensjon",
        description:
            "Er kun i bruk dersom en borger har fullmakt og byttet til bruker. Cookie slettes dersom borgeren bytter tilbake til seg selv.",
        optional: false,
    },
    {
        name: "nav-obo-omraade",
        type: ["cookie"],
        service: "Pensjon",
        description:
            "Er kun i bruk dersom en borger har fullmakt og byttet til bruker. Cookie slettes dersom borgeren bytter tilbake til seg selv.",
        optional: false,
    },
    {
        name: "language",
        type: ["localstorage"],
        service: "Pensjon",
        description:
            "Brukes for at mottaker skal kunne endre språk i skjema (NB/NN/EN)",
        optional: false,
    },
    {
        name: "SESSION_PSELV",
        type: ["cookie"],
        service: "Pensjon",
        description:
            "Pselv bruker gammel JSF teknologi i frontend og dette er tungt avhengig av HTTP sessions. I det Spring oppretter en sesjon vil rammverket automatisk r",
        optional: false,
    },
    {
        name: "persist:root",
        type: ["sessionstorage"],
        service: "Yrkesskade Skademelding",
        description:
            "Brukes for å mellomlagre tilstand på skjema og kunne fortsette skjema dersom innmelder går ut av skjemaet.",
        optional: false,
    },
    {
        name: "persist:root",
        type: ["sessionstorage"],
        service: "Yrkesskade Skadeforklaring og Ettersendelse",
        description:
            "Brukes for å mellomlagre tilstand på skjema og kunne fortsette skjema dersom innmelder går ut av skjemaet.",
        optional: false,
    },
    {
        name: "filter-veileder-*",
        type: ["localstorage"],
        service: "Tiltaksarrangør",
        description:
            "Husker hvilket filtreringsvalg som brukeren har gjort i menyene til neste besøk.",
        optional: false,
    },
    {
        name: "filter-deltakerliste-*",
        type: ["localstorage"],
        service: "Tiltaksarrangør",
        description:
            "Husker hvilket filtreringsvalg som brukeren har gjort i menyene til neste besøk.",
        optional: false,
    },
    {
        name: "alert-message-last-message",
        type: ["localstorage"],
        service: "Tiltaksarrangør",
        description:
            "Husker siste viste informasjonsmelding fra Nav til neste besøk.",
        optional: false,
    },
    {
        name: "alert-message-hide",
        type: ["localstorage"],
        service: "Tiltaksarrangør",
        description:
            "Husker om brukeren har valgt å skjule siste informasjonsmelding.",
        optional: false,
    },
    {
        name: "kontonr-result",
        type: ["cookie", "sessionstorage", "localstorage"],
        service: "Personopplysninger",
        description:
            "Denne brukes for å huske om endring av kontonummer var vellykket etter at du ble returnert fra ekstra innlogging som en sikkerhetsforanstaltning.",
        optional: false,
    },
    {
        name: "PreferredLanguage*",
        type: ["cookie"],
        service: "NKS / Innboks",
        description:
            "Brukes til å lagre brukerens språkpreferanse for språkdeteksjon og en lokaltilpasset brukeropplevelse",
        optional: false,
    },
    {
        name: "CookieConsentPolicy",
        type: ["cookie"],
        service: "NKS / Innboks",
        description:
            "Brukes til å anvende samtykkepreferanser for informasjonskapsler.",
        optional: false,
    },
    {
        name: "__Secure-has-sid",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description: "Oppdager en brukers innloggingsstatus på klientsiden",
        optional: false,
    },
    {
        name: "oid",
        type: ["cookie"],
        service: "NKS / Innboks",
        description:
            "Lagrer siste innloggede organisasjon for omdirigering og logging av informasjonskapsel i gjestebrukerforespørsler.",
        optional: false,
    },
    {
        name: "idccsrf",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description:
            "Sporer validering av Cross-Site Request Forgery for visse SSO-flyter",
        optional: false,
    },
    {
        name: "inst",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description:
            "Omdirigerer forespørsler mellom instanser ved bokmerker, hardkodede URL-er, org-migreringer eller URL-oppdateringer.",
        optional: false,
    },
    {
        name: "sid_Client",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description:
            "Brukes til å oppdage og forhindre manipulering av sesjoner.",
        optional: false,
    },
    {
        name: "oinfo",
        type: ["cookie"],
        service: "NKS / Innboks",
        description: "Statistikk for bruk av Salesforce-plattformen.",
        optional: true,
    },
    {
        name: "guest_uuid_essential_*",
        type: ["cookie"],
        service: "NKS / Innboks",
        description:
            "Tildeler unik ID til gjestebrukere i Experience Cloud-nettsteder, utløper ett år etter siste besøk.",
        optional: false,
    },
    {
        name: "LSKey-c$CookieConsentPolicy",
        type: ["cookie"],
        service: "NKS / Innboks",
        description:
            "LSKEY-c$-informasjonskapsler er kopier av originalen, opprettet for nettsteder med Locker Service aktivert, siden denne begrenser klientlesing av informasjonskapsler.",
        optional: false,
    },
    {
        name: "sid",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description:
            "Brukes for å skille de forskjellige enhetene som besøker siden fra hverandre.",
        optional: false,
    },
    {
        name: "autocomplete",
        type: ["cookie"],
        service: "NKS / Innboks",
        description:
            "Bestemmer om innloggingssiden husker brukerens brukernavn.",
        optional: false,
    },
    {
        name: "clientSrc",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description: "Brukes for sikkerhetsbeskyttelse.",
        optional: false,
    },
    {
        name: "apex_*",
        type: ["sessionstorage"],
        service: "NKS / Innboks",
        description: "Innlogging og sikkerhet.",
        optional: false,
    },
    {
        name: "sdfcstream",
        type: ["cookie"],
        service: "NKS / Innboks",
        description: "Innlogging og sikkerhet.",
        optional: false,
    },
    {
        name: "pctrk",
        type: ["cookie"],
        service: "NKS / Innboks",
        description: "Innlogging og sikkerhet.",
        optional: false,
    },
    {
        name: "RUIDC",
        type: ["cookie"],
        service: "NKS / Innboks",
        description: "Sporer unike sidevisninger i Experiences",
        optional: false,
    },
]);

const buildAllowedStorage = () => {
    const allAllowedStorage: PublicStorageItem[] = Array.from(
        storageDictionary,
    ).reduce((all, item) => {
        const subList = item.type.map((type) => ({
            name: item.name,
            optional: item.optional,
            type,
        })) as PublicStorageItem[];

        return all.concat(subList);
    }, [] as PublicStorageItem[]);

    return allAllowedStorage;
};

export const buildDecoratorData = ({
    features,
    params,
    rawParams,
    headAssets,
}: DecoratorDataProps): AppState => ({
    texts: Object.entries(texts[params.language])
        .filter(([key]) => clientTextsKeys.includes(key as keyof ClientTexts))
        .reduce(
            (prev, [key, value]) => ({
                ...prev,
                [key]: value,
            }),
            {},
        ) as ClientTexts,
    params: Object.entries(params)
        .filter(([key]) => clientParamKeys.includes(key as keyof ClientParams))
        .reduce(
            (prev, [key, value]) => ({
                ...prev,
                [key]: value,
            }),
            {},
        ) as ClientParams,
    rawParams: validateRawParams(rawParams),
    features,
    env: clientEnv,
    headAssets,
    allowedStorage: buildAllowedStorage(),
});
