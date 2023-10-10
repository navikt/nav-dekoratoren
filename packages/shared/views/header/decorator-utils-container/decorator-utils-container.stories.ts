import type { StoryObj, Meta } from '@storybook/html';
import type { DecoratorUtilsContainerProps } from '.';
import { DecoratorUtilsContainer } from '.';
import { utilsBackgrounds } from '../../../params';

const meta: Meta<DecoratorUtilsContainerProps> = {
  title: 'header/decorator-utils-container',
  tags: ['autodocs'],
  render: DecoratorUtilsContainer,
  argTypes: {
    utilsBackground: {
      options: utilsBackgrounds,
      control: 'radio',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export default meta;
type Story = StoryObj<DecoratorUtilsContainerProps>;

export const Default: Story = {
  args: {
    utilsBackground: 'gray',
    breadcrumbs: [
      {
        title: 'Arbeid og opphold i Norge',
        url: '/no/person/flere-tema/arbeid-og-opphold-i-norge',
      },
      {
        title: 'Medlemskap i folketrygden',
      },
    ],
    availableLanguages: [
      {
        locale: 'nb',
        url: 'https://www.nav.no/person/kontakt-oss',
      },
      {
        locale: 'en',
        url: 'https://www.nav.no/person/kontakt-oss/en/',
      },
    ],
  },
};
