import { Context, Params } from "decorator-shared/params";
import { AuthDataResponse } from "decorator-shared/auth";

export type CustomEvents = {
    activecontext: { context: Context };
    paramsupdated: {
        params: Partial<Params>;
    };
    authupdated: AuthDataResponse;
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

export function createEvent<TName extends keyof CustomEvents>(
    name: TName,
    options: CustomEventInit<CustomEvents[TName]>,
) {
    return new CustomEvent(name, options);
}

type PushStateArgs = Parameters<typeof window.history.pushState>;
type ReplaceStateArgs = Parameters<typeof window.history.replaceState>;

// Emits events on navigation in SPAs
export const initHistoryEvents = () => {
    const pushStateActual = window.history.pushState.bind(window.history);
    const replaceStateActual = window.history.replaceState.bind(window.history);

    let prevPathname = window.location.pathname;

    const dispatchHistoryEvent = (expiresTs: number) => {
        if (Date.now() > expiresTs) {
            return;
        }

        const currentPathname = window.location.pathname;

        if (currentPathname === prevPathname) {
            setInterval(() => dispatchHistoryEvent(expiresTs), 50);
            return;
        }

        dispatchEvent(createEvent("historyPush", {}));

        prevPathname = currentPathname;
    };

    const handleHistoryCall = (url?: URL | string | null) => {
        if (!url) {
            return;
        }

        const urlParsed = new URL(url, window.location.origin);
        if (urlParsed.pathname === prevPathname) {
            return;
        }

        dispatchHistoryEvent(Date.now() + 1000);
    };

    window.history.pushState = (...args: PushStateArgs) => {
        const result = pushStateActual(...args);
        handleHistoryCall(args[2]);
        return result;
    };

    window.history.replaceState = (...args: ReplaceStateArgs) => {
        const result = replaceStateActual(...args);
        handleHistoryCall(args[2]);
        return result;
    };
};
