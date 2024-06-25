import type { Meta, StoryObj } from "@storybook/html";
import html from "decorator-shared/html";
import i18n from "../i18n";
import { ReadMore, ReadMoreProps } from "./read-more";

const meta: Meta<ReadMoreProps> = {
    title: "read-more",
    tags: ["autodocs"],
    render: ReadMore,
};

export default meta;
type Story = StoryObj<ReadMoreProps>;

export const Default: Story = {
    args: {
        header: i18n("delskjerm_modal_hjelpetekst_overskrift"),
        content: html`
            <div>${i18n("delskjerm_modal_hjelpetekst_0")}</div>
            <div>${i18n("delskjerm_modal_hjelpetekst_1")}</div>
            <div>${i18n("delskjerm_modal_hjelpetekst_2")}</div>
        `,
    },
};
