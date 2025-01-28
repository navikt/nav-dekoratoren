import { AnalyticsEventArgs, EventData } from "./types";

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
export const stopUmami = () => {
    // TODO: Sammenlign med hotjar-slett script. Sjekk om noe ligger i window, legg isådfall tupen til i client.d.ts
};
