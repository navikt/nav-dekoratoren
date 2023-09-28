import type { Preview } from '@storybook/html';
import html from 'decorator-shared/html';
import { Params } from 'decorator-shared/params';
import 'decorator-client/src/main.css';
import 'decorator-client/src/views/local-time';

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
      if (typeof story === 'string') {
        return html`<div id="header-withmenu">${story}</div>`;
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
