import type { Meta, StoryObj } from "@storybook/html";
import { ConsentBanner as ClientComponent } from "decorator-client/src/views/consent-banner";
import { ConsentBanner } from "./consent-banner";

const meta: Meta = {
    title: "consent-banner",
    tags: ["autodocs"],
    render: () => {
        setTimeout(() => {
            const modal = document.querySelector(
                "consent-banner",
            ) as ClientComponent;

            modal.showModal();
        }, 0);

        return ConsentBanner();
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        foo: "bar",
    },
};
