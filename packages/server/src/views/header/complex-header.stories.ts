import type { StoryObj, Meta } from '@storybook/html';
import type { ComplexHeaderProps } from './complex-header';
import { ComplexHeader } from './complex-header';
import { texts } from '../../texts';
import { makeContextLinks } from 'decorator-shared/context';

const meta: Meta<ComplexHeaderProps> = {
    title: 'header/complex',
    tags: ['autodocs'],
    render: ComplexHeader,
};

export default meta;
type Story = StoryObj<ComplexHeaderProps>;

export const Default: Story = {
    args: {
        language: 'nb',
        contextLinks: makeContextLinks(''),
        texts: texts.nb,
        context: 'privatperson',
        opsMessages: [],
    },
};
