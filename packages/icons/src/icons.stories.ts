import type { Meta, StoryObj } from "@storybook/html";
import * as icons from ".";
import {
    FridaIcon,
    MessageIcon,
    PersonCircleNotificationIcon,
    TaskIcon,
} from "../dist";

const meta: Meta = {
    title: "icons",
    render: (_, context) => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.gap = "1rem";

        setInterval(() => {
            div.setAttribute(
                "aria-expanded",
                div.getAttribute("aria-expanded") === "true" ? "false" : "true",
            );
        }, 1000);

        div.innerHTML = [
            ...Object.values(icons),
            FridaIcon,
            MessageIcon,
            PersonCircleNotificationIcon,
            TaskIcon,
        ]
            .map((icon) =>
                icon().render({
                    language: context.globals.locale,
                }),
            )
            .join("");

        return div;
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
