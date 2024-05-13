import { ClientTexts } from "decorator-shared/types";
import {
    AuthData,
    fakeExpirationTime,
    fetchSession,
    fetchRenew,
    getSecondsToExpiration,
} from "../helpers/auth";

export async function logoutWarningController(
    hasLogoutWarning: boolean,
    texts: ClientTexts,
) {
    if (!hasLogoutWarning) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let timeoutHandler: NodeJS.Timeout;
    let auth: AuthData;
    let silenceWarning: boolean = false;

    const TOKEN_WARNING_THRESHOLD = 5 * 60; // 5 minutes
    const SESSION_WARNING_THRESHOLD = 5 * 60; // 5 minutes

    // Modal elements
    const logoutWarningDialog = document.getElementById(
        "logout-warning",
    ) as HTMLDialogElement | null;
    const title = logoutWarningDialog?.querySelector("#logout-warning-title");
    const body = logoutWarningDialog?.querySelector("#logout-warning-body");
    const confirmButton = logoutWarningDialog?.querySelector(
        "#logout-warning-confirm",
    );
    const cancelButton = logoutWarningDialog?.querySelector(
        "#logout-warning-cancel",
    );

    // Session and token fetching from central login service
    // ---------------------------------------------
    async function getUpdatedSessionRemote() {
        const result = await fetchSession();
        if (result.session && result.tokens) {
            auth = { ...result }; // Spread to avoid referencing.
        }
    }

    async function getRenewedTokenRemote() {
        const result = await fetchRenew();
        if (result.session && result.tokens) {
            auth = { ...result }; // Spread to avoid referencing.
        }
    }

    // Debug functions for testing token and session expiry
    // ---------------------------------------------
    function fakeTokenExpiration(seconds: number) {
        auth.tokens.expire_at = fakeExpirationTime(seconds);
    }

    function fakeSessionExpiration(seconds: number) {
        auth.session.ends_at = fakeExpirationTime(seconds);
    }

    // Updaters for the actual modal UI
    // ---------------------------------------------
    function updateDialogUI(type: "token" | "session", minutes?: number) {
        if (
            !title ||
            !body ||
            !confirmButton ||
            !cancelButton ||
            !logoutWarningDialog
        ) {
            return;
        }

        if (type === "token") {
            title.innerHTML = texts.token_warning_title;
            body.innerHTML = texts.token_warning_body;
            confirmButton.innerHTML = texts.yes;
            cancelButton.innerHTML = texts.logout;
        } else {
            title.innerHTML = texts.session_warning_title.replace(
                "$1",
                minutes?.toString() || "",
            );
            body.innerHTML = texts.session_warning_body;
            confirmButton.innerHTML = texts.ok;
            cancelButton.innerHTML = texts.logout;
        }

        confirmButton.setAttribute("data-type", type);
        cancelButton.setAttribute("data-type", type);

        if (!logoutWarningDialog.open && !silenceWarning) {
            logoutWarningDialog.showModal();
        }
    }

    function silenceSessionWarning() {
        if (logoutWarningDialog) {
            logoutWarningDialog.close();
        }
        silenceWarning = true;
    }

    // Timeout function for checking local session
    // each second. Tab change or reload will
    // sync the session with the central login service.
    function periodicalLocalSessionCheck() {
        timeoutHandler = setTimeout(() => {
            periodicalLocalSessionCheck();
        }, 1000);

        // User is not logged in, so do nothing and end the timeout
        // check as a new one will be triggered if the user logs in anyway.
        if (!auth?.tokens || !auth?.session || !logoutWarningDialog) {
            clearTimeout(timeoutHandler);
            return;
        }

        const { tokens, session } = auth;
        const secondsToTokenExpiration = getSecondsToExpiration(
            tokens.expire_at,
        );
        const secondsToSessionExpiration = getSecondsToExpiration(
            session.ends_at,
        );

        if (secondsToTokenExpiration < 0 || secondsToSessionExpiration < 0) {
            window.location.href = `${window.__DECORATOR_DATA__.env.LOGOUT_URL}`;
        }

        if (secondsToTokenExpiration < TOKEN_WARNING_THRESHOLD) {
            updateDialogUI("token");
            return;
        }

        if (secondsToSessionExpiration < SESSION_WARNING_THRESHOLD) {
            const minutesToSessionExpiration = Math.ceil(
                secondsToSessionExpiration / 60,
            );
            updateDialogUI("session", minutesToSessionExpiration);
            return;
        }

        if (logoutWarningDialog.open) {
            logoutWarningDialog.close();
        }
    }

    // Event handlers
    // ---------------------------------------------
    function onConfirm(e: Event) {
        const target = e.target as HTMLButtonElement;
        const type = target.getAttribute("data-type");
        if (type === "token") {
            getRenewedTokenRemote();
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
            getUpdatedSessionRemote();
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
        window.addEventListener("visibilitychange", onVisibilityChange);
        confirmButton?.addEventListener("click", onConfirm);
        cancelButton?.addEventListener("click", onCancel);
    }

    startEventListeners();
    setupDebugFunctionality();
    await getUpdatedSessionRemote();
    periodicalLocalSessionCheck();
}
