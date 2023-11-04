import type { StoryObj, Meta } from '@storybook/html';
import type { ScreensharingModalProps } from './screensharing-modal';
import { ScreensharingModal } from './screensharing-modal';
import { texts } from 'decorator-server/src/texts';

const meta: Meta<ScreensharingModalProps> = {
  title: 'screensharing-modal',
  tags: ['autodocs'],
  render: (args) => {
    setTimeout(() => {
      // @ts-expect-error: document in server-package
      document.querySelector('dialog').showModal();
    }, 0);

    return ScreensharingModal(args);
  },
};

export default meta;
type Story = StoryObj<ScreensharingModalProps>;

export const Default: Story = {
  args: {
    texts: texts.nb,
  },
};
