import { env } from "../params";
import {
    getCurrentReferrer,
    extraWindowParams,
    buildLocationString,
} from "./analytics";
import { redactData } from "./helpers/redactData";
import { AnalyticsEventArgs, EventData } from "./types";

/*
 * TIL UTVIKLER: ADVARSEL OM PERSONOPPLYSNINGER
 * -------------------------------------------------------------------------------------------
 * Dersom du legger til funksjonalitet her som samler inn
 * data, må du forsikre deg om at ingen personopplysninger sendes til Umami.
 * Funksjonen redactData fjerner data på klientnivå, men kun for kjente mønstre eller nøkler.
 * Hvis du legger til nye mønstre eller et nytt nøkkelnavn, må du oppdatere funksjonene som sjekker ting som url, title, sidetittel, referrer osv.
 * For team som sender inn tilpasset ekstra data er de selv ansvarlige for etterlevelse.
 */

export const redactQueryString = (url: string): string => {
    if (!url) return url;
    if (!url.includes("?")) return url;

    const [baseUrl] = url.split("?");
    return baseUrl;
};

export const logUmamiEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "nav-dekoratoren",
) => {
    if (
        window.__DECORATOR_DATA__.features["dekoratoren.umami"] &&
        typeof umami !== "undefined"
    ) {
        const url = buildLocationString({
            includeOrigin: false,
            includeHash: false,
        });

        return umami.track((props) =>
            redactData({
                ...props,
                name: eventName === "besøk" ? undefined : eventName,
                url,
                title: window.document.title,
                referrer:
                    eventName === "besøk"
                        ? redactQueryString(
                              getCurrentReferrer() ?? props.referrer,
                          )
                        : undefined,
                data: {
                    ...eventData,
                    destinasjon: redactQueryString(eventData.destinasjon),
                    origin,
                    originVersion: eventData.originVersion || "unknown",
                    viaDekoratoren: true,
                    ...extraWindowParams(),
                },
            }),
        );
    }
};

export const createUmamiEvent = (props: AnalyticsEventArgs) => {
    const {
        eventName: optionalEventName,
        context,
        pageType,
        pageTheme,
        ...rest
    } = props;

    const eventName = optionalEventName ?? "navigere";
    return logUmamiEvent(eventName, {
        // context brukes i grensesnittet til dekoratøren, målgruppe er begrepet som brukes internt
        målgruppe: context,
        innholdstype: pageType,
        tema: pageTheme,
        søkeord: eventName === "søk" ? "[redacted: search]" : undefined,
        ...rest,
    });
};

export const initUmami = () => {
    if (window.__DECORATOR_DATA__.features["dekoratoren.umami"]) {
        const script = document.createElement("script");
        script.src =
            "https://cdn.nav.no/team-researchops/sporing/sporing-uten-uuid.js";
        script.defer = true;
        script.setAttribute("data-host-url", "https://umami.nav.no");
        script.setAttribute("data-website-id", `${env("UMAMI_WEBSITE_ID")}`);
        script.setAttribute("data-auto-track", "false");
        document.head.appendChild(script);
    }
};

export const stopUmami = () => {
    const umamiScript = document.querySelector(
        'script[src="https://cdn.nav.no/team-researchops/sporing/sporing-uten-uuid.js"]',
    );

    if (umamiScript) {
        umamiScript.remove();
    }
};
