import type { Meta, StoryObj } from "@storybook/html";
import { createEvent } from "decorator-client/src/events";
import { isNorwegian } from "../../i18n";
import type { ComplexHeaderProps } from "./complex-header";
import { ComplexHeader } from "./complex-header";

const meta: Meta<ComplexHeaderProps> = {
    title: "header/complex-header",
    tags: ["autodocs"],
    render: (args, context) => {
        setTimeout(() => {
            dispatchEvent(
                createEvent("authupdated", {
                    detail: { auth: { authenticated: args.auth } },
                }),
            );
        }, 1000);
        return ComplexHeader({
            ...args,
            contextLinks: isNorwegian(context.globals.locale)
                ? [
                      {
                          url: "",
                          lenkeTekstId: "rolle_privatperson",
                          context: "privatperson",
                      },
                      {
                          url: "",
                          lenkeTekstId: "rolle_arbeidsgiver",
                          context: "arbeidsgiver",
                      },
                      {
                          url: "",
                          lenkeTekstId: "rolle_samarbeidspartner",
                          context: "samarbeidspartner",
                      },
                  ]
                : [],
            language: context.globals.locale,
        });
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        context: "privatperson",
        auth: false,
    },
};

export const LoggedInPrivatperson: Story = {
    args: {
        context: "privatperson",
        auth: true,
    },
};

export const LoggedInPrivatpersonMobile: Story = {
    parameters: {
        layout: "fullscreen",
        viewport: { defaultViewport: "mobile" },
    },
    args: {
        context: "privatperson",
        auth: true,
    },
};
