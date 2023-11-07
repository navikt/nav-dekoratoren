import type { StoryObj, Meta } from '@storybook/html';
import type { FeedbackProps } from './feedback';
import { Feedback } from './feedback';
import { texts } from '../texts';
import { FeedbackSuccess } from 'decorator-client/src/views/feedback-success';

const meta: Meta<FeedbackProps> = {
  title: 'feedback',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FeedbackProps>;

export const Default: Story = {
  render: Feedback,
  args: {
    texts: texts.nb,
  },
};

export const Success: Story = {
  render: FeedbackSuccess,
  args: {
    texts: texts.nb,
  },
};
