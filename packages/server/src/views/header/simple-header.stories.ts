import type { Meta, StoryObj } from "@storybook/html";
import type { SimpleHeaderProps } from "./simple-header";
import { SimpleHeader } from "./simple-header";

const meta: Meta<SimpleHeaderProps> = {
    title: "header/simple-header",
    tags: ["autodocs"],
    render: SimpleHeader,
};

export default meta;
type Story = StoryObj<SimpleHeaderProps>;

export const Default: Story = {};
