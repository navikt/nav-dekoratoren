import type { Meta, StoryObj } from "@storybook/html";
import type { ComplexFooterProps } from "./complex-footer";
import { ComplexFooter } from "./complex-footer";

const meta: Meta<ComplexFooterProps> = {
    title: "footer/complex",
    render: (_, context) => {
        const args = {
            features: {
                "dekoratoren.skjermdeling": true,
                "dekoratoren.chatbotscript": false,
            },
            links:
                context.globals.locale === "en"
                    ? [
                          {
                              heading: "Contact",
                              children: [
                                  {
                                      content: "Contact us",
                                      url: "/redirects/footer-contactus-en",
                                  },
                                  {
                                      content: "Your local Nav office",
                                      url: "/no/nav-og-samfunn/kontakt-nav/nav-i-ditt-fylke",
                                  },
                                  {
                                      content: "Complaints, feedback, praise",
                                      url: "https://www.nav.no/person/kontakt-oss/en/tilbakemeldinger",
                                  },
                              ],
                          },
                          {
                              heading: "Nav and society",
                              children: [
                                  {
                                      content: "Statistics, analysis and R&D",
                                      url: "/no/nav-og-samfunn/statistikk-analyse-og-fou",
                                  },
                                  {
                                      content: "Public Relations",
                                      url: "/samarbeidspartner/presse",
                                  },
                                  {
                                      content:
                                          "Rules and regulations (lovdata.no)",
                                      url: "https://lovdata.no/nav/",
                                  },
                                  {
                                      content: "About Nav",
                                      url: "/hva-er-nav/en",
                                  },
                                  {
                                      content: "Work with us",
                                      url: "/sok-jobb-i-nav",
                                  },
                              ],
                          },
                          {
                              heading: "Other languages",
                              children: [
                                  { content: "Norwegian", url: "/no/en" },
                                  { content: "Sámegiella", url: "/se" },
                              ],
                          },
                          {
                              children: [
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
                              ],
                          },
                      ]
                    : [
                          {
                              heading: "Kontakt",
                              children: [
                                  {
                                      content: "Kontakt oss",
                                      url: "/person/kontakt-oss/nb",
                                  },
                                  {
                                      content: "Nav i ditt fylke",
                                      url: "/no/nav-og-samfunn/kontakt-nav/nav-i-ditt-fylke",
                                  },
                                  {
                                      content: "Kurs fra Nav",
                                      url: "/no/nav-og-samfunn/kontakt-nav/kurs-fra-nav",
                                  },
                                  {
                                      content: "Klage, tilbakemelding, ros",
                                      url: "/person/kontakt-oss/tilbakemeldinger",
                                  },
                              ],
                          },
                          {
                              heading: "Nyheter og presse",
                              children: [
                                  {
                                      content:
                                          "Nyheter, pressemeldinger og pressekontakt",
                                      url: "/samarbeidspartner/presse",
                                  },
                              ],
                          },
                          {
                              heading: "Nav og samfunn",
                              children: [
                                  {
                                      content: "Statistikk, analyse og FoU",
                                      url: "/no/nav-og-samfunn/statistikk-analyse-og-fou",
                                  },
                                  {
                                      content: "Lover og regler (lovdata.no)",
                                      url: "https://lovdata.no/nav/",
                                  },
                                  {
                                      content: "Om Nav",
                                      url: "/no/nav-og-samfunn/om-nav/om-nav",
                                  },
                              ],
                          },
                          {
                              heading: "Andre språk",
                              children: [
                                  {
                                      content: "English",
                                      url: "/en",
                                  },
                                  {
                                      content: "Sámegiella",
                                      url: "/se",
                                  },
                              ],
                          },
                          {
                              children: [
                                  {
                                      content:
                                          "Personvern og informasjonskapsler",
                                      url: "/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten",
                                  },
                                  {
                                      content: "Tilgjengelighet",
                                      url: "/tilgjengelighet",
                                  },
                              ],
                          },
                      ],
        };
        return ComplexFooter(args);
    },
};

export default meta;
type Story = StoryObj<ComplexFooterProps>;

export const Default: Story = {};
