import type { Meta, StoryObj } from "@storybook/html";
import i18n from "../../i18n";
import { MainMenu } from "./main-menu";
import html from "decorator-shared/html";

const meta: Meta = {
    title: "header/main-menu",
    tags: ["autodocs"],
    render: (args, context) => {
        const { locale } = context.globals;
        if (args.context === "arbeidsgiver" && locale === "en") {
            return html`n/a`;
        }
        return MainMenu(
            {
                privatperson: {
                    title: i18n("how_can_we_help"),
                    frontPageUrl: "/",
                    links: locale === "en" ? enLinks : nbPrivatpersonLinks,
                    contextLinks:
                        locale === "en" ? [] : nbPrivatpersonContextLinks,
                },
                arbeidsgiver: {
                    title: { render: () => "Arbeidsgiver" },
                    frontPageUrl: "/",
                    links: nbArbeidsgiverLinks,
                    contextLinks: nbArbeidsgiverContextLinks,
                },
            }[args.context],
        );
    },
};

export default meta;
type Story = StoryObj;

export const Privatperson: Story = { args: { context: "privatperson" } };

export const Arbeidsgiver: Story = { args: { context: "arbeidsgiver" } };

const enLinks = [
    {
        heading: "Shortcuts",
        children: [
            { content: "Applications and forms", url: "/soknader/en" },
            {
                content: "Submitting additional documentation",
                url: "/ettersende/en",
            },
            {
                content: "Financial support and services from A to Z",
                url: "/tjenester/en",
            },
            { content: "Right to complain", url: "/klagerettigheter/en" },
            { content: "Notify us of any changes", url: "/endringer/en" },
            { content: "Payment dates", url: "/utbetalingsdatoer/en" },
            {
                content: "Case processing times",
                url: "/saksbehandlingstider/en",
            },
            { content: "Rates", url: "/satser/en" },
            { content: "Employment status form", url: "/send-meldekort/en" },
            {
                content: "Register as a Job Seeker",
                url: "https://www.nav.no/arbeid/registrering/en",
            },
        ],
    },
    {
        heading: "Rules and regulations",
        children: [
            {
                content: "Membership of the National Insurance Scheme",
                url: "/en/home/rules-and-regulations/membership-of-the-national-insurance-scheme",
            },
            {
                content: "National insurance coverage",
                url: "/en/home/rules-and-regulations/national-insurance-coverage",
            },
            {
                content: "National insurance contributions",
                url: "/no/person/flere-tema/arbeid-og-opphold-i-norge/relatert-informasjon/trygdeavgift",
            },
            {
                content: "Working abroad",
                url: "/en/home/rules-and-regulations/working-abroad",
            },
            {
                content: "Staying abroad",
                url: "/en/home/rules-and-regulations/staying-abroad",
            },
        ],
    },
    {
        heading: "Work and stay in Norway",
        children: [
            { content: "Work in Norway", url: "https://www.workinnorway.no/" },
            {
                content: "Employee on the Norwegian continental shelf",
                url: "/en/home/work-and-stay-in-norway/employee-on-the-norwegian-continental-shelf",
            },
            {
                content: "Foreign students in Norway",
                url: "/en/home/work-and-stay-in-norway/foreign-students-in-norway",
            },
            {
                content: "Tourists in Norway",
                url: "/en/home/work-and-stay-in-norway/tourists-in-norway",
            },
        ],
    },
    {
        heading: "Employers",
        children: [
            {
                content: "Applications and forms for employers",
                url: "/arbeidsgiver/soknader/en",
            },
            {
                content: "Complaint for employers",
                url: "/arbeidsgiver/klage/en",
            },
            {
                content: "Recruit in Norway?",
                url: "/en/home/employers/recruit-in-norway",
            },
            {
                content: "Recruiting from the EU/EEA",
                url: "/arbeidsgiver/rekruttere-eu-eos/en",
            },
            {
                content: "Income report",
                url: "/arbeidsgiver/inntektsmelding/en",
            },
            {
                content: "State register of employers and employees",
                url: "/arbeidsgiver/aa-registeret/en",
            },
        ],
    },
];

const nbArbeidsgiverLinks = [
    {
        heading: "Sykdom, skade og fravær",
        children: [
            {
                content: "Ansatt er sykmeldt",
                url: "/arbeidsgiver/sykmeldt-ansatt",
            },
            {
                content: "Vil redusere sykefravær og beholde ansatte i jobb",
                url: "/arbeidsgiver/redusere-sykefravar",
            },
            {
                content: "Ansatt har blitt syk eller skadet på arbeidsplassen",
                url: "/arbeidsgiver/yrkesskade",
            },
            {
                content: "Ansatt har sykdom i familien",
                url: "/arbeidsgiver/sykdom-i-familien",
            },
            {
                content: "Ansatt venter barn",
                url: "/arbeidsgiver/ansatt-venter-barn",
            },
            {
                content: "Sykefraværsstatistikk",
                url: "https://arbeidsgiver.nav.no/sykefravarsstatistikk/",
            },
        ],
    },
    {
        heading: "Rekruttere og inkludere",
        children: [
            {
                content: "Annonser stillinger eller finn kandidater",
                url: "https://arbeidsplassen.nav.no/bedrift",
            },
            {
                content: "Vil hjelpe flere inn i arbeidslivet",
                url: "/arbeidsgiver/inkludere",
            },
            { content: "Vil rekruttere", url: "/arbeidsgiver/rekruttere" },
            {
                content: "Lønnstilskudd",
                url: "/arbeidsgiver/midlertidig-lonnstilskudd",
            },
        ],
    },
    {
        heading: "Permittere og nedbemanne",
        children: [
            {
                content: "Meld fra til Nav",
                url: "https://arbeidsgiver.nav.no/permittering/",
            },
            {
                content: "Permittere eller nedbemanne",
                url: "/arbeidsgiver/permittere-nedbemanne",
            },
        ],
    },
    {
        heading: "Skjemaer, tilganger og refusjoner",
        children: [
            { content: "Søknad og skjema", url: "/arbeidsgiver/soknader" },
            {
                content: "Saksbehandlingstider",
                url: "/arbeidsgiver/saksbehandlingstider",
            },
            { content: "Klage", url: "/arbeidsgiver/klage" },
            {
                content: "Altinn-rettigheter til NAVs tjenester",
                url: "/arbeidsgiver/tilganger",
            },
            {
                content: "Inntektsmelding, rapporter m.m.",
                url: "/arbeidsgiver/rapporter",
            },
            {
                content: "Forsikring for næringsdrivende m.fl.",
                url: "/no/bedrift/tjenester-og-skjemaer/selvstendig-naringsdrivende-med-flere",
            },
            { content: "Aa-registeret", url: "/arbeidsgiver/aa-registeret" },
        ],
    },
];

const nbArbeidsgiverContextLinks = [
    {
        content: "Min side - arbeidsgiver",
        description: "Dine sykmeldte, rekruttering, digitale skjemaer",
        url: "http://localhost:8089/minside-arbeidsgiver",
    },
    {
        content: "Privat",
        description:
            "Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester",
        url: "https://www.ansatt.dev.nav.no/",
    },
    {
        content: "Samarbeidspartner",
        description: "Helsepersonell, tiltaksarrangører, fylker og kommuner",
        url: "https://www.ansatt.dev.nav.no/no/samarbeidspartner",
    },
];

const nbPrivatpersonLinks = [
    {
        heading: "Områder",
        children: [
            { content: "Arbeid", url: "/arbeid" },
            { content: "Helse og sykdom", url: "/helse" },
            { content: "Familie og barn", url: "/familie" },
            { content: "Pensjon", url: "/pensjon" },
            {
                content: "Sosiale tjenester og veiledning",
                url: "/sosiale-tjenester",
            },
            {
                content: "Hjelpemidler og tilrettelegging",
                url: "/hjelpemidler",
            },
        ],
    },
    {
        heading: "Snarveier",
        children: [
            { content: "Søknad og skjema", url: "/soknader" },
            { content: "Ettersendelse", url: "/ettersende" },
            { content: "Klage", url: "/klage" },
            {
                content: "Pengestøtter og tjenester fra A til Å",
                url: "/tjenester",
            },
            { content: "Saksbehandlingstider", url: "/saksbehandlingstider" },
            { content: "Utbetalinger", url: "/utbetalinger" },
            { content: "Satser", url: "/satser" },
            { content: "Meldekort", url: "/send-meldekort" },
            {
                content: "Registrer deg som arbeidssøker",
                url: "/registrer-arbeidssoker",
            },
            {
                content: "Kurs fra Nav",
                url: "/no/nav-og-samfunn/kontakt-nav/kurs-fra-nav",
            },
            {
                content: "Feiltolkning av EØS-reglene",
                url: "/no/nav-og-samfunn/kontakt-nav/feiltolkning-av-eos-reglene",
            },
        ],
    },
];

const nbPrivatpersonContextLinks = [
    { content: "Min side", url: "https://www.ansatt.dev.nav.no/minside" },
    {
        content: "Arbeidsgiver",
        url: "https://www.ansatt.dev.nav.no/no/bedrift",
    },
    {
        content: "Samarbeidspartner",
        url: "https://www.ansatt.dev.nav.no/no/samarbeidspartner",
    },
];
