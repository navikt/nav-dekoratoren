import type { Meta, StoryObj } from "@storybook/html";
import { ConsentBanner as ClientComponent } from "decorator-client/src/views/consent-banner";
import type { ConsentBannerProps } from "./consent-banner";
import { ConsentBanner } from "./consent-banner";

const meta: Meta<ConsentBannerProps> = {
    title: "consent-banner",
    tags: ["autodocs"],
    render: () => {
        setTimeout(() => {
            const modal = document.querySelector(
                "consent-banner",
            ) as ClientComponent;

            modal.showModal();
        }, 0);

        return ConsentBanner({ foo: "bar" });
    },
};

export default meta;
type Story = StoryObj<ConsentBannerProps>;

export const Default: Story = {
    args: {
        foo: "bar",
    },
};
