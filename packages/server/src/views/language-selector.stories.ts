import type { Meta, StoryObj } from '@storybook/html';
import type { LanguageSelectorProps } from './language-selector';
import { LanguageSelector } from './language-selector';
import { LanguageSelector as ClientComponent } from 'decorator-client/src/views/language-selector';

const meta: Meta<LanguageSelectorProps> = {
  title: 'header/language-selector',
  tags: ['autodocs'],
  render: (args) => {
    setTimeout(() => {
      const ls = document.querySelector(
        'nav[is="language-selector"]',
      ) as ClientComponent;
      ls.availableLanguages = args.availableLanguages;
      ls.language = 'en';
    }, 0);

    return LanguageSelector(args);
  },
};

export default meta;
type Story = StoryObj<LanguageSelectorProps>;

export const Default: Story = {
  args: {
    availableLanguages: [
      { locale: 'nb', handleInApp: true },
      { locale: 'en', url: 'https://www.nav.no/en/person', handleInApp: false },
    ],
  },
};
