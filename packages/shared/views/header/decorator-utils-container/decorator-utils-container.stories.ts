import type { StoryObj, Meta } from '@storybook/html';
import type { DecoratorUtilsContainerProps } from '.';
import { DecoratorUtilsContainer } from '.';
import { AvailableLanguage, utilsBackgrounds } from '../../../params';

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

const breadcrumbs = [
  {
    title: 'Arbeid og opphold i Norge',
    url: '/no/person/flere-tema/arbeid-og-opphold-i-norge',
  },
  {
    title: 'Medlemskap i folketrygden',
  },
];

const availableLanguages: AvailableLanguage[] = [
  {
    locale: 'nb',
    url: 'https://www.nav.no/person/kontakt-oss',
  },
  {
    locale: 'en',
    url: 'https://www.nav.no/person/kontakt-oss/en/',
  },
];

export const Default: Story = {
  args: {
    utilsBackground: 'gray',
    breadcrumbs,
    availableLanguages,
  },
};

export const NoAvailableLanguages: Story = {
  args: {
    utilsBackground: 'gray',
    breadcrumbs,
    availableLanguages: [],
  },
};

export const NoBreadcrumbs: Story = {
  args: {
    utilsBackground: 'gray',
    breadcrumbs: [],
    availableLanguages,
  },
};
export const Empty: Story = {
  args: {
    utilsBackground: 'gray',
    breadcrumbs: [],
    availableLanguages: [],
  },
};
