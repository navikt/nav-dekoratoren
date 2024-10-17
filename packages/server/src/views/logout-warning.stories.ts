import type { StoryObj, Meta } from "@storybook/html";
import { SessionDialog } from "decorator-client/src/views/logout-warning/session-dialog";
import { TokenDialog } from "decorator-client/src/views/logout-warning/token-dialog";
import { LogoutWarning } from "./logout-warning";
import { addSecondsFromNow } from "decorator-client/src/helpers/time";

const meta: Meta = {
    title: "logout-warning",
    render: ({ variant }) => {
        setTimeout(() => {
            const tokenDialog = document.querySelector(
                "token-dialog",
            ) as TokenDialog;
            const sessionDialog = document.querySelector(
                "session-dialog",
            ) as SessionDialog;
            switch (variant) {
                case "token":
                    tokenDialog.tokenExpireAtLocal = addSecondsFromNow(256);
                    break;
                case "session":
                    sessionDialog.sessionExpireAtLocal = addSecondsFromNow(256);
                    break;
            }
        }, 0);

        return LogoutWarning();
    },
};

export default meta;
type Story = StoryObj;

export const TokenExpiration: Story = { args: { variant: "token" } };
export const SessionExpiration: Story = { args: { variant: "session" } };
