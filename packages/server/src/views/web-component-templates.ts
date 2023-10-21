import html from 'decorator-shared/html';

import ToggleIconButton from './toggle-icon-button';
import { SearchHitTemplate } from './search';

// For reusable components that use "slot" functionality

export function WebcomponentTemplates() {
  return html`
    ${ToggleIconButton()} ${SearchHitTemplate()}

    <!-- Composing markup using predefined templates -->
    <template id="search-icon-button-template"></template>
  `;
}
