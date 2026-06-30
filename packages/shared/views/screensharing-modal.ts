import clsModal from "decorator-client/src/styles/modal.module.css";
import clsButton from "decorator-client/src/styles/screenshare-button.module.css";
import cls from "decorator-client/src/styles/screensharing-modal.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import html, { type Template } from "../html";
import { VeilederIllustration } from "./illustrations";
import { defineHydrationHooks, hydrateAttr } from "../hydration";

export const [screensharingModalHook, screensharingModalSelector] =
    defineHydrationHooks({
        dialog: "screenshare.dialog",
        form: "screenshare.form",
        errors: "screenshare.errors",
        input: "screenshare.input",
        cancel: "screenshare.cancel",
    });

export type ScreensharingModalProps = {
    children: Template;
    description: Template;
    readMore: Template;
    status: "enabled" | "disabled";
    title: Template;
};

export const ScreensharingModal = ({
    children,
    description,
    readMore,
    status,
    title,
}: ScreensharingModalProps) => html`
    <screensharing-modal>
        <dialog
            class="${clsModal.modal} ${cls.screensharingModal}"
            ${hydrateAttr(screensharingModalHook.dialog)}
            data-status="${status}"
        >
            ${VeilederIllustration({ className: cls.avatar })}
            <div class="${clsModal.modalWindow} ${cls.content}">
                <h2 class="${clsModal.modalTitle}">${title}</h2>
                <p>${description}</p>
                ${readMore}
                <div class="${cls.children}">${children}</div>
            </div>
        </dialog>
    </screensharing-modal>
`;

export const ScreenshareButton = (text: Template) => html`
    <screenshare-button>
        <button class="${clsButton.screenshareButton}">
            ${text}
            <svg
                class="${utils.icon}"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                aria-hidden="true"
                role="img"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.25 4.5c0-.69.56-1.25 1.25-1.25h17c.69 0 1.25.56 1.25 1.25v11c0 .69-.56 1.25-1.25 1.25h-7.75v2.5H19a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5h5.25v-2.5H3.5c-.69 0-1.25-.56-1.25-1.25v-11Zm1.5.25v10.5h16.5V4.75H3.75Z"
                    fill="currentColor"
                ></path>
            </svg>
        </button>
    </screenshare-button>
`;
