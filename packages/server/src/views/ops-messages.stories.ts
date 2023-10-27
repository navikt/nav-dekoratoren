import type { StoryObj, Meta } from '@storybook/html';
import type { OpsMessagesProps } from './ops-messages';
import { OpsMessages } from './ops-messages';
import cls from 'decorator-client/src/styles/ops-messages.module.css';
import html from 'decorator-shared/html';
import { Driftsmelding } from 'decorator-shared/types';

const meta: Meta<OpsMessagesProps> = {
  title: 'ops-messages',
  render: (args) =>
    html`<ops-messages class="${cls.opsMessages}"
      >${OpsMessages(args)}</ops-messages
    >`,
};

export default meta;
type Story = StoryObj<OpsMessagesProps>;

const opsMessage: Driftsmelding = {
  heading: 'Ustabile tjenester søndag 15. januar',
  url: 'https://www.nav.no/no/driftsmeldinger/ustabile-tjenester-sondag-15.januar',
  type: 'prodstatus',
};

export const Single: Story = {
  args: {
    opsMessages: [opsMessage],
  },
};

export const Multiple: Story = {
  args: {
    opsMessages: [
      opsMessage,
      {
        heading: 'Svindelforsøk via SMS - vær oppmerksom',
        url: 'https://www.nav.no/no/driftsmeldinger/svindelforsok-via-sms-vaer-oppmerksom20231016',
        type: 'info',
      },
      opsMessage,
    ],
  },
};
