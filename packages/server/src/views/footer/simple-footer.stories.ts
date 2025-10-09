import type { Meta, StoryObj } from "@storybook/html";
import type { SimpleFooterProps } from "./simple-footer";
import { SimpleFooter } from "./simple-footer";

const meta: Meta<SimpleFooterProps> = {
    title: "footer/simple",
    render: (_, context) => {
        const args = {
            features: {
                "dekoratoren.skjermdeling": true,
                "dekoratoren.chatbotscript": false,
                "dekoratoren.umami": false,
                "puzzel-script": false,
            },
            links:
                context.globals.locale === "en"
                    ? [
                          {
                              content: "Privacy and cookies",
                              url: "/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten",
                          },
                          {
                              content: "Fraud attempts and security",
                              url: "/svindel/en",
                          },
                          {
                              content: "Accessibility at nav.no",
                              url: "/tilgjengelighet/en",
                          },
                      ]
                    : [
                          {
                              content: "Personvern og informasjonskapsler",
                              url: "/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten",
                          },
                          {
                              content: "Tilgjengelighet",
                              url: "/tilgjengelighet",
                          },
                      ],
        };
        return SimpleFooter(args);
    },
};

export default meta;
type Story = StoryObj<SimpleFooterProps>;

export const Default: Story = {};
