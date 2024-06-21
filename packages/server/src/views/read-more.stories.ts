import type { StoryObj, Meta } from "@storybook/html";
import { ReadMore, ReadMoreProps } from "./read-more";
import html from "decorator-shared/html";

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
            <div>
                Når du deler skjerm med NAV kontaktsenter kan veilederen hjelpe
                deg med å finne fram på nav.no.
            </div>
            <div>
                Veilederen ser kun det du ser på nav.no og kan ikke fylle inn
                opplysninger eller sende inn noe på dine vegne.
            </div>
            <div>
                Det er du som godkjenner skjermdeling. Ingenting blir lagret.
            </div>
        `,
    },
};
