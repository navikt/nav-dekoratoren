import type { StoryObj, Meta } from '@storybook/html';
import type { DriftsmeldingerProps } from './driftsmeldinger';
import { Driftsmeldinger } from './driftsmeldinger';

// More on how to set up stories at: https://storybook.js.org/docs/html/writing-stories/introduction#default-export
const meta = {
  title: 'driftsmeldinger',
  tags: ['autodocs'],
  render: (args) => {
    return Driftsmeldinger(args);
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} satisfies Meta<DriftsmeldingerProps>;

export default meta;
type Story = StoryObj<DriftsmeldingerProps>;

export const Default: Story = {
  args: {
    driftsmeldinger: [
      {
        heading: 'heading',
        url: 'example.com',
        urlscope: ['person'],
      },
    ],
  },
};
