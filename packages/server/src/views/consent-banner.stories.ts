import type { Meta, StoryObj } from "@storybook/html";
import { CONSENT_STATE_ELEMENT_ID } from "decorator-shared/constants";
import { ConsentBanner } from "./consent-banner";

// The banner has no imperative show/hide API. Presentation is driven by the state
// element alone, so the stories set it the same way the runtime does.
const setConsentState = (state: "pending" | "reshow") => {
    let stateElement = document.getElementById(CONSENT_STATE_ELEMENT_ID);
    if (!stateElement) {
        stateElement = document.createElement("style");
        stateElement.id = CONSENT_STATE_ELEMENT_ID;
        document.head.append(stateElement);
    }
    stateElement.dataset.state = state;
};

const meta: Meta = {
    title: "consent-banner",
    tags: ["autodocs"],
    render: () => {
        setConsentState("pending");

        return ConsentBanner({ language: "nb" });
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Reshow: Story = {
    render: () => {
        setConsentState("reshow");

        return ConsentBanner({ language: "nb" });
    },
};
