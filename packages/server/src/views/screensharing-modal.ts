import clsInputs from "decorator-client/src/styles/inputs.module.css";
import cls from "decorator-client/src/styles/screensharing-modal.module.css";
import html, { Template } from "decorator-shared/html";
import { hydrateAttr } from "decorator-shared/hydration";
import {
    ScreensharingModal as SharedScreensharingModal,
    screensharingModalHook,
} from "decorator-shared/views/screensharing-modal";
import { match } from "ts-pattern";
import i18n from "../i18n";
import { Alert } from "./components/alert";
import { Button } from "./components/button";
import { ReadMore } from "./read-more";

export type ScreensharingModalProps = {
    children: Template;
    status: "enabled" | "disabled";
};

const ScreensharingModal = ({ children, status }: ScreensharingModalProps) =>
    SharedScreensharingModal({
        children,
        description: i18n("delskjerm_modal_beskrivelse"),
        readMore: ReadMore({
            header: i18n("delskjerm_modal_hjelpetekst_overskrift"),
            content: html`
                <div>${i18n("delskjerm_modal_hjelpetekst_0")}</div>
                <div>${i18n("delskjerm_modal_hjelpetekst_1")}</div>
                <div>${i18n("delskjerm_modal_hjelpetekst_2")}</div>
            `,
        }),
        status,
        title: i18n("footer_del_skjerm"),
    });

// @TODO: Implement deterministic ID generation
const ScreensharingEnabled = () => {
    return ScreensharingModal({
        status: "enabled",
        children: html`
            <form ${hydrateAttr(screensharingModalHook.form)}>
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
                        ${hydrateAttr(screensharingModalHook.input)}
                        type="text"
                        autocomplete="off"
                    />
                    <ul
                        class="${clsInputs.errorList}"
                        ${hydrateAttr(screensharingModalHook.errors)}
                    >
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
                        attributes: {
                            ["data-type"]: "cancel",
                            ["data-hydrate"]: screensharingModalHook.cancel,
                        },
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
