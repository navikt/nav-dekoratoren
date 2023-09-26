import type { StoryObj, Meta } from '@storybook/html';
import type { VarslerEmptyProps } from './varsler';
import { VarslerEmptyView } from './varsler';

const meta: Meta<VarslerEmptyProps> = {
  title: 'varsler empty',
  tags: ['autodocs'],
  render: (args) => {
    return VarslerEmptyView(args);
  },
};

export default meta;
type Story = StoryObj<VarslerEmptyProps>;
export const Single: Story = {
  args: {
    texts: {
      varsler_tom_liste: 'Ingen varsler',
      varsler_tom_liste_ingress: 'Du har ingen varsler',
      varsler_vis_alle: 'Vis alle varsler',
    },
  },
};
