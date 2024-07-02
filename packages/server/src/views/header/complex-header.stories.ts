import type { Meta, StoryObj } from "@storybook/html";
import type { ComplexHeaderProps } from "./complex-header";
import { ComplexHeader } from "./complex-header";
import { isNorwegian } from "../../i18n";

const meta: Meta<ComplexHeaderProps> = {
    title: "header/complex-header",
    tags: ["autodocs"],
    render: (args, context) =>
        ComplexHeader({
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
        }),
};

export default meta;
type Story = StoryObj<ComplexHeaderProps>;

export const Default: Story = {
    args: {
        context: "privatperson",
    },
};

export const LoggedInPrivatperson: Story = {
    args: {
        context: "privatperson",
    },
};

export const LoggedInPrivatpersonMobile: Story = {
    parameters: {
        layout: "fullscreen",
        viewport: { defaultViewport: "mobile" },
    },
    args: {
        context: "privatperson",
    },
};
