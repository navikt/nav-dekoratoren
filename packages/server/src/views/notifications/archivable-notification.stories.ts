import type { StoryObj, Meta } from "@storybook/html";
import type { ArchivableNotificationProps } from "./archivable-notification";
import { ArchivableNotification } from "./archivable-notification";
import { texts } from "../../texts";

const meta: Meta<ArchivableNotificationProps> = {
    title: "notifications/archivable-notification",
    tags: ["autodocs"],
    render: ArchivableNotification,
};

export default meta;
type Story = StoryObj<ArchivableNotificationProps>;

export const Default: Story = {
    args: {
        text: "Husk timeavtalen du har med veileder tirsdag 18. oktober, kl. 12.30.",
        date: "2023-08-08T13:24:23.75234+02:00",
        icon: "message",
        title: "Beskjed",
        metadata: "Varslet på e-post",
        texts: texts.nb,
    },
};
