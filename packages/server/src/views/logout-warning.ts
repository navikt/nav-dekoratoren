import html from "decorator-shared/html";
import {
    LogoutWarning as SharedLogoutWarning,
    SessionDialog,
    TokenDialog,
} from "decorator-shared/views/logout-warning";
import { Button } from "./components/button";
import i18n from "../i18n";

export const LogoutWarning = () =>
    SharedLogoutWarning({
        tokenDialog: TokenDialog({
            title: i18n("token_warning_title"),
            body: i18n("token_warning_body"),
            buttons: html`
                ${Button({
                    content: i18n("yes"),
                    variant: "primary",
                    attributes: { name: "action", value: "renew" },
                    type: "submit",
                })}
                ${Button({
                    content: i18n("logout"),
                    variant: "secondary",
                    attributes: { name: "action", value: "logout" },
                    type: "submit",
                })}
            `,
        }),
        sessionDialog: SessionDialog({
            title: i18n("session_warning_title"),
            body: i18n("session_warning_body"),
            buttons: html`
                ${Button({
                    content: i18n("ok"),
                    variant: "primary",
                    attributes: { name: "action", value: "renew" },
                    type: "submit",
                })}
                ${Button({
                    content: i18n("logout"),
                    variant: "secondary",
                    attributes: { name: "action", value: "logout" },
                    type: "submit",
                })}
            `,
        }),
    });
