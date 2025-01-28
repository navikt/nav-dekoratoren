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
