import type { StoryObj, Meta } from "@storybook/html";
import { ChatbotWrapper } from "./chatbot-wrapper";

const meta: Meta<any> = {
    title: "footer/chatbot-wrapper",
    tags: ["autodocs"],
    render: ChatbotWrapper,
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
    args: {
        breadcrumbs: [
            {
                title: "Arbeid og opphold i Norge",
                url: "https://www.nav.no/person/flere-tema/arbeid-og-opphold-i-norge",
            },
            {
                title: "Medlemskap i folketrygden",
                url: "https://www.nav.no/person/flere-tema/arbeid-og-opphold-i-norge",
            },
        ],
    },
};

export const Empty: Story = {
    args: {
        breadcrumbs: [],
    },
};
