import type { StoryObj, Meta } from '@storybook/html';
import type { FeedbackSuccessProps } from './feedback-success';
import { FeedbackSuccess } from './feedback-success';
import { texts } from 'decorator-server/src/texts';

const meta: Meta<FeedbackSuccessProps> = {
  title: 'feedback-success',
  tags: ['autodocs'],
  render: FeedbackSuccess,
};

export default meta;
type Story = StoryObj<FeedbackSuccessProps>;

export const Default: Story = {
  args: {
    texts: texts.nb,
  },
};
