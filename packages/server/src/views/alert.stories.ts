import type { StoryObj, Meta } from '@storybook/html';
import type { AlertProps } from './alert';
import { Alert } from './alert';

const meta: Meta<AlertProps> = {
  title: 'alert',
  tags: ['autodocs'],
  render: (args) => {
    return Alert(args);
  },
};

export default meta;
type Story = StoryObj<AlertProps>;

export const ErrorVariant: Story = {
  args: {
    content:
      'Vi har problemer med å laste inn varsler. Du kan sjekke om varsler på Min side fungerer, prøve å laste inn siden på nytt, eller prøve igjen senere. Vi beklager ulempen dette medfører.',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    content:
      'Vi har problemer med å laste inn varsler. Du kan sjekke om varsler på Min side fungerer, prøve å laste inn siden på nytt, eller prøve igjen senere. Vi beklager ulempen dette medfører.',
    variant: 'info',
  },
};
