import type { Meta, StoryObj } from "@storybook/html";
import type { ArbeidsgiverUserMenuProps } from "./arbeidsgiver-user-menu";
import { ArbeidsgiverUserMenu } from "./arbeidsgiver-user-menu";

const meta: Meta<ArbeidsgiverUserMenuProps> = {
    title: "header/arbeidsgiver-user-menu",
    tags: ["autodocs"],
    render: ArbeidsgiverUserMenu,
};

export default meta;
type Story = StoryObj<ArbeidsgiverUserMenuProps>;

export const Default: Story = { args: { href: "min/side" } };
