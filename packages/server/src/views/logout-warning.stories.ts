import type { StoryObj, Meta } from "@storybook/html";
import type { LogoutWarningProps } from "./logout-warning";
import { LogoutWarning } from "./logout-warning";

const meta: Meta<LogoutWarningProps> = {
    title: "logout-warning",
    render: () => {
        setTimeout(() => {
            // @ts-expect-error: document in server-package
            document.getElementById("logout-warning").showModal();
        }, 0);

        return LogoutWarning();
    },
};

export default meta;
type Story = StoryObj<LogoutWarningProps>;

export const Default: Story = {};
