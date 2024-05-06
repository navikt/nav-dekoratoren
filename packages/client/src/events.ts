import { Auth } from "./api";
import { Context, Params } from "decorator-shared/params";

export type MessageEvent = {
    hello: "true";
};

export type CustomEvents = {
    "analytics-ready-event": void;
    activecontext: { context: Context };
    paramsupdated: {
        params: Partial<Params>;
    };
    authupdated: {
        auth: Auth;
    };
    menuopened: void;
    menuclosed: void;
    clearsearch: void;
    closemenus: void; // Currently fired only from other apps
    historyPush: {
        url: URL;
    };
};

export type MessageEvents =
    | {
          source: "decoratorClient";
          event: "ready";
      }
    | {
          source: "decoratorClient";
          event: "params";
          payload: Partial<Params>;
      };

export type EventName = keyof CustomEvents;

export function createEvent<TName extends keyof CustomEvents>(
    name: TName,
    options: CustomEventInit<CustomEvents[TName]>,
) {
    return new CustomEvent(name, options);
}

export const analyticsReady = new CustomEvent("analytics-ready-event", {
    bubbles: true,
});

type PushStateArgs = Parameters<typeof window.history.pushState>;
type ReplaceStateArgs = Parameters<typeof window.history.replaceState>;

// Emits events on navigation in SPAs
export const initHistoryEvents = () => {
    const pushStateActual = window.history.pushState.bind(window.history);
    const replaceStateActual = window.history.replaceState.bind(window.history);

    let currentPathname = window.location.pathname;

    const dispatchHistoryEvent = (url?: URL | string | null) => {
        if (!url) {
            return;
        }

        const urlParsed = new URL(url, window.location.origin);
        const newPathname = urlParsed.pathname;

        if (newPathname !== currentPathname) {
            dispatchEvent(
                createEvent("historyPush", {
                    detail: {
                        url: urlParsed,
                    },
                }),
            );
            currentPathname = newPathname;
        }
    };

    window.history.pushState = (...args: PushStateArgs) => {
        dispatchHistoryEvent(args[2]);
        return pushStateActual(...args);
    };

    window.history.replaceState = (...args: ReplaceStateArgs) => {
        dispatchHistoryEvent(args[2]);
        return replaceStateActual(...args);
    };
};
