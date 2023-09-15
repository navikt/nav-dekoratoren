import { html } from 'decorator-shared/utils';

import ToggleIconButton from './toggle-icon-button';
import { InlineSearchTemplate, SearchHitTemplate } from './search';

// For reusable components that use "slot" functionality

export function WebcomponentTemplates() {
  return html`
    ${ToggleIconButton()} ${SearchHitTemplate()} ${InlineSearchTemplate()}

    <!-- Composing markup using predefined templates -->
    <template id="search-icon-button-template"></template>
  `;
}
