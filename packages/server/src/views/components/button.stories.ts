import type { Meta, StoryObj } from "@storybook/html";
import {
    ClothingHangerIcon,
    EnterIcon,
    PersonCircleNotificationIcon,
    RockingHorseIcon,
} from "decorator-icons";
import html from "decorator-shared/html";
import i18n from "../../i18n";
import { Button, ButtonProps } from "./button";
import { HeaderButton } from "./header-button";

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
            Buttons({ icon: RockingHorseIcon() }),
            Buttons({ icon: ClothingHangerIcon(), href: "#" }),
            HeaderButton({
                content: i18n("login"),
                icon: EnterIcon(),
                href: "#",
            }),
            HeaderButton({
                content: i18n("menu"),
                icon: PersonCircleNotificationIcon(),
            }),
        ]}`;
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
