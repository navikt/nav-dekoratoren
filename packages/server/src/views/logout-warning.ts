import cls from "decorator-client/src/styles/logout-warning.module.css";
import clsModal from "decorator-client/src/styles/modal.module.css";
import html from "decorator-shared/html";
import { Button } from "./components/button";
import i18n from "../i18n";

export type LogoutWarningProps = unknown;

export function LogoutWarning() {
    return html`<dialog class="${clsModal.modal}" id="logout-warning">
        <div class="${clsModal.modalWindow}">
            <h1 id="logout-warning-title" class="${clsModal.modalTitle}">
                ${i18n("token_warning_title")}
            </h1>
            <p id="logout-warning-body" class="${clsModal.modalBody}">
                ${i18n("token_warning_body")}
            </p>
            <div class="${cls.buttonWrapper}">
                ${Button({
                    content: i18n("yes"),
                    variant: "primary",
                    attributes: {
                        id: "logout-warning-confirm",
                    },
                })}
                ${Button({
                    content: i18n("logout"),
                    variant: "secondary",
                    attributes: {
                        id: "logout-warning-cancel",
                    },
                })}
            </div>
        </div>
    </dialog>`;
}
