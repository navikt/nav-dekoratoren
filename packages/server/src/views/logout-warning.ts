import cls from "decorator-client/src/styles/logout-warning.module.css";
import clsModal from "decorator-client/src/styles/modal.module.css";
import html from "decorator-shared/html";
import { Button } from "decorator-shared/views/components/button";
import i18n from "../i18n";

export type LogoutWarningProps = unknown;

export function LogoutWarning() {
    return html`<dialog class="${clsModal.modal}" id="logout-warning">
        <div class="${clsModal.modalWindow}">
            <<<<<<< HEAD
            <h1 id="logout-warning-title" class="${clsModal.modalTitle}">
                ${i18n("token_warning_title")}
            </h1>
            =======
            <h2 id="logout-warning-title" class="${clsModal.modalTitle}">
                Du blir snart logget ut automatisk
            </h2>
            >>>>>>> main
            <p id="logout-warning-body" class="${clsModal.modalBody}">
                ${i18n("token_warning_body")}
            </p>
            <div class="${cls.buttonWrapper}">
                ${Button({
                    text: i18n("yes"),
                    variant: "primary",
                    bigLabel: true,
                    id: "logout-warning-confirm",
                })}
                ${Button({
                    text: i18n("logout"),
                    variant: "secondary",
                    bigLabel: true,
                    id: "logout-warning-cancel",
                })}
            </div>
        </div>
    </dialog>`;
}
