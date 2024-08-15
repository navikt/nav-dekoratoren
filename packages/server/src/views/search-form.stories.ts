import type { StoryObj, Meta } from "@storybook/html";
import { SearchForm } from "./search-form";

const meta: Meta = {
    title: "search/search-form",
    tags: ["autodocs"],
    render: SearchForm,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
