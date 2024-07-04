import type { Meta, StoryObj } from "@storybook/html";
import html from "decorator-shared/html";
import {
    BurgerIcon,
    LoginIcon,
    PersonCircleIcon,
} from "decorator-shared/views/icons";
import { Button, ButtonProps } from "./button";
import { HeaderButton } from "./header-button";
import i18n from "../../i18n";

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
    title: "components/button",
    render: () => {
        return html`${[
            Buttons(),
            Buttons({ icon: PersonCircleIcon({}) }),
            Buttons({ icon: LoginIcon({}), href: "#" }),
            HeaderButton({
                content: i18n("login"),
                icon: LoginIcon({}),
                href: "#",
            }),
            HeaderButton({
                content: i18n("menu"),
                icon: BurgerIcon(),
            }),
        ]}`;
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
