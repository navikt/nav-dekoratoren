import type { Meta, StoryObj } from "@storybook/html";
import { texts } from "../../texts";
import type { UserMenuProps } from "./user-menu";
import { UserMenu } from "./user-menu";

const meta: Meta<UserMenuProps> = {
    title: "header/user-menu",
    tags: ["autodocs"],
    render: UserMenu,
};

export default meta;
type Story = StoryObj<UserMenuProps>;

export const LowAuthLevel: Story = {
    args: {
        texts: texts.nb,
        name: "Charlie Jensen",
        notifications: [
            {
                id: "a",
                date: "2023-02-03T14:52:09.623+01:00",
                type: "task",
                channels: [],
                masked: true,
            },
        ],
    },
};

export const HighAuthLevel: Story = {
    args: {
        texts: texts.nb,
        name: "Charlie Jensen",
        level: "Level4",
        notifications: [
            {
                id: "b",
                text: "Oppgave 2",
                date: "2023-05-11T10:42:38.247492+02:00",
                type: "task",
                link: "https://nav.no",
                channels: ["SMS"],
                masked: false,
            },
        ],
    },
};
