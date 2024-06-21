import type { Meta, StoryObj } from "@storybook/html";
import "decorator-client/src/views/screensharing-modal";
import { ScreensharingModal } from "decorator-client/src/views/screensharing-modal";
import type { GetScreensharingModalOptions } from "./screensharing-modal";
import { getModal } from "./screensharing-modal";

const meta: Meta<GetScreensharingModalOptions> = {
    title: "screensharing-modal",
    tags: ["autodocs"],
    render: (args, context) => {
        setTimeout(() => {
            const modal = document.querySelector(
                "screensharing-modal",
            ) as ScreensharingModal;
            console.log(modal);
            modal.showModal();
        }, 0);

        const div = document.createElement("div");

        div.innerHTML = getModal({
            ...args,
        }).render({
            language: context.globals.locale,
            context: "privatperson",
        });

        return div;
    },
};

export default meta;
type Story = StoryObj<GetScreensharingModalOptions>;

export const Enabled: Story = {
    args: { enabled: true },
};

export const Disabled: Story = {
    args: { enabled: false },
};
