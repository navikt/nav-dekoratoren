import { html } from '@/utils';

import ToggleIconButton from './toggle-icon-button';

// For reusable components that use "slot" functionality

export function WebcomponentTemplates() {
  return html`
    ${ToggleIconButton()}

    <!-- Composing markup using predefined templates -->
    <template id="search-icon-button-template"> </template>
  `;
}
