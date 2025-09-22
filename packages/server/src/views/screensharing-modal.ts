import clsInputs from "decorator-client/src/styles/inputs.module.css";
import clsModal from "decorator-client/src/styles/modal.module.css";
import cls from "decorator-client/src/styles/screensharing-modal.module.css";
import html, { Template } from "decorator-shared/html";
import { VeilederIllustration } from "decorator-shared/views/illustrations";
import { match } from "ts-pattern";
import i18n from "../i18n";
import { Alert } from "./components/alert";
import { Button } from "./components/button";
import { ReadMore } from "./read-more";

export type ScreensharingModalProps = {
    children: Template;
    status: "enabled" | "disabled";
};

const ScreensharingModal = ({
    children,
    status,
}: ScreensharingModalProps) => html`
    <screensharing-modal>
        <dialog
            class="${clsModal.modal} ${cls.screensharingModal}"
            data-status="${status}"
        >
            ${VeilederIllustration({ className: cls.avatar })}
            <div class="${clsModal.modalWindow} ${cls.content}">
                <h2 class="${clsModal.modalTitle}">
                    ${i18n("footer_del_skjerm")}
                </h2>
                <p>${i18n("delskjerm_modal_beskrivelse")}</p>
                ${ReadMore({
                    header: i18n("delskjerm_modal_hjelpetekst_overskrift"),
                    content: html`
                        <div>${i18n("delskjerm_modal_hjelpetekst_0")}</div>
                        <div>${i18n("delskjerm_modal_hjelpetekst_1")}</div>
                        <div>${i18n("delskjerm_modal_hjelpetekst_2")}</div>
                    `,
                })}
                <div class="${cls.children}">${children}</div>
            </div>
        </dialog>
    </screensharing-modal>
`;

// @TODO: Implement deterministic ID generation
const ScreensharingEnabled = () => {
    return ScreensharingModal({
        status: "enabled",
        children: html`
            <form>
                <div>
                    <label
                        for="screensharing_code"
                        class="${clsInputs.textInputLabel}"
                        >${i18n("delskjerm_modal_label")}</label
                    >
                    <input
                        id="screensharing_code"
                        name="screensharing_code"
                        class="${clsInputs.textInput}"
                        type="text"
                        autocomplete="off"
                    />
                    <ul class="${clsInputs.errorList}">
                        <li>${i18n("delskjerm_modal_feilmelding")}</li>
                    </ul>
                </div>
                <div class="${cls.buttonsWrapper}">
                    ${Button({
                        content: i18n("delskjerm_modal_start"),
                        variant: "primary",
                        type: "submit",
                    })}
                    ${Button({
                        content: i18n("delskjerm_modal_avbryt"),
                        attributes: { ["data-type"]: "cancel" },
                    })}
                </div>
            </form>
        `,
    });
};

// Vises hvis unleash er skrudd av, men skrudd på i features.
const ScreensharingDisabledModal = () => {
    return ScreensharingModal({
        status: "disabled",
        children: Alert({
            variant: "error",
            content: i18n("delskjerm_modal_stengt"),
        }),
    });
};

export type GetScreensharingModalOptions = {
    enabled: boolean;
};

export const getModal = ({ enabled }: GetScreensharingModalOptions) => {
    return match(enabled)
        .with(true, () => ScreensharingEnabled())
        .with(false, () => ScreensharingDisabledModal())
        .exhaustive();
};
