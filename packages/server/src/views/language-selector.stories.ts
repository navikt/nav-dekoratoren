import type { Meta, StoryObj } from "@storybook/html";
import type { LanguageSelectorProps } from "./language-selector";
import { LanguageSelector } from "./language-selector";
import { LanguageSelector as ClientComponent } from "decorator-client/src/views/language-selector";
import html from "decorator-shared/html";
import { texts } from "../texts";

const meta: Meta<LanguageSelectorProps> = {
    title: "header/language-selector",
    tags: ["autodocs"],
    render: (args) => {
        setTimeout(() => {
            const ls = document.querySelector(
                "language-selector",
            ) as ClientComponent;
            ls.availableLanguages = args.availableLanguages;
            ls.language = "en";
        }, 0);

        return html`
            <div style="height: 300px">${LanguageSelector(args)}</div>
        `;
    },
};

export default meta;
type Story = StoryObj<LanguageSelectorProps>;

export const Default: Story = {
    args: {
        availableLanguages: [
            { locale: "nb", handleInApp: true },
            {
                locale: "en",
                url: "https://www.nav.no/en/person",
                handleInApp: false,
            },
        ],
        texts: texts["en"],
    },
};
