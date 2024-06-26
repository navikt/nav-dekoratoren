import type { Meta, StoryObj } from "@storybook/html";
import type { SearchHitsProps } from "./search-hits";
import { SearchHits } from "./search-hits";

const meta: Meta<SearchHitsProps> = {
    title: "search/search-hits",
    render: SearchHits,
};

export default meta;
type Story = StoryObj<SearchHitsProps>;

export const Default: Story = {
    args: {
        context: "personbruker",
        query: "sykepenger",
        results: {
            total: 69,
            hits: [
                {
                    displayName: "Sykepenger",
                    href: "https://www.nav.no/sykepenger",
                    highlight:
                        "Erstatter inntekten din når du ikke kan jobbe på grunn av sykdom eller skade.",
                },
                {
                    displayName: "Dekking av sykepenger i arbeidsgiverperioden",
                    href: "https://www.nav.no/kronisk-syk-eller-gravid",
                    highlight:
                        "NAV dekker sykepenger i arbeidsgiverperioden hvis du har hyppig sykefravær fordi du er kronisk syk eller gravid.",
                },
                {
                    displayName:
                        "Sykepengesøknaden og behandling av personopplysninger",
                    href: "https://www.nav.no/sykepenger-og-personopplysninger",
                    highlight:
                        "Når du har blitt syk eller skadet og ikke kan jobbe, kan du ha rett til sykepenger. Du må oppfylle noen generelle vilkår for å få sykepenger.",
                },
                {
                    displayName:
                        "Dokumentasjon for sykepenger når du bor i utlandet",
                    href: "https://www.nav.no/fyllut-ettersending/lospost?tema=SYK",
                    highlight:
                        "Hvis du er fast bosatt i utlandet og skal sende inn dokumentasjon som gjelder sykepenger, sender du dette sammen med en førsteside.",
                },
                {
                    displayName:
                        "Søknad om sykepenger for arbeidstakere (NAV 08-07.04D)",
                    href: "https://www.nav.no/start/soknad-sykepenger",
                    highlight:
                        "Du søker du om sykepenger når perioden for sykmeldingen er over. Du får en melding når søknaden er klar til å fylles ut på Ditt sykefravær og sender den derfra. Du må sende søknad om sykepenger selv om arbeidsgiveren din betaler deg lønn mens  …",
                },
            ],
        },
    },
};
