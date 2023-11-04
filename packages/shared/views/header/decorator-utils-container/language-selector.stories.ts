import type { StoryObj, Meta } from '@storybook/html';
import { LanguageSelector } from './language-selector';

const meta: Meta = {
  title: 'header/language-selector',
  tags: ['autodocs'],
  render: () => {
    // @ts-expect-error: window in shared-package
    window.__DECORATOR_DATA__ = {
      params: {
        availableLanguages: [
          { locale: 'nb', handleInApp: true },
          { locale: 'en', url: 'https://www.nav.no/person/kontakt-oss/en/' },
        ],
        language: 'en',
      },
    };

    return LanguageSelector();
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
