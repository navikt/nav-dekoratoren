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
    historyPush: void;
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

// Emits events on navigation in SPAs
export const initHistoryEvents = () => {
    const pushStateActual = window.history.pushState.bind(window.history);
    let currentPathname = window.location.pathname;

    window.history.pushState = (
        ...args: Parameters<typeof window.history.pushState>
    ) => {
        // Delay slightly to allow SPAs to update their state
        setTimeout(() => {
            const newPathname = window.location.pathname;
            if (newPathname !== currentPathname) {
                dispatchEvent(createEvent("historyPush", {}));
                currentPathname = newPathname;
                console.log(`Navigated to ${newPathname}`);
            }
        }, 250);

        return pushStateActual(...args);
    };
};
