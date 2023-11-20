import type { StoryObj, Meta } from '@storybook/html';
import type { GetScreensharingModalOptions } from './screensharing-modal';
import { getModal } from './screensharing-modal';
import { texts } from 'decorator-server/src/texts';

const meta: Meta<GetScreensharingModalOptions> = {
  title: 'screensharing-modal',
  tags: ['autodocs'],
  render: (args) => {
    setTimeout(() => {
      // @ts-expect-error: document in server-package
      document.querySelector('dialog').showModal();
    }, 0);

    const div = document.createElement('div');

    div.innerHTML = getModal({
      ...args,
    }).render();

    return div;
  },
};

export default meta;
type Story = StoryObj<GetScreensharingModalOptions>;

export const Enabled: Story = {
  args: {
    texts: texts.nb,
    enabled: true,
  },
};

export const Disabled: Story = {
  args: {
    texts: texts.nb,
    enabled: false,
  },
};
