import type { StoryObj, Meta } from '@storybook/html';
import type { FeedbackProps } from './feedback';
import { Feedback } from './feedback';
import { texts } from '../texts';

const meta: Meta<FeedbackProps> = {
  title: 'feedback',
  tags: ['autodocs'],
  render: Feedback,
};

export default meta;
type Story = StoryObj<FeedbackProps>;

export const Default: Story = {
  args: {
    texts: texts.nb,
  },
};
