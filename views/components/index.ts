import { html } from '@/utils';

import ToggleIconButton from './icon-button';

// For reusable components that use "slot" functionality

export function WebcomponentTemplates() {
  return html` ${ToggleIconButton()} `;
}
