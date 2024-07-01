import type { Meta, StoryObj } from "@storybook/html";
import "./chatbot";

const meta: Meta = {
    title: "chatbot",
    tags: ["autodocs"],
    render: () => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = "<d-chatbot></d-chatbot>";

        window.__DECORATOR_DATA__ = {
            params: { chatbot: true, chatbotVisible: true },
            features: { ["dekoratoren.chatbotscript"]: true },
            env: { ENV: "production" },
        } as any;

        return wrapper;
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
