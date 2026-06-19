import cls from "decorator-client/src/styles/modal.module.css";
import html, { type Template } from "../html";
import { defineHydrationHooks, hydrateAttr } from "../hydration";

export const [logoutWarningHook, logoutWarningSelector] = defineHydrationHooks({
    sessionDialog: "logout.session",
    tokenDialog: "logout.token",
    dialog: "logout.dialog",
    form: "logout.form",
    timeRemaining: "logout.time",
});

export type WarningDialogProps = {
    body: Template;
    buttons: Template;
    title: Template;
};

export const TokenDialog = ({
    body,
    buttons,
    title,
}: WarningDialogProps) => html`
    <token-dialog ${hydrateAttr(logoutWarningHook.tokenDialog)}>
        <dialog class="${cls.modal}" ${hydrateAttr(logoutWarningHook.dialog)}>
            <form
                class="${cls.modalWindow}"
                ${hydrateAttr(logoutWarningHook.form)}
            >
                <h1 class="${cls.modalTitle}">${title}</h1>
                <p class="${cls.modalBody}">${body}</p>
                <div class="${cls.buttonWrapper}">${buttons}</div>
            </form>
        </dialog>
    </token-dialog>
`;

export const SessionDialog = ({
    body,
    buttons,
    title,
}: WarningDialogProps) => html`
    <session-dialog ${hydrateAttr(logoutWarningHook.sessionDialog)}>
        <dialog class="${cls.modal}" ${hydrateAttr(logoutWarningHook.dialog)}>
            <form
                class="${cls.modalWindow}"
                ${hydrateAttr(logoutWarningHook.form)}
            >
                <h1 class="${cls.modalTitle}">${title}</h1>
                <p class="${cls.modalBody}">${body}</p>
                <div class="${cls.buttonWrapper}">${buttons}</div>
            </form>
        </dialog>
    </session-dialog>
`;

export const LogoutWarning = ({
    sessionDialog,
    tokenDialog,
}: {
    sessionDialog: Template;
    tokenDialog: Template;
}) => html`
    <logout-warning> ${tokenDialog} ${sessionDialog} </logout-warning>
`;
