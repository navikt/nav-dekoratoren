import type { Meta, StoryObj } from "@storybook/html";
import { texts } from "../../texts";
import type { NotificationsProps } from "./notifications";
import { Notifications } from "./notifications";

const meta: Meta<NotificationsProps> = {
    title: "notifications/list",
    tags: ["autodocs"],
    render: Notifications,
};

export default meta;
type Story = StoryObj<NotificationsProps>;

export const Default: Story = {
    args: {
        texts: texts.nb,
        notifications: [
            {
                id: "a",
                date: "2023-02-03T14:52:09.623+01:00",
                type: "task",
                channels: [],
                masked: true,
            },
            {
                id: "b",
                text: "Oppgave 2",
                date: "2023-05-11T10:42:38.247492+02:00",
                type: "task",
                link: "http://nav.no",
                channels: ["SMS"],
                masked: false,
            },
            {
                id: "c",
                date: "2023-07-04T11:41:18.259801+02:00",
                type: "message",
                channels: [],
                masked: true,
            },
            {
                id: "d",
                text: "Beskjed 2",
                date: "2023-07-06T13:50:50.825129+02:00",
                type: "message",
                channels: ["EPOST"],
                link: "http://nav.no",
                masked: false,
            },
            {
                id: "e",
                text: "Beskjed 3",
                date: "2023-08-03T14:29:19.052696+02:00",
                type: "message",
                channels: [],
                link: undefined,
                masked: false,
            },
        ],
    },
};
