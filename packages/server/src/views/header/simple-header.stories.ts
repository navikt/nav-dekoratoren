import type { StoryObj, Meta } from '@storybook/html';
import type { SimpleHeaderProps } from './simple-header';
import { SimpleHeader } from './simple-header';
import { texts } from '../../texts';

const meta: Meta<SimpleHeaderProps> = {
  title: 'header/simple',
  tags: ['autodocs'],
  render: SimpleHeader,
};

export default meta;
type Story = StoryObj<SimpleHeaderProps>;

export const Default: Story = {
  args: {
    availableLanguages: [],
    breadcrumbs: [],
    utilsBackground: 'transparent',
    innlogget: false,
    activeContext: 'privatperson',
    texts: texts['nb'],
  },
};
