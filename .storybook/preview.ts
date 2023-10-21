import type { Preview } from '@storybook/html';
import html from 'decorator-shared/html';
import { Params } from 'decorator-shared/params';
import 'decorator-client/src/main.css';
import 'decorator-client/src/views/local-time';
import 'decorator-client/src/views/loader';
import 'decorator-client/src/views/language-selector';
import 'decorator-client/src/views/menu-background';
import 'decorator-client/src/views/dropdown-menu';
import 'decorator-client/src/views/search-input';

declare global {
  interface Window {
    __DECORATOR_DATA__: {
      params: Partial<Params>;
    };
  }
}

window.__DECORATOR_DATA__ = {
  params: {
    language: 'nb',
  },
};

const preview: Preview = {
  decorators: [
    (Story) => {
      const story = Story();

      if (story === null) {
        return '';
      } else if (typeof story === 'object' && 'render' in story) {
        return html`<div id="header-withmenu">${story}</div>`.render();
      } else {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'header-withmenu');
        wrapper.appendChild(story);
        return wrapper;
      }
    },
  ],
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
