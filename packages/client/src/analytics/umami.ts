import { env } from "../params";
import { AnalyticsEventArgs, EventData } from "./types";

export const logUmamiEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "nav-dekoratoren",
) => {
    if (
        window.__DECORATOR_DATA__.features["dekoratoren.umami"] &&
        typeof umami !== "undefined"
    ) {
        return umami.track((props) => ({
            ...props,
            name: eventName,
            url: window.location.pathname,
            title: window.document.title,
            referrer: props.referrer.split("?")[0],
            data: {
                ...eventData,
                origin,
                originVersion: eventData.originVersion || "unknown",
                viaDekoratoren: true,
            },
        }));
    }
};

export const createUmamiEvent = (props: AnalyticsEventArgs) => {
    const {
        eventName: optionalEventName,
        context,
        pageType,
        kategori,
        destinasjon,
        lenketekst,
        lenkegruppe,
        komponent,
    } = props;

    const eventName = optionalEventName ?? "navigere";
    return logUmamiEvent(eventName, {
        // context brukes i grensesnittet til dekoratøren, målgruppe er begrepet som brukes internt
        målgruppe: context,
        innholdstype: pageType,
        destinasjon,
        kategori,
        søkeord: eventName === "søk" ? "[redacted]" : undefined,
        lenketekst,
        lenkegruppe,
        komponent,
    });
};

export const initUmami = () => {
    if (window.__DECORATOR_DATA__.features["dekoratoren.umami"]) {
        const script = document.createElement("script");
        script.src = "https://cdn.nav.no/team-researchops/sporing/sporing.js";
        script.defer = true;
        script.setAttribute("data-host-url", "https://umami.nav.no");
        script.setAttribute("data-website-id", `${env("UMAMI_WEBSITE_ID")}`);
        script.setAttribute("data-auto-track", "false");
        document.head.appendChild(script);
    }
};

export const stopUmami = () => {
    const umamiScript = document.querySelector(
        'script[src="https://cdn.nav.no/team-researchops/sporing/sporing.js"]',
    );

    if (umamiScript) {
        umamiScript.remove();
    }
};
