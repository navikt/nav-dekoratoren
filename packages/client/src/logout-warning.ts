import { ClientTexts } from "decorator-shared/types";
import {
    fakeExpirationTime,
    transformSessionToAuth,
    fetchRenew,
    fetchSession,
    getSecondsToExpiration,
} from "./helpers/auth";

type Auth = {
    sessionExpireAtLocal: string;
    tokenExpireAtLocal: string;
};

function getDOMElements() {
    const logoutWarningDialogEl = document.getElementById(
        "logout-warning",
    ) as HTMLDialogElement | null;
    const titleEl = logoutWarningDialogEl?.querySelector(
        "#logout-warning-title",
    );
    const bodyEl = logoutWarningDialogEl?.querySelector("#logout-warning-body");
    const confirmButtonEl = logoutWarningDialogEl?.querySelector(
        "#logout-warning-confirm",
    );
    const cancelButtonEl = logoutWarningDialogEl?.querySelector(
        "#logout-warning-cancel",
    );

    return {
        logoutWarningDialogEl,
        titleEl,
        bodyEl,
        confirmButtonEl,
        cancelButtonEl,
    };
}

function updateLogoutWarningUI(type: "token" | "session", minutes?: number) {
    const { titleEl, bodyEl, confirmButtonEl, cancelButtonEl } =
        getDOMElements();

    const texts: ClientTexts = window.__DECORATOR_DATA__.texts;

    if (!titleEl || !bodyEl || !confirmButtonEl || !cancelButtonEl || !texts) {
        return;
    }

    const title =
        type === "token"
            ? texts.token_warning_title
            : texts.session_warning_title.replace(
                  "$1",
                  minutes?.toString() ?? "",
              );
    const body =
        type === "token"
            ? texts.token_warning_body
            : texts.session_warning_body;
    const confirm = type === "token" ? texts.yes : texts.ok;
    const cancel = texts.logout;

    titleEl.innerHTML = title;
    bodyEl.innerHTML = body;
    confirmButtonEl.innerHTML = confirm;
    cancelButtonEl.innerHTML = cancel;

    confirmButtonEl.setAttribute("data-type", type);
    cancelButtonEl.setAttribute("data-type", type);
}

export async function initLogoutWarning() {
    let timeoutHandler: NodeJS.Timeout;
    let auth: Auth | null = null;
    let silenceWarning: boolean = false;

    const secondsToWarnBeforeExpiration = 5 * 60; // Give user 5 minutes to react to the warning.

    const { logoutWarningDialogEl } = getDOMElements();

    // Session and token fetching from central login service
    // ---------------------------------------------
    async function updateAuthFromSession() {
        const result = await fetchSession();
        if (!result?.session || !result?.tokens) {
            auth = null;
            return;
        }

        auth = transformSessionToAuth(result);
    }

    async function renewSessionAndUpdateAuth() {
        const result = await fetchRenew();
        if (!result?.session && !result?.tokens) {
            return;
        }
        auth = transformSessionToAuth(result);
    }

    function silenceSessionWarning() {
        if (logoutWarningDialogEl) {
            logoutWarningDialogEl.close();
        }
        silenceWarning = true;
    }

    // Debug functions for testing token and session expiry
    // ---------------------------------------------
    function fakeTokenExpiration(seconds: number) {
        if (auth) {
            auth.tokenExpireAtLocal = fakeExpirationTime(seconds);
        } else {
            console.error(
                "No tokens found in auth object. Cannot fake token expiry.",
            );
        }
    }

    function fakeSessionExpiration(seconds: number) {
        if (auth) {
            auth.sessionExpireAtLocal = fakeExpirationTime(seconds);
        } else {
            console.error(
                "No tokens found in auth object. Cannot fake session expiry.",
            );
        }
    }

    // Updaters for the actual modal UI
    // ---------------------------------------------
    function showDialog(type: "token" | "session", minutes?: number) {
        updateLogoutWarningUI(type, minutes);

        if (!logoutWarningDialogEl?.open || !silenceWarning) {
            logoutWarningDialogEl?.showModal();
        }
    }

    function periodicalLocalSessionCheck() {
        timeoutHandler = setTimeout(() => {
            periodicalLocalSessionCheck();
        }, 1000);

        // User is not logged in, so do nothing and end the timeout
        if (!auth || !logoutWarningDialogEl) {
            clearTimeout(timeoutHandler);
            return;
        }

        const secondsToTokenExpiration = getSecondsToExpiration(
            auth.tokenExpireAtLocal,
        );
        const secondsToSessionExpiration = getSecondsToExpiration(
            auth.sessionExpireAtLocal,
        );

        if (secondsToTokenExpiration < 0 || secondsToSessionExpiration < 0) {
            window.location.href = `${window.__DECORATOR_DATA__.env.LOGOUT_URL}`;
        }

        if (secondsToTokenExpiration < secondsToWarnBeforeExpiration) {
            showDialog("token");
            return;
        }

        if (secondsToSessionExpiration < secondsToWarnBeforeExpiration) {
            const minutesToSessionExpiration = Math.ceil(
                secondsToSessionExpiration / 60,
            );
            showDialog("session", minutesToSessionExpiration);
            return;
        }

        // Neither token nor session is about to expire, so close the dialog
        // if it's open. This could happen if the user has multiple tabs open
        // and has refreshet the token in one of them.
        if (logoutWarningDialogEl.open) {
            logoutWarningDialogEl.close();
        }
    }

    // Event handlers
    // ---------------------------------------------
    function onConfirm() {
        const { confirmButtonEl } = getDOMElements();
        const type = confirmButtonEl?.getAttribute("data-type");
        if (type === "token") {
            renewSessionAndUpdateAuth();
        } else {
            silenceSessionWarning();
        }
    }

    function onCancel() {
        // Note that in both cases, hitting "Log out" is considered
        // cancelling the session and redirecting the user.
        window.location.href = `${window.__DECORATOR_DATA__.env.LOGOUT_URL}`;
    }

    function onVisibilityChange() {
        if (document.visibilityState === "visible") {
            updateAuthFromSession();
        }
    }

    // Setup
    // ---------------------------------------------
    function setupDebugFunctionality() {
        window.loginDebug = {
            expireToken: fakeTokenExpiration,
            expireSession: fakeSessionExpiration,
        };
    }

    function startEventListeners() {
        const { confirmButtonEl, cancelButtonEl } = getDOMElements();
        window.addEventListener("visibilitychange", onVisibilityChange);
        confirmButtonEl?.addEventListener("click", onConfirm);
        cancelButtonEl?.addEventListener("click", onCancel);
    }

    if (!logoutWarningDialogEl) {
        return;
    }

    startEventListeners();
    setupDebugFunctionality();
    await updateAuthFromSession();
    periodicalLocalSessionCheck();
}
