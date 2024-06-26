import type { Meta, StoryObj } from "@storybook/html";
import { FeedbackSuccess } from "decorator-client/src/views/feedback-success";
import { Feedback } from "./feedback";

const meta: Meta = {
    title: "feedback",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: Feedback,
};

export const Success: Story = {
    render: FeedbackSuccess,
};
