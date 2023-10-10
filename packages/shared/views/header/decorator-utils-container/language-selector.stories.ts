import type { StoryObj, Meta } from '@storybook/html';
import type { LanguageSelectorProps } from './language-selector';
import { LanguageSelector } from './language-selector';

const meta: Meta<LanguageSelectorProps> = {
  title: 'header/language-selector',
  tags: ['autodocs'],
  render: LanguageSelector,
};

export default meta;
type Story = StoryObj<LanguageSelectorProps>;

export const Default: Story = {
  args: {
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

export const Empty: Story = {
  args: {
    availableLanguages: [],
  },
};
