import { html } from '@/utils';

import ToggleIconButton from './toggle-icon-button';
import { InlineSearchTemplate } from '../search';

// For reusable components that use "slot" functionality

export function WebcomponentTemplates() {
  return html`
    ${ToggleIconButton()} ${InlineSearchTemplate()}

    <!-- Composing markup using predefined templates -->
    <template id="search-icon-button-template"> </template>
  `;
}
