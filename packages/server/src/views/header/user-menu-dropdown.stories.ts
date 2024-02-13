import type { StoryObj, Meta } from '@storybook/html';
import type { UserMenuProps } from './user-menu';
import { UserMenuDropdown, UserMenuDropdownProps } from './user-menu-dropdown';
import { texts } from '../../texts';

// @TODO:: Lage en separat avatar komponent
const meta: Meta<UserMenuProps> = {
    title: 'header/user-menu-dropdown',
    tags: ['autodocs'],
    render: UserMenuDropdown,
};

export default meta;
type Story = StoryObj<UserMenuDropdownProps>;

export const ToneEriksen: Story = {
    args: {
        texts: texts.nb,
        name: 'Tone Eriksen',
    },
};

export const DagHelgeSandvikScott: Story = {
    args: {
        texts: texts.nb,
        name: 'Dag Helge Sandvik Scott',
    },
};
