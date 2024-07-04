import type { Meta, StoryObj } from "@storybook/html";
import html from "decorator-shared/html";
import { PersonCircleIcon } from "decorator-shared/views/icons";
import type { ButtonProps } from "./button";
import { Button } from "./button";

const meta: Meta = {
    title: "button",
    tags: ["autodocs"],
    render: () => {
        return html`<div style="display: flex; gap: 1rem;padding: 1rem;">
                ${["primary", "secondary", "tertiary"].map((variant) =>
                    Button({
                        content: {
                            render: () =>
                                variant.charAt(0).toUpperCase() +
                                variant.slice(1),
                        },
                        variant: variant as ButtonProps["variant"],
                    }),
                )}
            </div>
            <div style="display: flex; gap: 1rem;padding: 1rem;">
                ${["primary", "secondary", "tertiary"].map((variant) =>
                    Button({
                        content: {
                            render: () =>
                                variant.charAt(0).toUpperCase() +
                                variant.slice(1),
                        },
                        icon: PersonCircleIcon({}),
                        variant: variant as ButtonProps["variant"],
                    }),
                )}
            </div> `;
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
