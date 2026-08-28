import type { Meta, StoryObj } from "@storybook/html";
import { ConsentBanner } from "./consent-banner";

const meta: Meta = {
    title: "consent-banner",
    tags: ["autodocs"],
    render: () => {
        // The banner has no imperative show/hide API. Presentation is driven by this
        // attribute alone, so the story sets it the same way the runtime does.
        document.documentElement.dataset.decoratorConsent = "pending";

        return ConsentBanner({ language: "nb" });
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Reshow: Story = {
    render: () => {
        document.documentElement.dataset.decoratorConsent = "reshow";

        return ConsentBanner({ language: "nb" });
    },
};
