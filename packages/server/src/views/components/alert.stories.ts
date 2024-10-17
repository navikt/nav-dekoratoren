import type { Meta, StoryObj } from "@storybook/html";
import i18n from "../../i18n";
import { Alert, type AlertProps } from "./alert";

const meta: Meta<AlertProps> = {
    title: "components/alert",
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

export const Danger: Story = {
    args: {
        variant: "error",
        content: i18n("notifications_error"),
    },
};
