import type { Meta, StoryObj } from "@storybook/html";
import { makeContextLinks } from "decorator-shared/context";
import type { ComplexHeaderProps } from "./complex-header";
import { ComplexHeader } from "./complex-header";

const meta: Meta<ComplexHeaderProps> = {
    title: "header/complex-header",
    tags: ["autodocs"],
    render: (args, context) =>
        ComplexHeader({ ...args, language: context.globals.locale }),
};

export default meta;
type Story = StoryObj<ComplexHeaderProps>;

export const Default: Story = {
    args: {
        contextLinks: makeContextLinks(""),
        context: "privatperson",
    },
};

export const LoggedInPrivatperson: Story = {
    args: {
        contextLinks: makeContextLinks(""),
        context: "privatperson",
    },
};

export const LoggedInPrivatpersonMobile: Story = {
    parameters: {
        layout: "fullscreen",
        viewport: { defaultViewport: "mobile" },
    },
    args: {
        contextLinks: makeContextLinks(""),
        context: "privatperson",
    },
};
