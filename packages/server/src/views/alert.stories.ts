import type { Meta, StoryObj } from "@storybook/html";
import { Alert, type AlertProps } from "./alert";
import i18n from "../i18n";

const meta: Meta<AlertProps> = {
    title: "alert",
    tags: ["autodocs"],
    render: Alert,
};

export default meta;
type Story = StoryObj<AlertProps>;

export const Info: Story = {
    args: {
        variant: "info",
        content: i18n("security_level_info"),
    },
};

export const Error: Story = {
    args: {
        variant: "error",
        content: i18n("notifications_error"),
    },
};
