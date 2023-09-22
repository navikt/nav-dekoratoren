import type { StoryObj, Meta } from '@storybook/html';
import type { DriftsmeldingerProps } from './driftsmeldinger';
import { Driftsmeldinger } from './driftsmeldinger';

const meta: Meta<DriftsmeldingerProps> = {
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
};

export default meta;
type Story = StoryObj<DriftsmeldingerProps>;

const driftsmelding = {
  heading: 'Ustabile tjenester søndag 15. januar',
  url: 'https://www.nav.no/no/driftsmeldinger/ustabile-tjenester-sondag-15.januar',
  urlscope: [],
};

export const Single: Story = {
  args: {
    driftsmeldinger: [driftsmelding],
  },
};

export const Multiple: Story = {
  args: {
    driftsmeldinger: [driftsmelding, driftsmelding, driftsmelding],
  },
};
