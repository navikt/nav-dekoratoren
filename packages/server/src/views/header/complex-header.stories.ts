import type { StoryObj, Meta } from '@storybook/html';
import type { ComplexHeaderProps } from './complex-header';
import { ComplexHeader } from './complex-header';
import { texts } from '../../texts';
import { makeContextLinks } from 'decorator-shared/context';

const meta: Meta<ComplexHeaderProps> = {
    title: 'header/complex-header',
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

export const LoggedInPrivatperson: Story = {
    args: {
        language: 'nb',
        contextLinks: makeContextLinks(''),
        texts: texts.nb,
        context: 'privatperson',
        opsMessages: [],
    },
};

export const LoggedInPrivatpersonMobile: Story = {
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'mobile',
        },
    },
    args: {
        language: 'nb',
        contextLinks: makeContextLinks(''),
        texts: texts.nb,
        context: 'privatperson',
        opsMessages: [],
    },
};
