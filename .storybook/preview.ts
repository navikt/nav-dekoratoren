import type { Preview } from '@storybook/html';
import html from 'decorator-shared/html';
import '../packages/client/src/main.css';

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
