import type { StoryObj, Meta } from '@storybook/html';
import type { ButtonProps } from './button';
import { Button } from './button';
import html from '../../html';

const meta: Meta<ButtonProps> = {
    title: 'button',
    tags: ['autodocs'],
    render: (args) => {
        return html`<div style="display: flex; gap: 1rem;padding: 1rem;">
            ${['primary', 'secondary', 'outline'].map((variant) =>
                Button({
                    ...args,
                    variant: variant as ButtonProps['variant'],
                })
            )}
        </div>`;
    },
    args: {
        text: 'button',
    },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {};

export const BigLabel: Story = {
    args: {
        bigLabel: true,
    },
};

export const Wide: Story = {
    args: {
        wide: true,
    },
};
