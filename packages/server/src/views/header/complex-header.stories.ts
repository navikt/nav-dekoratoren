import type { Meta, StoryObj } from "@storybook/html";
import { createEvent } from "decorator-client/src/events";
import html from "decorator-shared/html";
import { isNorwegian } from "../../i18n";
import { ComplexHeader } from "./complex-header";
import { UserMenuDropdown } from "./user-menu-dropdown";

const meta: Meta = {
    title: "header/complex-header",
    render: (args, context) => {
        setTimeout(() => {
            dispatchEvent(
                createEvent("authupdated", {
                    detail: {
                        auth: { authenticated: args.auth },
                        usermenuHtml: UserMenuDropdown({
                            name: "Ola Nordmann",
                            notifications: [],
                            level: "Level3",
                            loginUrl: "/logginn",
                            logoutUrl: "/loggut",
                            minsideUrl: "/minside",
                            personopplysningerUrl: "/personopplysninger",
                        }).render({ language: context.globals.locale }),
                    },
                }),
            );
        }, 1000);
        return ComplexHeader({
            frontPageUrl: "/",
            context: "privatperson",
            decoratorUtils: html``,
            loginUrl: "/logginn",
            contextLinks: isNorwegian(context.globals.locale)
                ? [
                      { url: "", context: "privatperson" },
                      { url: "", context: "arbeidsgiver" },
                      { url: "", context: "samarbeidspartner" },
                  ]
                : [],
            language: context.globals.locale,
        });
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: { auth: false },
};

export const LoggedInPrivatperson: Story = {
    args: { auth: true },
};
