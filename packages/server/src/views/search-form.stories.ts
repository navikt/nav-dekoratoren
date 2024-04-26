import type { StoryObj, Meta } from "@storybook/html";
import type { SearchFormProps } from "./search-form";
import { SearchForm } from "./search-form";
import { texts } from "../texts";

const meta: Meta<SearchFormProps> = {
    title: "search/search-form",
    tags: ["autodocs"],
    render: SearchForm,
};

export default meta;
type Story = StoryObj<SearchFormProps>;

export const Default: Story = {
    args: {
        texts: texts.nb,
    },
};
