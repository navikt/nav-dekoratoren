import type { Meta, StoryObj } from "@storybook/html";
import "decorator-client/src/views/feedback";
import { Feedback } from "./feedback";

const meta: Meta = {
    title: "feedback",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: Feedback,
};
