
import type { StoryObj, Meta } from '@storybook/html';
import { SimpleUserMenu, type SimpleUserMenuProps } from './simple-user-menu';
import { makeContextLinks } from 'decorator-shared/context';
import { texts } from '../texts';

const meta: Meta<SimpleUserMenuProps> = {
    title: 'header/simple-user-menu',
    tags: ['autodocs'],
    render: SimpleUserMenu,
};

export default meta;
type Story = StoryObj<SimpleUserMenuProps>;

export const Default: Story = {
    args: {
        name: 'Tone Eriksen',
        texts: texts.nb,
    },
};

