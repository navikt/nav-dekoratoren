import type { Meta, StoryObj } from "@storybook/html";
import html from "decorator-shared/html";
import { LoginIcon, PersonCircleIcon } from "decorator-shared/views/icons";
import type { ButtonProps } from "./button";
import { Button } from "./button";

const Buttons = (props: Partial<ButtonProps> = {}) =>
    html`<div style="display: flex; gap: 1rem;padding: 1rem;">
        ${["primary", "secondary", "tertiary"].map((variant) =>
            Button({
                ...props,
                content: {
                    render: () =>
                        variant.charAt(0).toUpperCase() + variant.slice(1),
                },
                variant: variant as ButtonProps["variant"],
            }),
        )}
    </div>`;

const meta: Meta = {
    title: "button",
    tags: ["autodocs"],
    render: () => {
        return html`${[
            Buttons(),
            Buttons({ icon: PersonCircleIcon({}) }),
            Buttons({ icon: LoginIcon({}), href: "#" }),
        ]}`;
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
