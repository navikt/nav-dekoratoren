import cls from "decorator-client/src/styles/modal.module.css";
import html from "decorator-shared/html";
import { Button } from "./components/button";
import i18n from "../i18n";

// TODO: Finn ut av hva som skal stå i teksten og hvilke actions man skal ha
export const ChangedUserDialog = () => html`
    <changed-user-dialog>
        <dialog class="${cls.modal}">
            <form class="${cls.modalWindow}">
                <h1 class="${cls.modalTitle}">
                    ${i18n("changed_user_warning_title")}
                </h1>
                <p class="${cls.modalBody}">
                    ${i18n("changed_user_warning_body")}
                </p>
                <div class="${cls.buttonWrapper}">
                    ${Button({
                        content: i18n("ok"),
                        variant: "primary",
                        attributes: { name: "action", value: "reload" },
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
    </changed-user-dialog>
`;
