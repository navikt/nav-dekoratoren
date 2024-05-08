import type { StoryObj, Meta } from "@storybook/html";
import type { SimpleFooterProps } from "./simple-footer";
import { SimpleFooter } from "./simple-footer";
import { texts } from "../../texts";

const meta: Meta<SimpleFooterProps> = {
    title: "footer/simple",
    tags: ["autodocs"],
    render: SimpleFooter,
};

export default meta;
type Story = StoryObj<SimpleFooterProps>;

export const Default: Story = {
    args: {
        features: {
            "dekoratoren.skjermdeling": true,
            "dekoratoren.chatbotscript": false,
        },
        texts: texts.nb,
        links: [
            {
                content: "Personvern og informasjonskapsler",
                url: "/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten",
            },
            {
                content: "Tilgjengelighet",
                url: "/tilgjengelighet",
            },
        ],
    },
};
