import type { Meta, StoryObj } from "@storybook/html";
import type { UserMenuProps } from "./user-menu";
import { UserMenuDropdown, UserMenuDropdownProps } from "./user-menu-dropdown";

// @TODO:: Lage en separat avatar komponent
const meta: Meta<UserMenuProps> = {
    title: "header/user-menu-dropdown",
    tags: ["autodocs"],
    render: UserMenuDropdown,
};

export default meta;
type Story = StoryObj<UserMenuDropdownProps>;

export const ToneEriksen: Story = {
    args: { name: "Tone Eriksen" },
};

export const DagHelgeSandvikScott: Story = {
    args: { name: "Dag Helge Sandvik Scott" },
};
