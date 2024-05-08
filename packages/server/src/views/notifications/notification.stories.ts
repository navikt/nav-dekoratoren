import type { StoryObj, Meta } from "@storybook/html";
import type { NotificationProps } from "./notification";
import { Notification } from "./notification";

const meta: Meta<NotificationProps> = {
    title: "notifications/notification",
    tags: ["autodocs"],
    render: Notification,
};

export default meta;
type Story = StoryObj<NotificationProps>;

export const Default: Story = {
    args: {
        text: "Du har motatt et vedtak på søknaden din om foreldrepenger",
        link: "https://www.nav.no",
        title: "Oppgave",
        date: "2023-08-08T13:24:23.75234+02:00",
        icon: "task",
        metadata: "Varslet på SMS",
    },
};
