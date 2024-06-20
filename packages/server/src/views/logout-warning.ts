import html from "decorator-shared/html";
import cls from "decorator-client/src/styles/logout-warning.module.css";
import clsModal from "decorator-client/src/styles/modal.module.css";
import { Button } from "decorator-shared/views/components/button";

export type LogoutWarningProps = unknown;

export function LogoutWarning() {
    return html`<dialog class="${clsModal.modal}" id="logout-warning">
        <div class="${clsModal.modalWindow}">
            <h2 id="logout-warning-title" class="${clsModal.modalTitle}">
                Du blir snart logget ut automatisk
            </h2>
            <p id="logout-warning-body" class="${clsModal.modalBody}">
                Vil du fortsatt ${"være"} innlogget?
            </p>
            <div class="${cls.buttonWrapper}">
                ${Button({
                    text: "Ja",
                    variant: "primary",
                    bigLabel: true,
                    id: "logout-warning-confirm",
                })}
                ${Button({
                    text: "Logg ut",
                    variant: "secondary",
                    bigLabel: true,
                    id: "logout-warning-cancel",
                })}
            </div>
        </div>
    </dialog>`;
}
