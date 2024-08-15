import type { Meta, StoryObj } from "@storybook/html";
import { SimpleUserMenu, type SimpleUserMenuProps } from "./simple-user-menu";

const meta: Meta<SimpleUserMenuProps> = {
    title: "header/simple-user-menu",
    tags: ["autodocs"],
    render: SimpleUserMenu,
};

export default meta;
type Story = StoryObj<SimpleUserMenuProps>;

export const Default: Story = { args: { name: "Tone Eriksen" } };
