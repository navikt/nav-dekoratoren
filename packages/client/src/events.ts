import { Context, ClientParams } from "decorator-shared/params";
import { AuthDataResponse } from "decorator-shared/auth";

export type CustomEvents = {
    activecontext: { context: Context };
    paramsupdated: {
        params: Partial<ClientParams>;
    };
    authupdated: AuthDataResponse;
    menuopened: void;
    menuclosed: void;
    clearsearch: void;
    closemenus: void; // Currently fired only from other apps
    historyPush: void;
    consentAllWebStorage: void;
    refuseOptionalWebStorage: void;
    recheckConsentBanner: void;
    showConsentBanner: void;
    scrollTo: {
        top?: number;
        left?: number;
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
          payload: Partial<ClientParams>;
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

        // Poll window.location to ensure it has changed before emitting the event
        // SPA frameworks can sometimes be "slow" with updating this after changing
        // their history state, so we have this as a workaround
        const currentPathname = window.location.pathname;
        if (currentPathname === prevPathname) {
            setTimeout(() => dispatchHistoryEvent(expiresTs), 50);
            return;
        }

        dispatchEvent(createEvent("historyPush", {}));

        prevPathname = currentPathname;
    };

    const handleHistoryStateChange = (url?: URL | string | null) => {
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
        handleHistoryStateChange(args[2]);
        return result;
    };

    window.history.replaceState = (...args: ReplaceStateArgs) => {
        const result = replaceStateActual(...args);
        handleHistoryStateChange(args[2]);
        return result;
    };
};

type ScrollArgs = [ScrollToOptions] | [x?: number, y?: number];

// Emits events on programmatic scrolling
export const initScrollToEvents = () => {
    const normalizeArgs = (...args: ScrollArgs) => {
        const [optionsOrXCoord, undefinedOrYCoord] = args;
        const isOptions =
            optionsOrXCoord && typeof optionsOrXCoord === "object";

        return isOptions
            ? { top: optionsOrXCoord.top, left: optionsOrXCoord.left }
            : {
                  top: undefinedOrYCoord,
                  left: optionsOrXCoord,
              };
    };

    const dispatchOnScrollTo = (...args: ScrollArgs) => {
        dispatchEvent(
            createEvent("scrollTo", { detail: normalizeArgs(...args) }),
        );
    };

    const dispatchOnScrollBy = (...args: ScrollArgs) => {
        const { top, left } = normalizeArgs(...args);

        dispatchEvent(
            createEvent("scrollTo", {
                detail: {
                    top: top !== undefined ? top + window.scrollY : top,
                    left: left !== undefined ? left + window.scrollX : left,
                },
            }),
        );
    };

    const scrollActual = window.scroll.bind(window);
    const scrollToActual = window.scrollTo.bind(window);
    const scrollByActual = window.scrollBy.bind(window);

    window.scroll = ((...args: ScrollArgs) => {
        dispatchOnScrollTo(...args);
        return scrollActual(...(args as [ScrollToOptions]));
    }) as typeof window.scroll;

    window.scrollTo = ((...args: ScrollArgs) => {
        dispatchOnScrollTo(...args);
        return scrollToActual(...(args as [ScrollToOptions]));
    }) as typeof window.scrollTo;

    window.scrollBy = ((...args: ScrollArgs) => {
        dispatchOnScrollBy(...args);
        return scrollByActual(...(args as [ScrollToOptions]));
    }) as typeof window.scrollBy;
};
