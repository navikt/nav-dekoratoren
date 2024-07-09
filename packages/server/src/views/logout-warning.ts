import cls from "decorator-client/src/styles/logout-warning.module.css";
import clsModal from "decorator-client/src/styles/modal.module.css";
import html from "decorator-shared/html";
import { Button } from "./button";
import i18n from "../i18n";

export const LogoutWarning = () => html`
    <logout-warning>
        <token-dialog>
            <dialog class="${clsModal.modal}">
                <form class="${clsModal.modalWindow}">
                    <h1 class="${clsModal.modalTitle}">
                        ${i18n("token_warning_title")}
                    </h1>
                    <p class="${clsModal.modalBody}">
                        ${i18n("token_warning_body")}
                    </p>
                    <div class="${cls.buttonWrapper}">
                        ${Button({
                            content: i18n("yes"),
                            variant: "primary",
                            attributes: { name: "action", value: "renew" },
                            type: "submit",
                        })}
                        ${Button({
                            content: i18n("logout"),
                            variant: "secondary",
                            attributes: { name: "action", value: "logout" },
                            type: "submit",
                        })}
                    </div>
                </form>
            </dialog>
        </token-dialog>
        <session-dialog>
            <dialog class="${clsModal.modal}">
                <form class="${clsModal.modalWindow}">
                    <h1 class="${clsModal.modalTitle}">
                        ${i18n("session_warning_title")}
                    </h1>
                    <p class="${clsModal.modalBody}">
                        ${i18n("session_warning_body")}
                    </p>
                    <div class="${cls.buttonWrapper}">
                        ${Button({
                            content: i18n("ok"),
                            variant: "primary",
                            attributes: { name: "action", value: "renew" },
                            type: "submit",
                        })}
                        ${Button({
                            content: i18n("logout"),
                            variant: "secondary",
                            attributes: { name: "action", value: "logout" },
                            type: "submit",
                        })}
                    </div>
                </form>
            </dialog>
        </session-dialog>
    </logout-warning>
`;
