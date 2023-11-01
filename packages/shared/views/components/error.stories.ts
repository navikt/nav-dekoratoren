import type { StoryObj, Meta } from '@storybook/html';
import type { ErrorProps } from './error';
import { Error } from './error';

const meta: Meta<ErrorProps> = {
  title: 'error',
  tags: ['autodocs'],
  render: (args) => {
    return Error(args);
  },
};

export default meta;
type Story = StoryObj<ErrorProps>;

export const Default: Story = {
  args: {
    text: 'Vi har problemer med å laste inn varsler. Du kan sjekke om varsler på Min side fungerer, prøve å laste inn siden på nytt, eller prøve igjen senere. Vi beklager ulempen dette medfører.',
  },
};
