import { AnalyticsEventArgs, EventData } from "./types";

export const logPageView = () => {
    umami.track("besøk", { besok: "dekoratoren" });
};

export const logUmamiEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "nav-dekoratoren",
) => {
    return umami.track(eventName, {
        ...eventData,
        origin,
        originVersion: eventData.originVersion || "unknown",
        viaDekoratoren: true,
    });
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

    const eventName = optionalEventName || "navigere";
    return logUmamiEvent(eventName, {
        // context brukes i grensesnittet til dekoratøren, målgruppe er begrepet som brukes internt
        målgruppe: context,
        innholdstype: pageType,
        destinasjon,
        kategori,
        søkeord: eventName === "søk" ? "[redacted]" : undefined,
        lenketekst,
        // tekst: lenketekst, TODO: Kan vi fjerne denne siden vi er i nytt verktøy?
        lenkegruppe,
        komponent,
    });
};
