import { logAmplitudeEvent } from "../analytics/amplitude";
import { CustomEvents } from "../events";
import { logout } from "../helpers/auth";
import { defineCustomElement } from "./custom-elements";

export class ChangedUserDialog extends HTMLElement {
    private userId?: string;

    connectedCallback() {
        const dialog = this.querySelector("dialog") as HTMLDialogElement;
        const form = dialog.querySelector("form") as HTMLFormElement;

        window.addEventListener(
            "authupdated",
            (e: CustomEvent<CustomEvents["authupdated"]>) => {
                const currAuthUserId = e.detail.auth.authenticated
                    ? e.detail.auth.userId
                    : undefined;
                if (this.userId) {
                    if (!currAuthUserId) {
                        // TODO: Ønsker vi å håndtere dette på en måte?
                    }
                    if (this.userId !== currAuthUserId) {
                        dialog.showModal();
                    }
                }

                this.userId = currAuthUserId;
            },
        );

        // TODO: Hva skjer når man klikker på knappene
        form.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            const action = new FormData(form, event.submitter).get("action");
            if (action === "reload") {
                logAmplitudeEvent("changed user dialog reload");
                dialog.close();
            } else {
                logAmplitudeEvent("changed user dialog logout");
                logout();
            }
        });
    }

    disconnectedCallback() {}
}

defineCustomElement("changed-user-dialog", ChangedUserDialog);
