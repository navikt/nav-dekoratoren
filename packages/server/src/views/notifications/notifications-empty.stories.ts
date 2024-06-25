import type { Meta, StoryObj } from "@storybook/html";
import { NotificationsEmpty } from "./notifications-empty";

const meta: Meta = {
    title: "notifications/empty",
    tags: ["autodocs"],
    render: NotificationsEmpty,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
